package access

import (
	"context"
	"errors"
)

var (
	ErrNotFound  = errors.New("access record not found")
	ErrForbidden = errors.New("access is forbidden")
)

type Clinic struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type Grant struct {
	ID         string `json:"id"`
	PatientID  string `json:"patientId"`
	ClinicID   string `json:"clinicId"`
	ClinicName string `json:"clinicName"`
	Scope      string `json:"scope"`
	Status     string `json:"status"`
	GrantedAt  string `json:"grantedAt"`
	RevokedAt  string `json:"revokedAt,omitempty"`
}

type SharedPatient struct {
	PatientID   string `json:"patientId"`
	DisplayName string `json:"displayName"`
	BloodGroup  string `json:"bloodGroup,omitempty"`
	Scope       string `json:"scope"`
	GrantedAt   string `json:"grantedAt"`
	MobilePhone string `json:"mobilePhone,omitempty"`
}

type Repository interface {
	ListClinics(context.Context) ([]Clinic, error)
	ListPatientGrants(context.Context, string) ([]Grant, error)
	GrantClinic(context.Context, string, string, string) (Grant, error)
	RevokeGrant(context.Context, string, string) error
	ListDoctorPatients(context.Context, string, string) ([]SharedPatient, error)
	CanDoctorReadPatient(context.Context, string, string) (bool, error)
}
