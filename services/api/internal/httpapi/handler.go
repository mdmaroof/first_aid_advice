package httpapi

import (
	"encoding/json"
	"errors"
	"log/slog"
	"net/http"
	"strings"

	"github.com/mdmaroof/first_aid_advice/services/api/internal/access"
	"github.com/mdmaroof/first_aid_advice/services/api/internal/identity"
	"github.com/mdmaroof/first_aid_advice/services/api/internal/profile"
)

type Handler struct {
	logger   *slog.Logger
	profiles profile.Repository
	access   access.Repository
	identity identity.Resolver
}

func NewHandler(logger *slog.Logger, profiles profile.Repository, accessRepository access.Repository, identityResolver identity.Resolver) *Handler {
	return &Handler{logger: logger, profiles: profiles, access: accessRepository, identity: identityResolver}
}

func (h *Handler) Routes() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /healthz", h.health)
	mux.HandleFunc("GET /v1/directory/clinics", h.listClinics)
	mux.HandleFunc("GET /v1/patients/{patientID}/profile", h.getProfile)
	mux.HandleFunc("PUT /v1/patients/{patientID}/profile", h.putProfile)
	mux.HandleFunc("GET /v1/patients/{patientID}/care-team", h.listCareTeam)
	mux.HandleFunc("POST /v1/patients/{patientID}/sharing-grants", h.createGrant)
	mux.HandleFunc("DELETE /v1/patients/{patientID}/sharing-grants/{grantID}", h.revokeGrant)
	mux.HandleFunc("GET /v1/doctor/patients", h.listDoctorPatients)
	mux.HandleFunc("GET /v1/doctor/patients/{patientID}/profile", h.getDoctorPatientProfile)
	return h.securityHeaders(h.requestLog(mux))
}

func (h *Handler) health(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
}

func (h *Handler) listClinics(w http.ResponseWriter, r *http.Request) {
	if _, ok := h.resolveActor(w, r); !ok {
		return
	}
	result, err := h.access.ListClinics(r.Context())
	if err != nil {
		h.internalError(w, "list clinics", err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"clinics": result})
}

func (h *Handler) getProfile(w http.ResponseWriter, r *http.Request) {
	patientID := r.PathValue("patientID")
	if _, ok := h.authorizePatient(w, r, patientID); !ok {
		return
	}
	h.writeProfile(w, r, patientID)
}

func (h *Handler) putProfile(w http.ResponseWriter, r *http.Request) {
	patientID := r.PathValue("patientID")
	actor, ok := h.authorizePatient(w, r, patientID)
	if !ok {
		return
	}
	r.Body = http.MaxBytesReader(w, r.Body, 64<<10)
	defer r.Body.Close()
	var input profile.Profile
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(&input); err != nil {
		writeError(w, http.StatusBadRequest, "invalid_request", "Use a valid profile payload.")
		return
	}
	input.PatientID = patientID
	if strings.TrimSpace(input.DisplayName) == "" {
		writeError(w, http.StatusBadRequest, "display_name_required", "Display name is required.")
		return
	}
	result, err := h.profiles.Upsert(r.Context(), actor.ID, input)
	if err != nil {
		h.internalError(w, "update profile", err)
		return
	}
	writeJSON(w, http.StatusOK, result)
}

func (h *Handler) listCareTeam(w http.ResponseWriter, r *http.Request) {
	patientID := r.PathValue("patientID")
	if _, ok := h.authorizePatient(w, r, patientID); !ok {
		return
	}
	grants, err := h.access.ListPatientGrants(r.Context(), patientID)
	if err != nil {
		h.internalError(w, "list care team", err)
		return
	}
	clinics, err := h.access.ListClinics(r.Context())
	if err != nil {
		h.internalError(w, "list clinics", err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"grants": grants, "clinics": clinics})
}

func (h *Handler) createGrant(w http.ResponseWriter, r *http.Request) {
	patientID := r.PathValue("patientID")
	if _, ok := h.authorizePatient(w, r, patientID); !ok {
		return
	}
	r.Body = http.MaxBytesReader(w, r.Body, 16<<10)
	defer r.Body.Close()
	var input struct {
		ClinicID string `json:"clinicId"`
		Scope    string `json:"scope"`
	}
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(&input); err != nil || strings.TrimSpace(input.ClinicID) == "" {
		writeError(w, http.StatusBadRequest, "invalid_request", "Clinic is required.")
		return
	}
	if input.Scope != "" && input.Scope != "profile.read" {
		writeError(w, http.StatusBadRequest, "invalid_scope", "Only profile.read can be granted.")
		return
	}
	result, err := h.access.GrantClinic(r.Context(), patientID, input.ClinicID, input.Scope)
	if errors.Is(err, access.ErrNotFound) {
		writeError(w, http.StatusNotFound, "clinic_not_found", "Clinic not found.")
		return
	}
	if err != nil {
		h.internalError(w, "create sharing grant", err)
		return
	}
	writeJSON(w, http.StatusCreated, result)
}

