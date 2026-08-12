package access

import (
	"context"
	"path/filepath"
	"testing"

	"github.com/mdmaroof/first_aid_advice/services/api/internal/platform/database"
)

func TestGrantControlsDoctorPatientAccess(t *testing.T) {
	ctx := context.Background()
	db, err := database.OpenSQLite(filepath.Join(t.TempDir(), "curais.db"))
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

	repository := NewSQLiteRepository(db)
	grant, err := repository.GrantClinic(ctx, "patient-local-1", "clinic-local-1", "profile.read")
	if err != nil {
		t.Fatal(err)
	}
	allowed, err := repository.CanDoctorReadPatient(ctx, "doctor-local-1", "patient-local-1")
	if err != nil || !allowed {
		t.Fatalf("expected doctor access after grant, allowed=%v err=%v", allowed, err)
	}
	patients, err := repository.ListDoctorPatients(ctx, "doctor-local-1", "Local")
	if err != nil || len(patients) != 1 {
		t.Fatalf("expected one shared patient, got %#v err=%v", patients, err)
	}
	if err := repository.RevokeGrant(ctx, "patient-local-1", grant.ID); err != nil {
		t.Fatal(err)
	}
	allowed, err = repository.CanDoctorReadPatient(ctx, "doctor-local-1", "patient-local-1")
	if err != nil || allowed {
		t.Fatalf("expected access revoked, allowed=%v err=%v", allowed, err)
	}
}
