package httpapi

import (
	"encoding/json"
	"errors"
	"log/slog"
	"net/http"
	"strings"

	"github.com/mdmaroof/first_aid_advice/services/api/internal/access"
	"github.com/mdmaroof/first_aid_advice/services/api/internal/auth"
	"github.com/mdmaroof/first_aid_advice/services/api/internal/clinical"
	"github.com/mdmaroof/first_aid_advice/services/api/internal/emr"
	"github.com/mdmaroof/first_aid_advice/services/api/internal/family"
	"github.com/mdmaroof/first_aid_advice/services/api/internal/identity"
	"github.com/mdmaroof/first_aid_advice/services/api/internal/profile"
)

type Handler struct {
	logger   *slog.Logger
	profiles profile.Repository
	access   access.Repository
	auth     auth.Repository
	clinical clinical.Repository
	family   family.Repository
	emr      emr.Repository
	identity identity.Resolver
}

func NewHandler(logger *slog.Logger, profiles profile.Repository, accessRepository access.Repository, authRepository auth.Repository, clinicalRepository clinical.Repository, familyRepository family.Repository, emrRepository emr.Repository, identityResolver identity.Resolver) *Handler {
	return &Handler{logger: logger, profiles: profiles, access: accessRepository, auth: authRepository, clinical: clinicalRepository, family: familyRepository, emr: emrRepository, identity: identityResolver}
}

func (h *Handler) Routes() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /healthz", h.health)
	mux.HandleFunc("GET /swagger", h.swaggerUI)
	mux.HandleFunc("GET /swagger/", h.swaggerUI)
	mux.HandleFunc("GET /swagger/openapi.yaml", h.swaggerSpec)
	mux.HandleFunc("POST /v1/auth/signup", h.signUp)
	mux.HandleFunc("POST /v1/auth/signin", h.signIn)
	mux.HandleFunc("GET /v1/auth/me", h.currentUser)
	mux.HandleFunc("POST /v1/auth/signout", h.signOut)
	mux.HandleFunc("GET /v1/directory/clinics", h.listClinics)
	mux.HandleFunc("GET /v1/patients/{patientID}/profile", h.getProfile)
	mux.HandleFunc("PUT /v1/patients/{patientID}/profile", h.putProfile)
	mux.HandleFunc("GET /v1/patients/{patientID}/care-team", h.listCareTeam)
	mux.HandleFunc("POST /v1/patients/{patientID}/sharing-grants", h.createGrant)
	mux.HandleFunc("DELETE /v1/patients/{patientID}/sharing-grants/{grantID}", h.revokeGrant)
	mux.HandleFunc("GET /v1/patients/{patientID}/history", h.listPatientHistory)
	mux.HandleFunc("POST /v1/patients/{patientID}/history", h.addPatientHistory)
	mux.HandleFunc("GET /v1/patients/{patientID}/family", h.listFamily)
	mux.HandleFunc("POST /v1/patients/{patientID}/family/invitations", h.inviteFamily)
	mux.HandleFunc("POST /v1/patients/{patientID}/family/invitations/{linkID}/response", h.respondFamily)
	mux.HandleFunc("GET /v1/doctor/patients", h.listDoctorPatients)
	mux.HandleFunc("GET /v1/doctor/patients/{patientID}/profile", h.getDoctorPatientProfile)
	mux.HandleFunc("GET /v1/doctor/patients/{patientID}/history", h.listDoctorHistory)
	mux.HandleFunc("POST /v1/doctor/patients/{patientID}/history", h.addDoctorHistory)
	mux.HandleFunc("GET /v1/doctor/dashboard", h.doctorDashboard)
	mux.HandleFunc("GET /v1/doctor/appointments", h.listAppointments)
	mux.HandleFunc("POST /v1/doctor/appointments", h.createAppointment)
	mux.HandleFunc("GET /v1/doctor/encounters", h.listEncounters)
	mux.HandleFunc("POST /v1/doctor/encounters", h.createEncounter)
	mux.HandleFunc("GET /v1/doctor/prescriptions", h.listPrescriptions)
	mux.HandleFunc("POST /v1/doctor/prescriptions", h.createPrescription)
	mux.HandleFunc("GET /v1/doctor/labs", h.listLabs)
	mux.HandleFunc("POST /v1/doctor/labs", h.createLab)
	return h.securityHeaders(h.requestLog(mux))
}

