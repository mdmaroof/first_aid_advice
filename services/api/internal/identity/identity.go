package identity

import (
	"errors"
	"net/http"
	"strings"
)

var ErrUnauthenticated = errors.New("actor is not authenticated")

type Actor struct {
	ID   string
	Role string
}

type Resolver interface {
	Resolve(*http.Request) (Actor, error)
}

type LocalHeaderResolver struct{ environment string }

func NewLocalHeaderResolver(environment string) *LocalHeaderResolver {
	return &LocalHeaderResolver{environment: environment}
}

func (r *LocalHeaderResolver) Resolve(request *http.Request) (Actor, error) {
	if r.environment != "local" {
		return Actor{}, ErrUnauthenticated
	}
	actor := Actor{
		ID:   strings.TrimSpace(request.Header.Get("X-Curais-Actor-ID")),
		Role: strings.TrimSpace(request.Header.Get("X-Curais-Actor-Role")),
	}
	if actor.ID == "" || actor.Role == "" {
		return Actor{}, ErrUnauthenticated
	}
	return actor, nil
}
