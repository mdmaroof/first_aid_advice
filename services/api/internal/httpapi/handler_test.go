package httpapi

import (
	"context"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/mdmaroof/first_aid_advice/services/api/internal/profile"
)

type stubProfiles struct{}

func (stubProfiles) Get(context.Context, string) (profile.Profile, error) {
	return profile.Profile{}, profile.ErrNotFound
}
func (stubProfiles) Upsert(context.Context, string, profile.Profile) (profile.Profile, error) {
	return profile.Profile{}, nil
}

func TestHealth(t *testing.T) {
	handler := NewHandler(slog.Default(), stubProfiles{}, "local").Routes()
	request := httptest.NewRequest(http.MethodGet, "/healthz", nil)
	response := httptest.NewRecorder()
	handler.ServeHTTP(response, request)
	if response.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", response.Code)
	}
}

func TestProfileRequiresMatchingLocalActor(t *testing.T) {
	handler := NewHandler(slog.Default(), stubProfiles{}, "local").Routes()
	request := httptest.NewRequest(http.MethodGet, "/v1/patients/patient-1/profile", nil)
	response := httptest.NewRecorder()
	handler.ServeHTTP(response, request)
	if response.Code != http.StatusForbidden {
		t.Fatalf("expected 403, got %d", response.Code)
	}
}
