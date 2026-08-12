package family

import (
	"context"
	"errors"
)

var ErrNotFound = errors.New("family record not found")

type Link struct {
	ID                 string `json:"id"`
	OtherPatientID     string `json:"otherPatientId"`
	OtherDisplayName   string `json:"otherDisplayName"`
	Relationship       string `json:"relationship"`
	Status             string `json:"status"`
	Direction          string `json:"direction"`
	ShareFamilyHistory bool   `json:"shareFamilyHistory"`
	CreatedAt          string `json:"createdAt"`
}

type Repository interface {
	List(context.Context, string) ([]Link, error)
	Invite(context.Context, string, string, string) (Link, error)
	Respond(context.Context, string, string, bool, bool) (Link, error)
}
