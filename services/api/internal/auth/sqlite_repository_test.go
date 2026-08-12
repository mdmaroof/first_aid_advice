package auth

import (
	"context"
	"path/filepath"
	"testing"

	"github.com/mdmaroof/first_aid_advice/services/api/internal/platform/database"
)

func TestSignupSigninAndRoleIsolation(t *testing.T) {
	ctx := context.Background()
	db, err := database.OpenSQLite(filepath.Join(t.TempDir(), "auth.db"))
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()
	if err := database.Migrate(ctx, db); err != nil {
		t.Fatal(err)
	}
	repo := NewSQLiteRepository(db)
	session, err := repo.SignUp(ctx, "patient@example.com", "long-password-123", "Test Patient", "patient")
	if err != nil {
		t.Fatal(err)
	}
	if session.User.Role != "patient" || session.Token == "" {
		t.Fatalf("unexpected session: %#v", session)
	}
	if _, err := repo.SignIn(ctx, "patient@example.com", "long-password-123", "doctor"); err != ErrInvalidCredentials {
		t.Fatalf("expected role isolation, got %v", err)
	}
	actor, err := repo.ResolveSession(ctx, session.Token)
	if err != nil || actor.ID != session.User.ID {
		t.Fatalf("resolve session: %#v, %v", actor, err)
	}
	if err := repo.SignOut(ctx, session.Token); err != nil {
		t.Fatal(err)
	}
	if _, err := repo.ResolveSession(ctx, session.Token); err == nil {
		t.Fatal("expected revoked session to fail")
	}
}