func (h *Handler) doctorDashboard(w http.ResponseWriter, r *http.Request) {
	actor, ok := h.authorizeRole(w, r, "doctor")
	if !ok {
		return
	}
	result, err := h.emr.Dashboard(r.Context(), actor.ID)
	if err != nil {
		h.internalError(w, "doctor dashboard", err)
		return
	}
	writeJSON(w, http.StatusOK, result)
}
func (h *Handler) listAppointments(w http.ResponseWriter, r *http.Request) {
	actor, ok := h.authorizeRole(w, r, "doctor")
	if !ok {
		return
	}
	items, err := h.emr.ListAppointments(r.Context(), actor.ID)
	if err != nil {
		h.internalError(w, "list appointments", err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"appointments": items})
}
func (h *Handler) createAppointment(w http.ResponseWriter, r *http.Request) {
	actor, ok := h.authorizeRole(w, r, "doctor")
	if !ok {
		return
	}
	var input emr.Appointment
	if !decodeJSON(w, r, &input) {
		return
	}
	item, err := h.emr.CreateAppointment(r.Context(), actor.ID, input)
	h.writeEMRCreate(w, item, err)
}
func (h *Handler) listEncounters(w http.ResponseWriter, r *http.Request) {
	actor, ok := h.authorizeRole(w, r, "doctor")
	if !ok {
		return
	}
	items, err := h.emr.ListEncounters(r.Context(), actor.ID)
	if err != nil {
		h.internalError(w, "list encounters", err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"encounters": items})
}
func (h *Handler) createEncounter(w http.ResponseWriter, r *http.Request) {
	actor, ok := h.authorizeRole(w, r, "doctor")
	if !ok {
		return
	}
	var input emr.Encounter
	if !decodeJSON(w, r, &input) {
		return
	}
	item, err := h.emr.CreateEncounter(r.Context(), actor.ID, input)
	h.writeEMRCreate(w, item, err)
}
func (h *Handler) listPrescriptions(w http.ResponseWriter, r *http.Request) {
	actor, ok := h.authorizeRole(w, r, "doctor")
	if !ok {
		return
	}
	items, err := h.emr.ListPrescriptions(r.Context(), actor.ID)
	if err != nil {
		h.internalError(w, "list prescriptions", err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"prescriptions": items})
}
func (h *Handler) createPrescription(w http.ResponseWriter, r *http.Request) {
	actor, ok := h.authorizeRole(w, r, "doctor")
	if !ok {
		return
	}
	var input emr.Prescription
	if !decodeJSON(w, r, &input) {
		return
	}
	item, err := h.emr.CreatePrescription(r.Context(), actor.ID, input)
	h.writeEMRCreate(w, item, err)
}
func (h *Handler) listLabs(w http.ResponseWriter, r *http.Request) {
	actor, ok := h.authorizeRole(w, r, "doctor")
	if !ok {
		return
	}
	items, err := h.emr.ListLabOrders(r.Context(), actor.ID)
	if err != nil {
		h.internalError(w, "list labs", err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"labs": items})
}
func (h *Handler) createLab(w http.ResponseWriter, r *http.Request) {
	actor, ok := h.authorizeRole(w, r, "doctor")
	if !ok {
		return
	}
	var input emr.LabOrder
	if !decodeJSON(w, r, &input) {
		return
	}
	item, err := h.emr.CreateLabOrder(r.Context(), actor.ID, input)
	h.writeEMRCreate(w, item, err)
}
func (h *Handler) writeEMRCreate(w http.ResponseWriter, item any, err error) {
	if errors.Is(err, emr.ErrForbidden) {
		writeError(w, http.StatusForbidden, "sharing_grant_required", "The patient must actively share with your clinic.")
		return
	}
	if errors.Is(err, emr.ErrInvalid) {
		writeError(w, http.StatusBadRequest, "invalid_clinical_record", "Complete all required clinical fields.")
		return
	}
	if err != nil {
		h.internalError(w, "create clinical record", err)
		return
	}
	writeJSON(w, http.StatusCreated, item)
}

