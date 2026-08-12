package access

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"strings"
	"time"
)

type SQLiteRepository struct{ db *sql.DB }

func NewSQLiteRepository(db *sql.DB) *SQLiteRepository { return &SQLiteRepository{db: db} }

func (r *SQLiteRepository) ListClinics(ctx context.Context) ([]Clinic, error) {
	rows, err := r.db.QueryContext(ctx, `SELECT id, name FROM clinics WHERE status = 'active' ORDER BY name`)
	if err != nil {
		return nil, fmt.Errorf("list clinics: %w", err)
	}
	defer rows.Close()
	result := []Clinic{}
	for rows.Next() {
		var item Clinic
		if err := rows.Scan(&item.ID, &item.Name); err != nil {
			return nil, err
		}
		result = append(result, item)
	}
	return result, rows.Err()
}

func (r *SQLiteRepository) ListPatientGrants(ctx context.Context, patientID string) ([]Grant, error) {
	rows, err := r.db.QueryContext(ctx, `SELECT g.id, g.patient_id, g.clinic_id, c.name, g.scope, g.status, g.granted_at, COALESCE(g.revoked_at, '') FROM sharing_grants g JOIN clinics c ON c.id = g.clinic_id WHERE g.patient_id = ? ORDER BY g.granted_at DESC`, patientID)
	if err != nil {
		return nil, fmt.Errorf("list grants: %w", err)
	}
	defer rows.Close()
	result := []Grant{}
	for rows.Next() {
		var item Grant
		if err := rows.Scan(&item.ID, &item.PatientID, &item.ClinicID, &item.ClinicName, &item.Scope, &item.Status, &item.GrantedAt, &item.RevokedAt); err != nil {
			return nil, err
		}
		result = append(result, item)
	}
	return result, rows.Err()
}

func (r *SQLiteRepository) GrantClinic(ctx context.Context, patientID, clinicID, scope string) (Grant, error) {
	if scope == "" {
		scope = "profile.read"
	}
	now := time.Now().UTC().Format(time.RFC3339Nano)
	grantID := patientID + "-" + clinicID + "-profile"
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return Grant{}, err
	}
	defer tx.Rollback()
	var clinicName string
	if err := tx.QueryRowContext(ctx, `SELECT name FROM clinics WHERE id = ? AND status = 'active'`, clinicID).Scan(&clinicName); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return Grant{}, ErrNotFound
		}
		return Grant{}, err
	}
	if _, err := tx.ExecContext(ctx, `INSERT INTO sharing_grants(id, patient_id, clinic_id, scope, status, granted_at, revoked_at) VALUES(?, ?, ?, ?, 'active', ?, NULL) ON CONFLICT(patient_id, clinic_id, scope) DO UPDATE SET status='active', granted_at=excluded.granted_at, revoked_at=NULL`, grantID, patientID, clinicID, scope, now); err != nil {
		return Grant{}, err
	}
	if err := insertAudit(ctx, tx, grantID+"-grant-"+now, patientID, patientID, "sharing_grant.create", "sharing_grant", grantID, now); err != nil {
		return Grant{}, err
	}
	if err := tx.Commit(); err != nil {
		return Grant{}, err
	}
	return Grant{ID: grantID, PatientID: patientID, ClinicID: clinicID, ClinicName: clinicName, Scope: scope, Status: "active", GrantedAt: now}, nil
}

func (r *SQLiteRepository) RevokeGrant(ctx context.Context, patientID, grantID string) error {
	now := time.Now().UTC().Format(time.RFC3339Nano)
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()
	result, err := tx.ExecContext(ctx, `UPDATE sharing_grants SET status='revoked', revoked_at=? WHERE id=? AND patient_id=? AND status='active'`, now, grantID, patientID)
	if err != nil {
		return err
	}
	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rows == 0 {
		return ErrNotFound
	}
	if err := insertAudit(ctx, tx, grantID+"-revoke-"+now, patientID, patientID, "sharing_grant.revoke", "sharing_grant", grantID, now); err != nil {
		return err
	}
	return tx.Commit()
}

func (r *SQLiteRepository) ListDoctorPatients(ctx context.Context, doctorID, query string) ([]SharedPatient, error) {
	search := "%" + strings.ToLower(strings.TrimSpace(query)) + "%"
	rows, err := r.db.QueryContext(ctx, `SELECT p.patient_id, p.display_name, COALESCE(p.blood_group, ''), g.scope, g.granted_at, COALESCE(c.mobile_e164, '') FROM clinic_memberships m JOIN sharing_grants g ON g.clinic_id=m.clinic_id AND g.status='active' JOIN patient_profiles p ON p.patient_id=g.patient_id LEFT JOIN patient_contacts c ON c.patient_id=p.patient_id WHERE m.user_id=? AND m.status='active' AND (LOWER(p.display_name) LIKE ? OR LOWER(p.patient_id) LIKE ? OR c.mobile_e164 = ?) ORDER BY p.display_name LIMIT 50`, doctorID, search, search, strings.TrimSpace(query))
	if err != nil {
		return nil, fmt.Errorf("list doctor patients: %w", err)
	}
	defer rows.Close()
	result := []SharedPatient{}
	for rows.Next() {
		var item SharedPatient
		if err := rows.Scan(&item.PatientID, &item.DisplayName, &item.BloodGroup, &item.Scope, &item.GrantedAt, &item.MobilePhone); err != nil {
			return nil, err
		}
		result = append(result, item)
	}
	for _, item := range result {
		now := time.Now().UTC().Format(time.RFC3339Nano)
		_, _ = r.db.ExecContext(ctx, `INSERT INTO audit_events(id, actor_id, subject_id, action, resource_type, resource_id, occurred_at) VALUES(?, ?, ?, 'patient.list', 'patient_profile', ?, ?)`, doctorID+"-list-"+item.PatientID+"-"+now, doctorID, item.PatientID, item.PatientID, now)
	}
	return result, rows.Err()
}

func (r *SQLiteRepository) CanDoctorReadPatient(ctx context.Context, doctorID, patientID string) (bool, error) {
	var count int
	err := r.db.QueryRowContext(ctx, `SELECT COUNT(*) FROM clinic_memberships m JOIN sharing_grants g ON g.clinic_id=m.clinic_id AND g.status='active' WHERE m.user_id=? AND m.status='active' AND g.patient_id=? AND g.scope='profile.read'`, doctorID, patientID).Scan(&count)
	return count > 0, err
}

func insertAudit(ctx context.Context, tx *sql.Tx, id, actorID, subjectID, action, resourceType, resourceID, occurredAt string) error {
	_, err := tx.ExecContext(ctx, `INSERT INTO audit_events(id, actor_id, subject_id, action, resource_type, resource_id, occurred_at) VALUES(?, ?, ?, ?, ?, ?, ?)`, id, actorID, subjectID, action, resourceType, resourceID, occurredAt)
	return err
}
