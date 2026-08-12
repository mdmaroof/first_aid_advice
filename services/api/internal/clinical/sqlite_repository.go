package clinical

import (
	"context"
	"crypto/rand"
	"database/sql"
	"encoding/hex"
	"fmt"
	"strings"
	"time"
)

type SQLiteRepository struct{ db *sql.DB }

func NewSQLiteRepository(db *sql.DB) *SQLiteRepository { return &SQLiteRepository{db: db} }

func (r *SQLiteRepository) ListHistory(ctx context.Context, patientID string) ([]HistoryEntry, error) {
	rows, err := r.db.QueryContext(ctx, `SELECT id, patient_id, category, title, details, COALESCE(occurred_at, ''), source, recorded_by, created_at FROM medical_history_entries WHERE patient_id=? ORDER BY COALESCE(occurred_at, created_at) DESC, created_at DESC`, patientID)
	if err != nil { return nil, err }
	defer rows.Close()
	result := []HistoryEntry{}
	for rows.Next() {
		var item HistoryEntry
		if err := rows.Scan(&item.ID, &item.PatientID, &item.Category, &item.Title, &item.Details, &item.OccurredAt, &item.Source, &item.RecordedBy, &item.CreatedAt); err != nil { return nil, err }
		result = append(result, item)
	}
	return result, rows.Err()
}

func (r *SQLiteRepository) AddHistory(ctx context.Context, actorID, source string, input HistoryEntry) (HistoryEntry, error) {
	input.Title = strings.TrimSpace(input.Title)
	input.Details = strings.TrimSpace(input.Details)
	if input.Title == "" || !validCategory(input.Category) { return HistoryEntry{}, fmt.Errorf("invalid history entry") }
	input.ID = randomID("history")
	input.Source = source
	input.RecordedBy = actorID
	input.CreatedAt = time.Now().UTC().Format(time.RFC3339Nano)
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil { return HistoryEntry{}, err }
	defer tx.Rollback()
	if _, err := tx.ExecContext(ctx, `INSERT INTO medical_history_entries(id, patient_id, category, title, details, occurred_at, source, recorded_by, created_at) VALUES(?, ?, ?, ?, ?, NULLIF(?, ''), ?, ?, ?)`, input.ID, input.PatientID, input.Category, input.Title, input.Details, input.OccurredAt, input.Source, input.RecordedBy, input.CreatedAt); err != nil { return HistoryEntry{}, err }
	if _, err := tx.ExecContext(ctx, `INSERT INTO audit_events(id, actor_id, subject_id, action, resource_type, resource_id, occurred_at) VALUES(?, ?, ?, 'history.create', 'medical_history_entry', ?, ?)`, randomID("audit"), actorID, input.PatientID, input.ID, input.CreatedAt); err != nil { return HistoryEntry{}, err }
	if err := tx.Commit(); err != nil { return HistoryEntry{}, err }
	return input, nil
}

func validCategory(value string) bool {
	switch value { case "condition", "procedure", "diagnosis", "visit", "family_history", "other": return true }
	return false
}

func randomID(prefix string) string { value := make([]byte, 12); _, _ = rand.Read(value); return prefix + "-" + hex.EncodeToString(value) }
