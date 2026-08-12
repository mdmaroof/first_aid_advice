package httpapi

import (
	"context"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/mdmaroof/first_aid_advice/services/api/internal/access"
	"github.com/mdmaroof/first_aid_advice/services/api/internal/identity"
	"github.com/mdmaroof/first_aid_advice/services/api/internal/profile"
)

type stubProfiles struct{}

func (stubProfiles) Get(context.Context, string) (profile.Profile, error) {
	return profile.Profile{}, profile.ErrNotFound
}
func (stubProfiles) Upsert(context.Context, string, profile.Profile) (profile.Profile, error) {
	return profile.Profile{}, nil
}

type stubAccess struct{}

func (stubAccess) ListClinics(context.Context) ([]access.Clinic, error)              { return nil, nil }
func (stubAccess) ListPatientGrants(context.Context, string) ([]access.Grant, error) { return nil, nil }
func (stubAccess) GrantClinic(context.Context, string, string, string) (access.Grant, error) {
	return access.Grant{}, nil
}
func (stubAccess) RevokeGrant(context.Context, string, string) error { return nil }
func (stubAccess) ListDoctorPatients(context.Context, string, string) ([]access.SharedPatient, error) {
	return nil, nil
}
func (stubAccess) CanDoctorReadPatient(context.Context, string, string) (bool, error) {
	return false, nil
}

func newTestHandler() http.Handler {
	return NewHandler(slog.Default(), stubProfiles{}, stubAccess{}, identity.NewLocalHeaderResolver("local")).Routes()
}

func TestHealth(t *testing.T) {
	request := httptest.NewRequest(http.MethodGet, "/healthz", nil)
	response := httptest.NewRecorder()
	newTestHandler().ServeHTTP(response, request)
	if response.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", response.Code)
	}
}

func TestProfileRequiresIdentity(t *testing.T) {
	request := httptest.NewRequest(http.MethodGet, "/v1/patients/patient-1/profile", nil)
	response := httptest.NewRecorder()
	newTestHandler().ServeHTTP(response, request)
	if response.Code != http.StatusUnauthorized {
		t.Fatalf("expected 401, got %d", response.Code)
	}
}

func TestProfileRejectsMismatchedPatient(t *testing.T) {
	request := httptest.NewRequest(http.MethodGet, "/v1/patients/patient-1/profile", nil)
	request.Header.Set("X-Curais-Actor-ID", "patient-2")
	request.Header.Set("X-Curais-Actor-Role", "patient")
	response := httptest.NewRecorder()
	newTestHandler().ServeHTTP(response, request)
	if response.Code != http.StatusForbidden {
		t.Fatalf("expected 403, got %d", response.Code)
	}
}

func TestDoctorProfileRequiresGrant(t *testing.T) {
	request := httptest.NewRequest(http.MethodGet, "/v1/doctor/patients/patient-1/profile", nil)
	request.Header.Set("X-Curais-Actor-ID", "doctor-1")
	request.Header.Set("X-Curais-Actor-Role", "doctor")
	response := httptest.NewRecorder()
	newTestHandler().ServeHTTP(response, request)
	if response.Code != http.StatusForbidden {
		t.Fatalf("expected 403, got %d", response.Code)
	}
}
