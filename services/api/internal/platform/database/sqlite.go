package database

import (
	"context"
	"database/sql"
	"fmt"
	"os"
	"path/filepath"

	_ "modernc.org/sqlite"
)

func OpenSQLite(path string) (*sql.DB, error) {
	if err := os.MkdirAll(filepath.Dir(path), 0o750); err != nil {
		return nil, fmt.Errorf("create database directory: %w", err)
	}

	db, err := sql.Open("sqlite", path+"?_pragma=foreign_keys(1)&_pragma=busy_timeout(5000)&_pragma=journal_mode(WAL)")
	if err != nil {
		return nil, fmt.Errorf("open sqlite: %w", err)
	}
	db.SetMaxOpenConns(1)

	if err := db.Ping(); err != nil {
		db.Close()
		return nil, fmt.Errorf("ping sqlite: %w", err)
	}
	return db, nil
}

func Migrate(ctx context.Context, db *sql.DB) error {
	statements := []string{
		`CREATE TABLE IF NOT EXISTS users (
			id TEXT PRIMARY KEY,
			role TEXT NOT NULL CHECK (role IN ('patient', 'doctor', 'clinic_admin', 'assistant')),
			created_at TEXT NOT NULL,
			updated_at TEXT NOT NULL
		)`,
		`CREATE TABLE IF NOT EXISTS patient_profiles (
			patient_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
			display_name TEXT NOT NULL DEFAULT '',
			date_of_birth TEXT,
			blood_group TEXT,
			emergency_contact_name TEXT,
			emergency_contact_phone TEXT,
			version INTEGER NOT NULL DEFAULT 1,
			updated_at TEXT NOT NULL
		)`,
		`CREATE TABLE IF NOT EXISTS auth_accounts (
			user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
			email TEXT NOT NULL UNIQUE,
			password_hash TEXT NOT NULL,
			display_name TEXT NOT NULL,
			created_at TEXT NOT NULL
		)`,
		`CREATE TABLE IF NOT EXISTS auth_sessions (
			token_hash TEXT PRIMARY KEY,
			user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
			created_at TEXT NOT NULL,
			expires_at TEXT NOT NULL
		)`,
		`CREATE INDEX IF NOT EXISTS idx_auth_sessions_expiry ON auth_sessions(expires_at)`,
		`CREATE TABLE IF NOT EXISTS patient_contacts (
			patient_id TEXT PRIMARY KEY REFERENCES patient_profiles(patient_id) ON DELETE CASCADE,
			mobile_e164 TEXT NOT NULL UNIQUE,
			verified_at TEXT
		)`,
		`CREATE TABLE IF NOT EXISTS medical_history_entries (
			id TEXT PRIMARY KEY,
			patient_id TEXT NOT NULL REFERENCES patient_profiles(patient_id) ON DELETE CASCADE,
			category TEXT NOT NULL CHECK (category IN ('condition', 'procedure', 'diagnosis', 'visit', 'family_history', 'other')),
			title TEXT NOT NULL,
			details TEXT NOT NULL DEFAULT '',
			occurred_at TEXT,
			source TEXT NOT NULL CHECK (source IN ('patient', 'doctor')),
			recorded_by TEXT NOT NULL REFERENCES users(id),
			created_at TEXT NOT NULL
		)`,
		`CREATE INDEX IF NOT EXISTS idx_history_patient_time ON medical_history_entries(patient_id, occurred_at DESC, created_at DESC)`,
		`CREATE TABLE IF NOT EXISTS family_links (
			id TEXT PRIMARY KEY,
			requester_patient_id TEXT NOT NULL REFERENCES patient_profiles(patient_id) ON DELETE CASCADE,
			relative_patient_id TEXT NOT NULL REFERENCES patient_profiles(patient_id) ON DELETE CASCADE,
			relationship TEXT NOT NULL,
			status TEXT NOT NULL CHECK (status IN ('pending', 'active', 'declined', 'revoked')),
			share_family_history INTEGER NOT NULL DEFAULT 0,
			created_at TEXT NOT NULL,
			updated_at TEXT NOT NULL,
			UNIQUE(requester_patient_id, relative_patient_id)
		)`,
		`CREATE TABLE IF NOT EXISTS patient_allergies (
			id TEXT PRIMARY KEY,
			patient_id TEXT NOT NULL REFERENCES patient_profiles(patient_id) ON DELETE CASCADE,
			name TEXT NOT NULL,
			severity TEXT NOT NULL DEFAULT '',
			UNIQUE(patient_id, name)
		)`,
		`CREATE TABLE IF NOT EXISTS patient_medications (
			id TEXT PRIMARY KEY,
			patient_id TEXT NOT NULL REFERENCES patient_profiles(patient_id) ON DELETE CASCADE,
			name TEXT NOT NULL,
			details TEXT NOT NULL DEFAULT '',
			UNIQUE(patient_id, name)
		)`,
		`CREATE TABLE IF NOT EXISTS clinics (
			id TEXT PRIMARY KEY,
			name TEXT NOT NULL,
			kind TEXT NOT NULL DEFAULT 'clinic' CHECK (kind IN ('clinic', 'hospital')),
			status TEXT NOT NULL CHECK (status IN ('active', 'disabled')),
			created_at TEXT NOT NULL
		)`,
		`CREATE TABLE IF NOT EXISTS clinic_memberships (
			clinic_id TEXT NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
			user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
			role TEXT NOT NULL CHECK (role IN ('owner', 'doctor', 'assistant')),
			status TEXT NOT NULL CHECK (status IN ('active', 'disabled')),
			created_at TEXT NOT NULL,
			PRIMARY KEY(clinic_id, user_id)
		)`,
		`CREATE TABLE IF NOT EXISTS sharing_grants (
			id TEXT PRIMARY KEY,
			patient_id TEXT NOT NULL REFERENCES patient_profiles(patient_id) ON DELETE CASCADE,
			clinic_id TEXT NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
			scope TEXT NOT NULL CHECK (scope IN ('profile.read')),
			status TEXT NOT NULL CHECK (status IN ('active', 'revoked')),
			granted_at TEXT NOT NULL,
			revoked_at TEXT,
			UNIQUE(patient_id, clinic_id, scope)
		)`,
		`CREATE TABLE IF NOT EXISTS audit_events (
			id TEXT PRIMARY KEY,
			actor_id TEXT NOT NULL,
			subject_id TEXT NOT NULL,
			action TEXT NOT NULL,
			resource_type TEXT NOT NULL,
			resource_id TEXT NOT NULL,
			occurred_at TEXT NOT NULL
		)`,
		`CREATE INDEX IF NOT EXISTS idx_audit_subject_time ON audit_events(subject_id, occurred_at DESC)`,
	}

	for _, statement := range statements {
		if _, err := db.ExecContext(ctx, statement); err != nil {
			return fmt.Errorf("run migration: %w", err)
		}
	}
	if err := ensureColumn(ctx, db, "clinics", "kind", "TEXT NOT NULL DEFAULT 'clinic'"); err != nil {
		return err
	}
	return nil
}

