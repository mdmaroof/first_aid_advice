package profile

import (
	"context"
	"path/filepath"
	"testing"

	"github.com/mdmaroof/first_aid_advice/services/api/internal/platform/database"
)

func TestSQLiteRepositoryRoundTrip(t *testing.T) {
	db, err := database.OpenSQLite(filepath.Join(t.TempDir(), "curais.db"))
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()
	if err := database.Migrate(context.Background(), db); err != nil {
		t.Fatal(err)
	}

	repository := NewSQLiteRepository(db)
	saved, err := repository.Upsert(context.Background(), "patient-1", Profile{
		PatientID: "patient-1", DisplayName: "Patient One", BloodGroup: "O+",
		Allergies:   []Allergy{{Name: "Peanuts", Severity: "high"}},
		Medications: []Medication{{Name: "Medicine", Details: "daily"}},
	})
	if err != nil {
		t.Fatal(err)
	}
	if saved.Version != 1 || len(saved.Allergies) != 1 || len(saved.Medications) != 1 {
		t.Fatalf("unexpected saved profile: %#v", saved)
	}

	updated, err := repository.Upsert(context.Background(), "patient-1", saved)
	if err != nil {
		t.Fatal(err)
	}
	if updated.Version != 2 {
		t.Fatalf("expected version 2, got %d", updated.Version)
	}
}
