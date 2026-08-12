package profile

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"strconv"
	"strings"
	"time"
)

type SQLiteRepository struct{ db *sql.DB }

func NewSQLiteRepository(db *sql.DB) *SQLiteRepository { return &SQLiteRepository{db: db} }

func (r *SQLiteRepository) Get(ctx context.Context, patientID string) (Profile, error) {
	row := r.db.QueryRowContext(ctx, `SELECT patient_id, display_name, COALESCE(date_of_birth, ''), COALESCE(blood_group, ''), COALESCE(emergency_contact_name, ''), COALESCE(emergency_contact_phone, ''), version, updated_at FROM patient_profiles WHERE patient_id = ?`, patientID)
	var result Profile
	if err := row.Scan(&result.PatientID, &result.DisplayName, &result.DateOfBirth, &result.BloodGroup, &result.EmergencyContact.Name, &result.EmergencyContact.Phone, &result.Version, &result.UpdatedAt); err != nil {
		if errors.Is(err, sql.ErrNoRows) { return Profile{}, ErrNotFound }
		return Profile{}, fmt.Errorf("get profile: %w", err)
	}

	allergyRows, err := r.db.QueryContext(ctx, `SELECT name, severity FROM patient_allergies WHERE patient_id = ? ORDER BY name`, patientID)
	if err != nil { return Profile{}, fmt.Errorf("list allergies: %w", err) }
	defer allergyRows.Close()
	result.Allergies = []Allergy{}
	for allergyRows.Next() { var item Allergy; if err := allergyRows.Scan(&item.Name, &item.Severity); err != nil { return Profile{}, err }; result.Allergies = append(result.Allergies, item) }

	medicationRows, err := r.db.QueryContext(ctx, `SELECT name, details FROM patient_medications WHERE patient_id = ? ORDER BY name`, patientID)
	if err != nil { return Profile{}, fmt.Errorf("list medications: %w", err) }
	defer medicationRows.Close()
	result.Medications = []Medication{}
	for medicationRows.Next() { var item Medication; if err := medicationRows.Scan(&item.Name, &item.Details); err != nil { return Profile{}, err }; result.Medications = append(result.Medications, item) }
	return result, nil
}

func (r *SQLiteRepository) Upsert(ctx context.Context, actorID string, input Profile) (Profile, error) {
	now := time.Now().UTC().Format(time.RFC3339Nano)
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil { return Profile{}, fmt.Errorf("begin profile update: %w", err) }
	defer tx.Rollback()

	if _, err := tx.ExecContext(ctx, `INSERT INTO users(id, role, created_at, updated_at) VALUES(?, 'patient', ?, ?) ON CONFLICT(id) DO UPDATE SET updated_at = excluded.updated_at`, input.PatientID, now, now); err != nil { return Profile{}, err }
	if _, err := tx.ExecContext(ctx, `INSERT INTO patient_profiles(patient_id, display_name, date_of_birth, blood_group, emergency_contact_name, emergency_contact_phone, version, updated_at) VALUES(?, ?, NULLIF(?, ''), NULLIF(?, ''), NULLIF(?, ''), NULLIF(?, ''), 1, ?) ON CONFLICT(patient_id) DO UPDATE SET display_name=excluded.display_name, date_of_birth=excluded.date_of_birth, blood_group=excluded.blood_group, emergency_contact_name=excluded.emergency_contact_name, emergency_contact_phone=excluded.emergency_contact_phone, version=patient_profiles.version+1, updated_at=excluded.updated_at`, input.PatientID, strings.TrimSpace(input.DisplayName), input.DateOfBirth, input.BloodGroup, input.EmergencyContact.Name, input.EmergencyContact.Phone, now); err != nil { return Profile{}, err }
	if _, err := tx.ExecContext(ctx, `DELETE FROM patient_allergies WHERE patient_id = ?`, input.PatientID); err != nil { return Profile{}, err }
	for index, item := range input.Allergies { if _, err := tx.ExecContext(ctx, `INSERT INTO patient_allergies(id, patient_id, name, severity) VALUES(?, ?, ?, ?)`, input.PatientID+"-allergy-"+strconv.Itoa(index+1), input.PatientID, strings.TrimSpace(item.Name), strings.TrimSpace(item.Severity)); err != nil { return Profile{}, err } }
	if _, err := tx.ExecContext(ctx, `DELETE FROM patient_medications WHERE patient_id = ?`, input.PatientID); err != nil { return Profile{}, err }
	for index, item := range input.Medications { if _, err := tx.ExecContext(ctx, `INSERT INTO patient_medications(id, patient_id, name, details) VALUES(?, ?, ?, ?)`, input.PatientID+"-medication-"+strconv.Itoa(index+1), input.PatientID, strings.TrimSpace(item.Name), strings.TrimSpace(item.Details)); err != nil { return Profile{}, err } }
	if _, err := tx.ExecContext(ctx, `INSERT INTO audit_events(id, actor_id, subject_id, action, resource_type, resource_id, occurred_at) VALUES(?, ?, ?, 'profile.upsert', 'patient_profile', ?, ?)`, input.PatientID+"-audit-"+strconv.FormatInt(time.Now().UnixNano(), 10), actorID, input.PatientID, input.PatientID, now); err != nil { return Profile{}, err }
	if err := tx.Commit(); err != nil { return Profile{}, fmt.Errorf("commit profile update: %w", err) }
	return r.Get(ctx, input.PatientID)
}