func ensureColumn(ctx context.Context, db *sql.DB, table, column, definition string) error {
	rows, err := db.QueryContext(ctx, "PRAGMA table_info("+table+")")
	if err != nil {
		return err
	}
	found := false
	for rows.Next() {
		var cid, notNull, primaryKey int
		var name, kind string
		var defaultValue any
		if err := rows.Scan(&cid, &name, &kind, &notNull, &defaultValue, &primaryKey); err != nil {
			rows.Close()
			return err
		}
		if name == column {
			found = true
		}
	}
	if err := rows.Close(); err != nil {
		return err
	}
	if found {
		return nil
	}
	if _, err := db.ExecContext(ctx, "ALTER TABLE "+table+" ADD COLUMN "+column+" "+definition); err != nil {
		return fmt.Errorf("add %s.%s: %w", table, column, err)
	}
	return nil
}

func SeedLocal(ctx context.Context, db *sql.DB) error {
	now := "2026-01-01T00:00:00Z"
	statements := []struct {
		query string
		args  []any
	}{
		{`INSERT INTO users(id, role, created_at, updated_at) VALUES(?, 'patient', ?, ?) ON CONFLICT(id) DO NOTHING`, []any{"patient-local-1", now, now}},
		{`INSERT INTO patient_profiles(patient_id, display_name, version, updated_at) VALUES(?, ?, 1, ?) ON CONFLICT(patient_id) DO NOTHING`, []any{"patient-local-1", "Local Patient", now}},
		{`INSERT INTO users(id, role, created_at, updated_at) VALUES(?, 'doctor', ?, ?) ON CONFLICT(id) DO NOTHING`, []any{"doctor-local-1", now, now}},
		{`INSERT INTO clinics(id, name, kind, status, created_at) VALUES(?, ?, 'clinic', 'active', ?) ON CONFLICT(id) DO NOTHING`, []any{"clinic-local-1", "Curais Community Clinic", now}},
		{`INSERT INTO clinics(id, name, kind, status, created_at) VALUES(?, ?, 'hospital', 'active', ?) ON CONFLICT(id) DO NOTHING`, []any{"hospital-local-1", "Curais General Hospital", now}},
		{`INSERT INTO clinic_memberships(clinic_id, user_id, role, status, created_at) VALUES(?, ?, 'doctor', 'active', ?) ON CONFLICT(clinic_id, user_id) DO NOTHING`, []any{"clinic-local-1", "doctor-local-1", now}},
	}
	for _, statement := range statements {
		if _, err := db.ExecContext(ctx, statement.query, statement.args...); err != nil {
			return fmt.Errorf("seed local database: %w", err)
		}
	}
	return nil
}
