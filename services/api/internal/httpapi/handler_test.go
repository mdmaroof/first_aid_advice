package httpapi

import (
	"context"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/mdmaroof/first_aid_advice/services/api/internal/access"
	"github.com/mdmaroof/first_aid_advice/services/api/internal/auth"
	"github.com/mdmaroof/first_aid_advice/services/api/internal/clinical"
	"github.com/mdmaroof/first_aid_advice/services/api/internal/emr"
	"github.com/mdmaroof/first_aid_advice/services/api/internal/family"
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

type stubAuth struct{}
type stubClinical struct{}

func (stubClinical) ListHistory(context.Context, string) ([]clinical.HistoryEntry, error) {
	return nil, nil
}
func (stubClinical) AddHistory(context.Context, string, string, clinical.HistoryEntry) (clinical.HistoryEntry, error) {
	return clinical.HistoryEntry{}, nil
}

type stubFamily struct{}
type stubEMR struct{}

func (stubEMR) Dashboard(context.Context, string) (emr.Dashboard, error)            { return emr.Dashboard{}, nil }
func (stubEMR) ListAppointments(context.Context, string) ([]emr.Appointment, error) { return nil, nil }
func (stubEMR) CreateAppointment(context.Context, string, emr.Appointment) (emr.Appointment, error) {
	return emr.Appointment{}, nil
}
func (stubEMR) ListEncounters(context.Context, string) ([]emr.Encounter, error) { return nil, nil }
func (stubEMR) CreateEncounter(context.Context, string, emr.Encounter) (emr.Encounter, error) {
	return emr.Encounter{}, nil
}
func (stubEMR) ListPrescriptions(context.Context, string) ([]emr.Prescription, error) {
	return nil, nil
}
func (stubEMR) CreatePrescription(context.Context, string, emr.Prescription) (emr.Prescription, error) {
	return emr.Prescription{}, nil
}
func (stubEMR) ListLabOrders(context.Context, string) ([]emr.LabOrder, error) { return nil, nil }
func (stubEMR) CreateLabOrder(context.Context, string, emr.LabOrder) (emr.LabOrder, error) {
	return emr.LabOrder{}, nil
}

func (stubFamily) List(context.Context, string) ([]family.Link, error) { return nil, nil }
func (stubFamily) Invite(context.Context, string, string, string) (family.Link, error) {
	return family.Link{}, nil
}
func (stubFamily) Respond(context.Context, string, string, bool, bool) (family.Link, error) {
	return family.Link{}, nil
}

func (stubAuth) SignUp(context.Context, string, string, string, string) (auth.Session, error) {
	return auth.Session{}, nil
}
func (stubAuth) SignIn(context.Context, string, string, string) (auth.Session, error) {
	return auth.Session{}, auth.ErrInvalidCredentials
}
func (stubAuth) CurrentUser(context.Context, string) (auth.User, error) {
	return auth.User{}, auth.ErrInvalidCredentials
}
func (stubAuth) SignOut(context.Context, string) error { return nil }

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
	return NewHandler(slog.Default(), stubProfiles{}, stubAccess{}, stubAuth{}, stubClinical{}, stubFamily{}, stubEMR{}, identity.NewLocalHeaderResolver("local")).Routes()
}

func TestHealth(t *testing.T) {
	request := httptest.NewRequest(http.MethodGet, "/healthz", nil)
	response := httptest.NewRecorder()
	newTestHandler().ServeHTTP(response, request)
	if response.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", response.Code)
	}
}

func TestSwaggerUIAndSpec(t *testing.T) {
	for _, test := range []struct {
		path        string
		contentType string
	}{
		{path: "/swagger", contentType: "text/html"},
		{path: "/swagger/", contentType: "text/html"},
		{path: "/swagger/openapi.yaml", contentType: "application/yaml"},
	} {
		request := httptest.NewRequest(http.MethodGet, test.path, nil)
		response := httptest.NewRecorder()
		newTestHandler().ServeHTTP(response, request)
		if response.Code != http.StatusOK {
			t.Fatalf("%s: expected 200, got %d", test.path, response.Code)
		}
		if contentType := response.Header().Get("Content-Type"); !strings.HasPrefix(contentType, test.contentType) {
			t.Fatalf("%s: expected %s, got %s", test.path, test.contentType, contentType)
		}
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
