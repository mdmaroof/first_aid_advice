package emr

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

func (r *SQLiteRepository) Dashboard(ctx context.Context, doctorID string) (Dashboard, error) {
	var result Dashboard
	queries := []struct {
		target *int
		query  string
		args   []any
	}{
		{&result.SharedPatients, `SELECT COUNT(DISTINCT g.patient_id) FROM clinic_memberships m JOIN sharing_grants g ON g.clinic_id=m.clinic_id AND g.status='active' WHERE m.user_id=? AND m.status='active'`, []any{doctorID}},
		{&result.TodayAppointments, `SELECT COUNT(*) FROM appointments a JOIN clinic_memberships m ON m.clinic_id=a.clinic_id AND m.user_id=? AND m.status='active' WHERE substr(a.scheduled_at,1,10)=? AND a.status!='cancelled'`, []any{doctorID, time.Now().UTC().Format("2006-01-02")}},
		{&result.DraftEncounters, `SELECT COUNT(*) FROM encounters e JOIN clinic_memberships m ON m.clinic_id=e.clinic_id AND m.user_id=? AND m.status='active' WHERE e.status='draft'`, []any{doctorID}},
		{&result.OutstandingLabOrders, `SELECT COUNT(*) FROM lab_orders l JOIN clinic_memberships m ON m.clinic_id=l.clinic_id AND m.user_id=? AND m.status='active' WHERE l.status IN ('ordered','collected')`, []any{doctorID}},
	}
	for _, item := range queries {
		if err := r.db.QueryRowContext(ctx, item.query, item.args...).Scan(item.target); err != nil {
			return Dashboard{}, err
		}
	}
	return result, nil
}

