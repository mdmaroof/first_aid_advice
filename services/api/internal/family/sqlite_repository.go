package family

import (
	"context"
	"crypto/rand"
	"database/sql"
	"encoding/hex"
	"errors"
	"fmt"
	"strings"
	"time"
)

type SQLiteRepository struct{ db *sql.DB }
func NewSQLiteRepository(db *sql.DB) *SQLiteRepository { return &SQLiteRepository{db: db} }

func (r *SQLiteRepository) List(ctx context.Context, patientID string) ([]Link, error) {
	rows, err := r.db.QueryContext(ctx, `SELECT f.id, CASE WHEN f.requester_patient_id=? THEN f.relative_patient_id ELSE f.requester_patient_id END, CASE WHEN f.requester_patient_id=? THEN relative.display_name ELSE requester.display_name END, f.relationship, f.status, CASE WHEN f.requester_patient_id=? THEN 'outgoing' ELSE 'incoming' END, f.share_family_history, f.created_at FROM family_links f JOIN patient_profiles requester ON requester.patient_id=f.requester_patient_id JOIN patient_profiles relative ON relative.patient_id=f.relative_patient_id WHERE f.requester_patient_id=? OR f.relative_patient_id=? ORDER BY f.created_at DESC`, patientID, patientID, patientID, patientID, patientID)
	if err != nil { return nil, err }
	defer rows.Close()
	result := []Link{}
	for rows.Next() { var item Link; if err := rows.Scan(&item.ID, &item.OtherPatientID, &item.OtherDisplayName, &item.Relationship, &item.Status, &item.Direction, &item.ShareFamilyHistory, &item.CreatedAt); err != nil { return nil, err }; result = append(result, item) }
	return result, rows.Err()
}

func (r *SQLiteRepository) Invite(ctx context.Context, patientID, email, relationship string) (Link, error) {
	email = strings.ToLower(strings.TrimSpace(email)); relationship = strings.TrimSpace(relationship)
	var relativeID, displayName string
	if err := r.db.QueryRowContext(ctx, `SELECT u.id, a.display_name FROM auth_accounts a JOIN users u ON u.id=a.user_id WHERE a.email=? AND u.role='patient'`, email).Scan(&relativeID, &displayName); err != nil || relativeID == patientID { return Link{}, ErrNotFound }
	now := time.Now().UTC().Format(time.RFC3339Nano); id := id("family")
	_, err := r.db.ExecContext(ctx, `INSERT INTO family_links(id, requester_patient_id, relative_patient_id, relationship, status, share_family_history, created_at, updated_at) VALUES(?, ?, ?, ?, 'pending', 0, ?, ?) ON CONFLICT(requester_patient_id, relative_patient_id) DO UPDATE SET relationship=excluded.relationship, status='pending', share_family_history=0, updated_at=excluded.updated_at`, id, patientID, relativeID, relationship, now, now)
	if err != nil { return Link{}, err }
	return Link{ID: id, OtherPatientID: relativeID, OtherDisplayName: displayName, Relationship: relationship, Status: "pending", Direction: "outgoing", CreatedAt: now}, nil
}

func (r *SQLiteRepository) Respond(ctx context.Context, patientID, linkID string, accept, share bool) (Link, error) {
	status := "declined"; if accept { status = "active" }
	now := time.Now().UTC().Format(time.RFC3339Nano)
	result, err := r.db.ExecContext(ctx, `UPDATE family_links SET status=?, share_family_history=?, updated_at=? WHERE id=? AND relative_patient_id=? AND status='pending'`, status, boolInt(accept && share), now, linkID, patientID)
	if err != nil { return Link{}, err }; count, _ := result.RowsAffected(); if count == 0 { return Link{}, ErrNotFound }
	links, err := r.List(ctx, patientID); if err != nil { return Link{}, err }; for _, link := range links { if link.ID == linkID { return link, nil } }
	return Link{}, errors.New("updated family link unavailable")
}

func id(prefix string) string { value := make([]byte, 12); if _, err := rand.Read(value); err != nil { panic(fmt.Errorf("random id: %w", err)) }; return prefix + "-" + hex.EncodeToString(value) }
func boolInt(value bool) int { if value { return 1 }; return 0 }
