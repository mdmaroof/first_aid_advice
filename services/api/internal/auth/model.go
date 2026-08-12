package auth

import (
	"context"
	"errors"
)

var (
	ErrEmailTaken         = errors.New("email is already registered")
	ErrInvalidCredentials = errors.New("invalid credentials")
	ErrInvalidRole        = errors.New("invalid role")
)

type User struct {
	ID          string `json:"id"`
	Email       string `json:"email"`
	DisplayName string `json:"displayName"`
	Role        string `json:"role"`
}

type Session struct {
	Token     string `json:"token"`
	ExpiresAt string `json:"expiresAt"`
	User      User   `json:"user"`
}

type Repository interface {
	SignUp(context.Context, string, string, string, string) (Session, error)
	SignIn(context.Context, string, string, string) (Session, error)
	CurrentUser(context.Context, string) (User, error)
	SignOut(context.Context, string) error
}
