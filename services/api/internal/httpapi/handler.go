package httpapi

import (
	"encoding/json"
	"errors"
	"log/slog"
	"net/http"
	"strings"

	"github.com/curais/curais/services/api/internal/profile"
)

type Handler struct {
	logger      *slog.Logger
	profiles    profile.Repository
	environment string
}

func NewHandler(logger *slog.Logger, profiles profile.Repository, environment string) *Handler {
	return &Handler{logger: logger, profiles: profiles, environment: environment}
}

func (h *Handler) Routes() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /healthz", h.health)
	mux.HandleFunc("GET /v1/patients/{patientID}/profile", h.getProfile)
	mux.HandleFunc("PUT /v1/patients/{patientID}/profile", h.putProfile)
	return h.securityHeaders(h.requestLog(mux))
}

func (h *Handler) health(w http.ResponseWriter, _ *http.Request) { writeJSON(w, http.StatusOK, map[string]string{"status": "ok"}) }

func (h *Handler) getProfile(w http.ResponseWriter, r *http.Request) {
	patientID := r.PathValue("patientID")
	if !h.authorizePatient(w, r, patientID) { return }
	result, err := h.profiles.Get(r.Context(), patientID)
	if errors.Is(err, profile.ErrNotFound) { writeError(w, http.StatusNotFound, "profile_not_found", "Profile not found."); return }
	if err != nil { h.logger.Error("get profile", "error", err); writeError(w, http.StatusInternalServerError, "internal_error", "Unable to load profile."); return }
	writeJSON(w, http.StatusOK, result)
}

func (h *Handler) putProfile(w http.ResponseWriter, r *http.Request) {
	patientID := r.PathValue("patientID")
	if !h.authorizePatient(w, r, patientID) { return }
	r.Body = http.MaxBytesReader(w, r.Body, 64<<10)
	defer r.Body.Close()
	var input profile.Profile
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(&input); err != nil { writeError(w, http.StatusBadRequest, "invalid_request", "Use a valid profile payload."); return }
	input.PatientID = patientID
	if strings.TrimSpace(input.DisplayName) == "" { writeError(w, http.StatusBadRequest, "display_name_required", "Display name is required."); return }
	result, err := h.profiles.Upsert(r.Context(), r.Header.Get("X-Curais-Actor-ID"), input)
	if err != nil { h.logger.Error("update profile", "error", err); writeError(w, http.StatusInternalServerError, "internal_error", "Unable to save profile."); return }
	writeJSON(w, http.StatusOK, result)
}

func (h *Handler) authorizePatient(w http.ResponseWriter, r *http.Request, patientID string) bool {
	if h.environment != "local" { writeError(w, http.StatusServiceUnavailable, "identity_not_configured", "Production identity is not configured."); return false }
	if r.Header.Get("X-Curais-Actor-Role") != "patient" || r.Header.Get("X-Curais-Actor-ID") != patientID { writeError(w, http.StatusForbidden, "forbidden", "This local request is not authorized for that profile."); return false }
	return true
}

func (h *Handler) requestLog(next http.Handler) http.Handler { return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) { h.logger.Info("request", "method", r.Method, "path", r.URL.Path); next.ServeHTTP(w, r) }) }
func (h *Handler) securityHeaders(next http.Handler) http.Handler { return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) { w.Header().Set("Content-Type", "application/json"); w.Header().Set("X-Content-Type-Options", "nosniff"); w.Header().Set("Cache-Control", "no-store"); next.ServeHTTP(w, r) }) }

func writeError(w http.ResponseWriter, status int, code, message string) { writeJSONStatus(w, status, map[string]any{"error": map[string]string{"code": code, "message": message}}) }
func writeJSON(w http.ResponseWriter, status int, value any) { writeJSONStatus(w, status, value) }
func writeJSONStatus(w http.ResponseWriter, status int, value any) { w.WriteHeader(status); _ = json.NewEncoder(w).Encode(value) }
