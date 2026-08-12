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
	return nil
}
