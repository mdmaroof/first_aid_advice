package profile

import (
	"context"
	"errors"
)

var ErrNotFound = errors.New("profile not found")

type Allergy struct {
	Name     string `json:"name"`
	Severity string `json:"severity,omitempty"`
}

type Medication struct {
	Name    string `json:"name"`
	Details string `json:"details,omitempty"`
}

type EmergencyContact struct {
	Name  string `json:"name,omitempty"`
	Phone string `json:"phone,omitempty"`
}

type Profile struct {
	PatientID       string           `json:"patientId"`
	DisplayName     string           `json:"displayName"`
	DateOfBirth     string           `json:"dateOfBirth,omitempty"`
	BloodGroup      string           `json:"bloodGroup,omitempty"`
	EmergencyContact EmergencyContact `json:"emergencyContact"`
	Allergies       []Allergy        `json:"allergies"`
	Medications     []Medication     `json:"medications"`
	Version         int              `json:"version"`
	UpdatedAt       string           `json:"updatedAt"`
}

type Repository interface {
	Get(context.Context, string) (Profile, error)
	Upsert(context.Context, string, Profile) (Profile, error)
}