func (r *SQLiteRepository) ListAppointments(ctx context.Context, doctorID string) ([]Appointment, error) {
	rows, err := r.db.QueryContext(ctx, `SELECT a.id,a.patient_id,p.display_name,a.scheduled_at,a.duration_minutes,a.reason,a.status FROM appointments a JOIN clinic_memberships m ON m.clinic_id=a.clinic_id AND m.user_id=? AND m.status='active' JOIN patient_profiles p ON p.patient_id=a.patient_id ORDER BY a.scheduled_at DESC LIMIT 100`, doctorID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	result := []Appointment{}
	for rows.Next() {
		var item Appointment
		if err := rows.Scan(&item.ID, &item.PatientID, &item.PatientName, &item.ScheduledAt, &item.DurationMinutes, &item.Reason, &item.Status); err != nil {
			return nil, err
		}
		result = append(result, item)
	}
	return result, rows.Err()
}

func (r *SQLiteRepository) CreateAppointment(ctx context.Context, doctorID string, item Appointment) (Appointment, error) {
	clinicID, patientName, err := r.authorizedClinic(ctx, doctorID, item.PatientID)
	if err != nil {
		return Appointment{}, err
	}
	if strings.TrimSpace(item.ScheduledAt) == "" {
		return Appointment{}, ErrInvalid
	}
	if item.DurationMinutes <= 0 {
		item.DurationMinutes = 30
	}
	if item.Status == "" {
		item.Status = "scheduled"
	}
	item.ID = randomID("appt")
	item.PatientName = patientName
	now := time.Now().UTC().Format(time.RFC3339Nano)
	if _, err = r.db.ExecContext(ctx, `INSERT INTO appointments(id,clinic_id,patient_id,clinician_id,scheduled_at,duration_minutes,reason,status,created_at) VALUES(?,?,?,?,?,?,?,?,?)`, item.ID, clinicID, item.PatientID, doctorID, item.ScheduledAt, item.DurationMinutes, strings.TrimSpace(item.Reason), item.Status, now); err != nil {
		return Appointment{}, err
	}
	return item, nil
}

func (r *SQLiteRepository) ListEncounters(ctx context.Context, doctorID string) ([]Encounter, error) {
	rows, err := r.db.QueryContext(ctx, `SELECT e.id,e.patient_id,p.display_name,COALESCE(e.appointment_id,''),e.chief_complaint,e.subjective,e.objective,e.assessment,e.plan,e.blood_pressure,COALESCE(e.pulse_bpm,0),COALESCE(e.temperature_c,0),COALESCE(e.spo2_percent,0),e.status,e.created_at FROM encounters e JOIN clinic_memberships m ON m.clinic_id=e.clinic_id AND m.user_id=? AND m.status='active' JOIN patient_profiles p ON p.patient_id=e.patient_id ORDER BY e.created_at DESC LIMIT 100`, doctorID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	result := []Encounter{}
	for rows.Next() {
		var i Encounter
		if err := rows.Scan(&i.ID, &i.PatientID, &i.PatientName, &i.AppointmentID, &i.ChiefComplaint, &i.Subjective, &i.Objective, &i.Assessment, &i.Plan, &i.BloodPressure, &i.PulseBPM, &i.TemperatureC, &i.SpO2Percent, &i.Status, &i.CreatedAt); err != nil {
			return nil, err
		}
		result = append(result, i)
	}
	return result, rows.Err()
}

func (r *SQLiteRepository) CreateEncounter(ctx context.Context, doctorID string, item Encounter) (Encounter, error) {
	clinicID, patientName, err := r.authorizedClinic(ctx, doctorID, item.PatientID)
	if err != nil {
		return Encounter{}, err
	}
	if strings.TrimSpace(item.ChiefComplaint) == "" {
		return Encounter{}, ErrInvalid
	}
	if item.Status == "" {
		item.Status = "draft"
	}
	if item.Status != "draft" && item.Status != "signed" {
		return Encounter{}, ErrInvalid
	}
	item.ID = randomID("enc")
	item.PatientName = patientName
	item.CreatedAt = time.Now().UTC().Format(time.RFC3339Nano)
	var signed any
	if item.Status == "signed" {
		signed = item.CreatedAt
	}
	_, err = r.db.ExecContext(ctx, `INSERT INTO encounters(id,clinic_id,patient_id,clinician_id,appointment_id,chief_complaint,subjective,objective,assessment,plan,blood_pressure,pulse_bpm,temperature_c,spo2_percent,status,created_at,signed_at) VALUES(?,?,?,?,NULLIF(?,''),?,?,?,?,?,?,NULLIF(?,0),NULLIF(?,0),NULLIF(?,0),?,?,?)`, item.ID, clinicID, item.PatientID, doctorID, item.AppointmentID, strings.TrimSpace(item.ChiefComplaint), item.Subjective, item.Objective, item.Assessment, item.Plan, item.BloodPressure, item.PulseBPM, item.TemperatureC, item.SpO2Percent, item.Status, item.CreatedAt, signed)
	if err != nil {
		return Encounter{}, err
	}
	return item, nil
}

func (r *SQLiteRepository) ListPrescriptions(ctx context.Context, doctorID string) ([]Prescription, error) {
	rows, err := r.db.QueryContext(ctx, `SELECT x.id,x.patient_id,p.display_name,COALESCE(x.encounter_id,''),x.medication,x.dosage,x.frequency,x.duration,x.instructions,x.status,x.created_at FROM prescriptions x JOIN clinic_memberships m ON m.clinic_id=x.clinic_id AND m.user_id=? AND m.status='active' JOIN patient_profiles p ON p.patient_id=x.patient_id ORDER BY x.created_at DESC LIMIT 100`, doctorID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	result := []Prescription{}
	for rows.Next() {
		var i Prescription
		if err := rows.Scan(&i.ID, &i.PatientID, &i.PatientName, &i.EncounterID, &i.Medication, &i.Dosage, &i.Frequency, &i.Duration, &i.Instructions, &i.Status, &i.CreatedAt); err != nil {
			return nil, err
		}
		result = append(result, i)
	}
	return result, rows.Err()
}
func (r *SQLiteRepository) CreatePrescription(ctx context.Context, doctorID string, item Prescription) (Prescription, error) {
	clinicID, name, err := r.authorizedClinic(ctx, doctorID, item.PatientID)
	if err != nil {
		return Prescription{}, err
	}
	if strings.TrimSpace(item.Medication) == "" || strings.TrimSpace(item.Dosage) == "" || strings.TrimSpace(item.Frequency) == "" {
		return Prescription{}, ErrInvalid
	}
	item.ID = randomID("rx")
	item.PatientName = name
	item.Status = "active"
	item.CreatedAt = time.Now().UTC().Format(time.RFC3339Nano)
	_, err = r.db.ExecContext(ctx, `INSERT INTO prescriptions(id,clinic_id,patient_id,clinician_id,encounter_id,medication,dosage,frequency,duration,instructions,status,created_at) VALUES(?,?,?,?,NULLIF(?,''),?,?,?,?,?,'active',?)`, item.ID, clinicID, item.PatientID, doctorID, item.EncounterID, item.Medication, item.Dosage, item.Frequency, item.Duration, item.Instructions, item.CreatedAt)
	return item, err
}

func (r *SQLiteRepository) ListLabOrders(ctx context.Context, doctorID string) ([]LabOrder, error) {
	rows, err := r.db.QueryContext(ctx, `SELECT l.id,l.patient_id,p.display_name,COALESCE(l.encounter_id,''),l.test_name,l.priority,l.status,l.result,l.ordered_at FROM lab_orders l JOIN clinic_memberships m ON m.clinic_id=l.clinic_id AND m.user_id=? AND m.status='active' JOIN patient_profiles p ON p.patient_id=l.patient_id ORDER BY l.ordered_at DESC LIMIT 100`, doctorID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	result := []LabOrder{}
	for rows.Next() {
		var i LabOrder
		if err := rows.Scan(&i.ID, &i.PatientID, &i.PatientName, &i.EncounterID, &i.TestName, &i.Priority, &i.Status, &i.Result, &i.OrderedAt); err != nil {
			return nil, err
		}
		result = append(result, i)
	}
	return result, rows.Err()
}
func (r *SQLiteRepository) CreateLabOrder(ctx context.Context, doctorID string, item LabOrder) (LabOrder, error) {
	clinicID, name, err := r.authorizedClinic(ctx, doctorID, item.PatientID)
	if err != nil {
		return LabOrder{}, err
	}
	if strings.TrimSpace(item.TestName) == "" {
		return LabOrder{}, ErrInvalid
	}
	if item.Priority == "" {
		item.Priority = "routine"
	}
	if item.Priority != "routine" && item.Priority != "urgent" {
		return LabOrder{}, ErrInvalid
	}
	item.ID = randomID("lab")
	item.PatientName = name
	item.Status = "ordered"
	item.OrderedAt = time.Now().UTC().Format(time.RFC3339Nano)
	_, err = r.db.ExecContext(ctx, `INSERT INTO lab_orders(id,clinic_id,patient_id,clinician_id,encounter_id,test_name,priority,status,result,ordered_at) VALUES(?,?,?,?,NULLIF(?,''),?,?,'ordered','',?)`, item.ID, clinicID, item.PatientID, doctorID, item.EncounterID, item.TestName, item.Priority, item.OrderedAt)
	return item, err
}

func (r *SQLiteRepository) authorizedClinic(ctx context.Context, doctorID, patientID string) (string, string, error) {
	var clinicID, name string
	err := r.db.QueryRowContext(ctx, `SELECT m.clinic_id,p.display_name FROM clinic_memberships m JOIN sharing_grants g ON g.clinic_id=m.clinic_id AND g.patient_id=? AND g.status='active' JOIN patient_profiles p ON p.patient_id=g.patient_id WHERE m.user_id=? AND m.status='active' LIMIT 1`, patientID, doctorID).Scan(&clinicID, &name)
	if err == sql.ErrNoRows {
		return "", "", ErrForbidden
	}
	if err != nil {
		return "", "", fmt.Errorf("authorize clinical write: %w", err)
	}
	return clinicID, name, nil
}
func randomID(prefix string) string {
	value := make([]byte, 12)
	_, _ = rand.Read(value)
	return prefix + "-" + hex.EncodeToString(value)
}