func (h *Handler) listPatientHistory(w http.ResponseWriter, r *http.Request) {
	patientID := r.PathValue("patientID")
	if _, ok := h.authorizePatient(w, r, patientID); !ok {
		return
	}
	h.writeHistory(w, r, patientID)
}

func (h *Handler) addPatientHistory(w http.ResponseWriter, r *http.Request) {
	patientID := r.PathValue("patientID")
	actor, ok := h.authorizePatient(w, r, patientID)
	if !ok {
		return
	}
	h.createHistory(w, r, patientID, actor.ID, "patient")
}

func (h *Handler) listDoctorHistory(w http.ResponseWriter, r *http.Request) {
	actor, ok := h.authorizeRole(w, r, "doctor")
	if !ok {
		return
	}
	patientID := r.PathValue("patientID")
	if !h.authorizeDoctorPatient(w, r, actor.ID, patientID) {
		return
	}
	h.writeHistory(w, r, patientID)
}

func (h *Handler) addDoctorHistory(w http.ResponseWriter, r *http.Request) {
	actor, ok := h.authorizeRole(w, r, "doctor")
	if !ok {
		return
	}
	patientID := r.PathValue("patientID")
	if !h.authorizeDoctorPatient(w, r, actor.ID, patientID) {
		return
	}
	h.createHistory(w, r, patientID, actor.ID, "doctor")
}

func (h *Handler) writeHistory(w http.ResponseWriter, r *http.Request, patientID string) {
	items, err := h.clinical.ListHistory(r.Context(), patientID)
	if err != nil {
		h.internalError(w, "list history", err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"history": items})
}

func (h *Handler) createHistory(w http.ResponseWriter, r *http.Request, patientID, actorID, source string) {
	var input clinical.HistoryEntry
	if !decodeJSON(w, r, &input) {
		return
	}
	input.PatientID = patientID
	item, err := h.clinical.AddHistory(r.Context(), actorID, source, input)
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid_history", "Enter a title and valid history category.")
		return
	}
	writeJSON(w, http.StatusCreated, item)
}

func (h *Handler) authorizeDoctorPatient(w http.ResponseWriter, r *http.Request, doctorID, patientID string) bool {
	allowed, err := h.access.CanDoctorReadPatient(r.Context(), doctorID, patientID)
	if err != nil {
		h.internalError(w, "authorize patient", err)
		return false
	}
	if !allowed {
		writeError(w, http.StatusForbidden, "sharing_grant_required", "An active patient sharing grant is required.")
		return false
	}
	return true
}

func (h *Handler) listFamily(w http.ResponseWriter, r *http.Request) {
	patientID := r.PathValue("patientID")
	if _, ok := h.authorizePatient(w, r, patientID); !ok {
		return
	}
	items, err := h.family.List(r.Context(), patientID)
	if err != nil {
		h.internalError(w, "list family", err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"family": items})
}

func (h *Handler) inviteFamily(w http.ResponseWriter, r *http.Request) {
	patientID := r.PathValue("patientID")
	if _, ok := h.authorizePatient(w, r, patientID); !ok {
		return
	}
	var input struct {
		Email        string `json:"email"`
		Relationship string `json:"relationship"`
	}
	if !decodeJSON(w, r, &input) {
		return
	}
	item, err := h.family.Invite(r.Context(), patientID, input.Email, input.Relationship)
	if errors.Is(err, family.ErrNotFound) {
		writeError(w, http.StatusNotFound, "patient_not_found", "No patient account was found for that email.")
		return
	}
	if err != nil {
		h.internalError(w, "invite family", err)
		return
	}
	writeJSON(w, http.StatusCreated, item)
}

