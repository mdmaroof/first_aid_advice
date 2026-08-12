package auth

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"database/sql"
	"encoding/base64"
	"encoding/hex"
	"errors"
	"fmt"
	"net/mail"
	"strings"
	"time"

	"github.com/mdmaroof/first_aid_advice/services/api/internal/identity"
)

const sessionLifetime = 7 * 24 * time.Hour

type SQLiteRepository struct {
	db                  *sql.DB
	joinLocalDemoClinic bool
}

func NewSQLiteRepository(db *sql.DB, joinLocalDemoClinic ...bool) *SQLiteRepository {
	return &SQLiteRepository{db: db, joinLocalDemoClinic: len(joinLocalDemoClinic) > 0 && joinLocalDemoClinic[0]}
}

func (r *SQLiteRepository) SignUp(ctx context.Context, email, password, displayName, role string) (Session, error) {
	email = normalizeEmail(email)
	displayName = strings.TrimSpace(displayName)
	if !validEmail(email) || len(password) < 10 || displayName == "" {
		return Session{}, ErrInvalidCredentials
	}
	if role != "patient" && role != "doctor" {
		return Session{}, ErrInvalidRole
	}
	passwordHash, err := hashPassword(password)
	if err != nil {
		return Session{}, err
	}
	now := time.Now().UTC()
	userID, err := randomID(role)
	if err != nil {
		return Session{}, err
	}
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return Session{}, err
	}
	defer tx.Rollback()
	if _, err = tx.ExecContext(ctx, `INSERT INTO users(id, role, created_at, updated_at) VALUES(?, ?, ?, ?)`, userID, role, now.Format(time.RFC3339Nano), now.Format(time.RFC3339Nano)); err != nil {
		return Session{}, err
	}
	if _, err = tx.ExecContext(ctx, `INSERT INTO auth_accounts(user_id, email, password_hash, display_name, created_at) VALUES(?, ?, ?, ?, ?)`, userID, email, passwordHash, displayName, now.Format(time.RFC3339Nano)); err != nil {
		if strings.Contains(strings.ToLower(err.Error()), "unique") {
			return Session{}, ErrEmailTaken
		}
		return Session{}, err
	}
	if role == "patient" {
		if _, err = tx.ExecContext(ctx, `INSERT INTO patient_profiles(patient_id, display_name, version, updated_at) VALUES(?, ?, 1, ?)`, userID, displayName, now.Format(time.RFC3339Nano)); err != nil {
			return Session{}, err
		}
	}
	if role == "doctor" && r.joinLocalDemoClinic {
		if _, err = tx.ExecContext(ctx, `INSERT INTO clinic_memberships(clinic_id, user_id, role, status, created_at) VALUES('clinic-local-1', ?, 'doctor', 'active', ?) ON CONFLICT(clinic_id, user_id) DO NOTHING`, userID, now.Format(time.RFC3339Nano)); err != nil {
			return Session{}, err
		}
	}
	if err = tx.Commit(); err != nil {
		return Session{}, err
	}
	return r.createSession(ctx, User{ID: userID, Email: email, DisplayName: displayName, Role: role})
}

func (r *SQLiteRepository) SignIn(ctx context.Context, email, password, expectedRole string) (Session, error) {
	row := r.db.QueryRowContext(ctx, `SELECT u.id, a.email, a.display_name, u.role, a.password_hash FROM auth_accounts a JOIN users u ON u.id = a.user_id WHERE a.email = ?`, normalizeEmail(email))
	var user User
	var passwordHash string
	if err := row.Scan(&user.ID, &user.Email, &user.DisplayName, &user.Role, &passwordHash); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return Session{}, ErrInvalidCredentials
		}
		return Session{}, err
	}
	if !verifyPassword(passwordHash, password) || (expectedRole != "" && user.Role != expectedRole) {
		return Session{}, ErrInvalidCredentials
	}
	return r.createSession(ctx, user)
}

func (r *SQLiteRepository) resolveUserSession(ctx context.Context, token string) (User, error) {
	row := r.db.QueryRowContext(ctx, `SELECT u.id, a.email, a.display_name, u.role FROM auth_sessions s JOIN users u ON u.id = s.user_id JOIN auth_accounts a ON a.user_id = u.id WHERE s.token_hash = ? AND s.expires_at > ?`, tokenHash(token), time.Now().UTC().Format(time.RFC3339Nano))
	var user User
	if err := row.Scan(&user.ID, &user.Email, &user.DisplayName, &user.Role); err != nil {
		return User{}, ErrInvalidCredentials
	}
	return user, nil
}

func (r *SQLiteRepository) ResolveSession(ctx context.Context, token string) (identity.Actor, error) {
	user, err := r.resolveUserSession(ctx, token)
	if err != nil {
		return identity.Actor{}, err
	}
	return identity.Actor{ID: user.ID, Role: user.Role}, nil
}

func (r *SQLiteRepository) CurrentUser(ctx context.Context, token string) (User, error) {
	return r.resolveUserSession(ctx, token)
}

func (r *SQLiteRepository) SignOut(ctx context.Context, token string) error {
	_, err := r.db.ExecContext(ctx, `DELETE FROM auth_sessions WHERE token_hash = ?`, tokenHash(token))
	return err
}

func (r *SQLiteRepository) createSession(ctx context.Context, user User) (Session, error) {
	raw := make([]byte, 32)
	if _, err := rand.Read(raw); err != nil {
		return Session{}, err
	}
	token := base64.RawURLEncoding.EncodeToString(raw)
	now := time.Now().UTC()
	expiresAt := now.Add(sessionLifetime)
	if _, err := r.db.ExecContext(ctx, `INSERT INTO auth_sessions(token_hash, user_id, created_at, expires_at) VALUES(?, ?, ?, ?)`, tokenHash(token), user.ID, now.Format(time.RFC3339Nano), expiresAt.Format(time.RFC3339Nano)); err != nil {
		return Session{}, fmt.Errorf("create session: %w", err)
	}
	return Session{Token: token, ExpiresAt: expiresAt.Format(time.RFC3339Nano), User: user}, nil
}

func normalizeEmail(value string) string { return strings.ToLower(strings.TrimSpace(value)) }

func validEmail(value string) bool {
	parsed, err := mail.ParseAddress(value)
	return err == nil && parsed.Address == value && len(value) <= 254
}

func randomID(prefix string) (string, error) {
	value := make([]byte, 12)
	if _, err := rand.Read(value); err != nil {
		return "", err
	}
	return prefix + "-" + hex.EncodeToString(value), nil
}

func tokenHash(token string) string {
	sum := sha256.Sum256([]byte(token))
	return hex.EncodeToString(sum[:])
}