func (h *Handler) revokeGrant(w http.ResponseWriter, r *http.Request) {
	patientID := r.PathValue("patientID")
	if _, ok := h.authorizePatient(w, r, patientID); !ok {
		return
	}
	err := h.access.RevokeGrant(r.Context(), patientID, r.PathValue("grantID"))
	if errors.Is(err, access.ErrNotFound) {
		writeError(w, http.StatusNotFound, "grant_not_found", "Active sharing grant not found.")
		return
	}
	if err != nil {
		h.internalError(w, "revoke sharing grant", err)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (h *Handler) listDoctorPatients(w http.ResponseWriter, r *http.Request) {
	actor, ok := h.authorizeRole(w, r, "doctor")
	if !ok {
		return
	}
	result, err := h.access.ListDoctorPatients(r.Context(), actor.ID, r.URL.Query().Get("query"))
	if err != nil {
		h.internalError(w, "list doctor patients", err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"patients": result})
}

func (h *Handler) getDoctorPatientProfile(w http.ResponseWriter, r *http.Request) {
	actor, ok := h.authorizeRole(w, r, "doctor")
	if !ok {
		return
	}
	patientID := r.PathValue("patientID")
	allowed, err := h.access.CanDoctorReadPatient(r.Context(), actor.ID, patientID)
	if err != nil {
		h.internalError(w, "authorize doctor profile access", err)
		return
	}
	if !allowed {
		writeError(w, http.StatusForbidden, "sharing_grant_required", "An active patient sharing grant is required.")
		return
	}
	h.writeProfile(w, r, patientID)
}

func (h *Handler) writeProfile(w http.ResponseWriter, r *http.Request, patientID string) {
	result, err := h.profiles.Get(r.Context(), patientID)
	if errors.Is(err, profile.ErrNotFound) {
		writeError(w, http.StatusNotFound, "profile_not_found", "Profile not found.")
		return
	}
	if err != nil {
		h.internalError(w, "get profile", err)
		return
	}
	writeJSON(w, http.StatusOK, result)
}

func (h *Handler) resolveActor(w http.ResponseWriter, r *http.Request) (identity.Actor, bool) {
	actor, err := h.identity.Resolve(r)
	if err != nil {
		writeError(w, http.StatusUnauthorized, "unauthenticated", "A verified Curais identity is required.")
		return identity.Actor{}, false
	}
	return actor, true
}

func (h *Handler) authorizePatient(w http.ResponseWriter, r *http.Request, patientID string) (identity.Actor, bool) {
	actor, ok := h.resolveActor(w, r)
	if !ok {
		return identity.Actor{}, false
	}
	if actor.Role != "patient" || actor.ID != patientID {
		writeError(w, http.StatusForbidden, "forbidden", "This identity cannot access that patient record.")
		return identity.Actor{}, false
	}
	return actor, true
}

func (h *Handler) authorizeRole(w http.ResponseWriter, r *http.Request, role string) (identity.Actor, bool) {
	actor, ok := h.resolveActor(w, r)
	if !ok {
		return identity.Actor{}, false
	}
	if actor.Role != role {
		writeError(w, http.StatusForbidden, "forbidden", "This identity does not have the required role.")
		return identity.Actor{}, false
	}
	return actor, true
}

func (h *Handler) internalError(w http.ResponseWriter, operation string, err error) {
	h.logger.Error(operation, "error", err)
	writeError(w, http.StatusInternalServerError, "internal_error", "The request could not be completed.")
}

func (h *Handler) requestLog(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		h.logger.Info("request", "method", r.Method, "path", r.URL.Path)
		next.ServeHTTP(w, r)
	})
}
func (h *Handler) securityHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("Cache-Control", "no-store")
		next.ServeHTTP(w, r)
	})
}
func writeError(w http.ResponseWriter, status int, code, message string) {
	writeJSONStatus(w, status, map[string]any{"error": map[string]string{"code": code, "message": message}})
}
func writeJSON(w http.ResponseWriter, status int, value any) { writeJSONStatus(w, status, value) }
func writeJSONStatus(w http.ResponseWriter, status int, value any) {
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(value)
}