func (h *Handler) respondFamily(w http.ResponseWriter, r *http.Request) {
	patientID := r.PathValue("patientID")
	if _, ok := h.authorizePatient(w, r, patientID); !ok {
		return
	}
	var input struct {
		Accept             bool `json:"accept"`
		ShareFamilyHistory bool `json:"shareFamilyHistory"`
	}
	if !decodeJSON(w, r, &input) {
		return
	}
	item, err := h.family.Respond(r.Context(), patientID, r.PathValue("linkID"), input.Accept, input.ShareFamilyHistory)
	if errors.Is(err, family.ErrNotFound) {
		writeError(w, http.StatusNotFound, "invitation_not_found", "Pending invitation not found.")
		return
	}
	if err != nil {
		h.internalError(w, "respond family", err)
		return
	}
	writeJSON(w, http.StatusOK, item)
}

type credentialsInput struct {
	Email       string `json:"email"`
	Password    string `json:"password"`
	DisplayName string `json:"displayName"`
	Role        string `json:"role"`
}

func (h *Handler) signUp(w http.ResponseWriter, r *http.Request) {
	var input credentialsInput
	if !decodeJSON(w, r, &input) {
		return
	}
	result, err := h.auth.SignUp(r.Context(), input.Email, input.Password, input.DisplayName, input.Role)
	if errors.Is(err, auth.ErrEmailTaken) {
		writeError(w, http.StatusConflict, "email_taken", "An account already exists for this email address.")
		return
	}
	if errors.Is(err, auth.ErrInvalidCredentials) || errors.Is(err, auth.ErrInvalidRole) {
		writeError(w, http.StatusBadRequest, "invalid_signup", "Enter a valid name, email, role, and a password of at least 10 characters.")
		return
	}
	if err != nil {
		h.internalError(w, "sign up", err)
		return
	}
	writeJSON(w, http.StatusCreated, result)
}

func (h *Handler) signIn(w http.ResponseWriter, r *http.Request) {
	var input credentialsInput
	if !decodeJSON(w, r, &input) {
		return
	}
	result, err := h.auth.SignIn(r.Context(), input.Email, input.Password, input.Role)
	if errors.Is(err, auth.ErrInvalidCredentials) {
		writeError(w, http.StatusUnauthorized, "invalid_credentials", "Email or password is incorrect.")
		return
	}
	if err != nil {
		h.internalError(w, "sign in", err)
		return
	}
	writeJSON(w, http.StatusOK, result)
}

func (h *Handler) currentUser(w http.ResponseWriter, r *http.Request) {
	token := bearerToken(r)
	if token == "" {
		writeError(w, http.StatusUnauthorized, "unauthenticated", "A valid session is required.")
		return
	}
	user, err := h.auth.CurrentUser(r.Context(), token)
	if err != nil {
		writeError(w, http.StatusUnauthorized, "unauthenticated", "The session is invalid or expired.")
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"user": user})
}

func (h *Handler) signOut(w http.ResponseWriter, r *http.Request) {
	token := bearerToken(r)
	if token != "" {
		if err := h.auth.SignOut(r.Context(), token); err != nil {
			h.internalError(w, "sign out", err)
			return
		}
	}
	w.WriteHeader(http.StatusNoContent)
}

func decodeJSON(w http.ResponseWriter, r *http.Request, value any) bool {
	r.Body = http.MaxBytesReader(w, r.Body, 32<<10)
	defer r.Body.Close()
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(value); err != nil {
		writeError(w, http.StatusBadRequest, "invalid_request", "Use a valid request payload.")
		return false
	}
	return true
}

func bearerToken(r *http.Request) string {
	value := strings.TrimSpace(r.Header.Get("Authorization"))
	if !strings.HasPrefix(value, "Bearer ") {
		return ""
	}
	return strings.TrimSpace(strings.TrimPrefix(value, "Bearer "))
}

func validE164(value string) bool {
	value = strings.TrimSpace(value)
	if len(value) < 9 || len(value) > 16 || value[0] != '+' {
		return false
	}
	for _, character := range value[1:] {
		if character < '0' || character > '9' {
			return false
		}
	}
	return true
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
	if input.MobilePhone != "" && !validE164(input.MobilePhone) {
		writeError(w, http.StatusBadRequest, "invalid_mobile", "Use an E.164 mobile number including country code, for example +919876543210.")
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
