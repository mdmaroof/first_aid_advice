package emr

import (
	"context"
	"path/filepath"
	"testing"

	"github.com/mdmaroof/first_aid_advice/services/api/internal/platform/database"
)

func TestClinicalWritesRequireGrant(t *testing.T) {
	ctx := context.Background()
	db, err := database.OpenSQLite(filepath.Join(t.TempDir(), "emr.db"))
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()
	if err := database.Migrate(ctx, db); err != nil {
		t.Fatal(err)
	}
	if err := database.SeedLocal(ctx, db); err != nil {
		t.Fatal(err)
	}
	repo := NewSQLiteRepository(db)
	if _, err := repo.CreateAppointment(ctx, "doctor-local-1", Appointment{PatientID: "patient-local-1", ScheduledAt: "2026-08-13T10:00:00Z"}); err != ErrForbidden {
		t.Fatalf("expected forbidden without grant, got %v", err)
	}
	if _, err := db.ExecContext(ctx, `INSERT INTO sharing_grants(id,patient_id,clinic_id,scope,status,granted_at) VALUES('grant-1','patient-local-1','clinic-local-1','profile.read','active','2026-08-12T00:00:00Z')`); err != nil {
		t.Fatal(err)
	}
	appointment, err := repo.CreateAppointment(ctx, "doctor-local-1", Appointment{PatientID: "patient-local-1", ScheduledAt: "2026-08-13T10:00:00Z", Reason: "Follow-up"})
	if err != nil {
		t.Fatal(err)
	}
	if appointment.ID == "" {
		t.Fatal("expected appointment id")
	}
	encounter, err := repo.CreateEncounter(ctx, "doctor-local-1", Encounter{PatientID: "patient-local-1", ChiefComplaint: "Headache", Status: "signed", PulseBPM: 72})
	if err != nil {
		t.Fatal(err)
	}
	if encounter.Status != "signed" {
		t.Fatal("expected signed encounter")
	}
	if _, err := repo.CreatePrescription(ctx, "doctor-local-1", Prescription{PatientID: "patient-local-1", Medication: "Paracetamol", Dosage: "500 mg", Frequency: "twice daily"}); err != nil {
		t.Fatal(err)
	}
	if _, err := repo.CreateLabOrder(ctx, "doctor-local-1", LabOrder{PatientID: "patient-local-1", TestName: "CBC", Priority: "routine"}); err != nil {
		t.Fatal(err)
	}
	dashboard, err := repo.Dashboard(ctx, "doctor-local-1")
	if err != nil {
		t.Fatal(err)
	}
	if dashboard.SharedPatients != 1 || dashboard.OutstandingLabOrders != 1 {
		t.Fatalf("unexpected dashboard: %#v", dashboard)
	}
}
