package emr

import (
	"context"
	"errors"
)

var (
	ErrForbidden = errors.New("patient access is not granted")
	ErrInvalid   = errors.New("invalid clinical record")
)

type Appointment struct {
	ID              string `json:"id"`
	PatientID       string `json:"patientId"`
	PatientName     string `json:"patientName"`
	ScheduledAt     string `json:"scheduledAt"`
	DurationMinutes int    `json:"durationMinutes"`
	Reason          string `json:"reason"`
	Status          string `json:"status"`
}

type Encounter struct {
	ID             string  `json:"id"`
	PatientID      string  `json:"patientId"`
	PatientName    string  `json:"patientName"`
	AppointmentID  string  `json:"appointmentId,omitempty"`
	ChiefComplaint string  `json:"chiefComplaint"`
	Subjective     string  `json:"subjective,omitempty"`
	Objective      string  `json:"objective,omitempty"`
	Assessment     string  `json:"assessment,omitempty"`
	Plan           string  `json:"plan,omitempty"`
	BloodPressure  string  `json:"bloodPressure,omitempty"`
	PulseBPM       int     `json:"pulseBpm,omitempty"`
	TemperatureC   float64 `json:"temperatureC,omitempty"`
	SpO2Percent    int     `json:"spo2Percent,omitempty"`
	Status         string  `json:"status"`
	CreatedAt      string  `json:"createdAt"`
}

type Prescription struct {
	ID           string `json:"id"`
	PatientID    string `json:"patientId"`
	PatientName  string `json:"patientName"`
	EncounterID  string `json:"encounterId,omitempty"`
	Medication   string `json:"medication"`
	Dosage       string `json:"dosage"`
	Frequency    string `json:"frequency"`
	Duration     string `json:"duration,omitempty"`
	Instructions string `json:"instructions,omitempty"`
	Status       string `json:"status"`
	CreatedAt    string `json:"createdAt"`
}

type LabOrder struct {
	ID          string `json:"id"`
	PatientID   string `json:"patientId"`
	PatientName string `json:"patientName"`
	EncounterID string `json:"encounterId,omitempty"`
	TestName    string `json:"testName"`
	Priority    string `json:"priority"`
	Status      string `json:"status"`
	Result      string `json:"result,omitempty"`
	OrderedAt   string `json:"orderedAt"`
}

type Dashboard struct {
	SharedPatients       int `json:"sharedPatients"`
	TodayAppointments    int `json:"todayAppointments"`
	DraftEncounters      int `json:"draftEncounters"`
	OutstandingLabOrders int `json:"outstandingLabOrders"`
}

type Repository interface {
	Dashboard(context.Context, string) (Dashboard, error)
	ListAppointments(context.Context, string) ([]Appointment, error)
	CreateAppointment(context.Context, string, Appointment) (Appointment, error)
	ListEncounters(context.Context, string) ([]Encounter, error)
	CreateEncounter(context.Context, string, Encounter) (Encounter, error)
	ListPrescriptions(context.Context, string) ([]Prescription, error)
	CreatePrescription(context.Context, string, Prescription) (Prescription, error)
	ListLabOrders(context.Context, string) ([]LabOrder, error)
	CreateLabOrder(context.Context, string, LabOrder) (LabOrder, error)
}
