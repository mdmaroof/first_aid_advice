package main

import (
	"context"
	"errors"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/curais/curais/services/api/internal/config"
	"github.com/curais/curais/services/api/internal/httpapi"
	"github.com/curais/curais/services/api/internal/platform/database"
	"github.com/curais/curais/services/api/internal/profile"
)

func main() {
	cfg := config.Load()
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))

	db, err := database.OpenSQLite(cfg.DatabasePath)
	if err != nil {
		logger.Error("open database", "error", err)
		os.Exit(1)
	}
	defer db.Close()

	if err := database.Migrate(context.Background(), db); err != nil {
		logger.Error("migrate database", "error", err)
		os.Exit(1)
	}

	profileRepository := profile.NewSQLiteRepository(db)
	handler := httpapi.NewHandler(logger, profileRepository, cfg.Environment)
	server := &http.Server{
		Addr:              cfg.Address,
		Handler:           handler.Routes(),
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       10 * time.Second,
		WriteTimeout:      15 * time.Second,
		IdleTimeout:       60 * time.Second,
	}

	go func() {
		logger.Info("curais api listening", "address", cfg.Address, "environment", cfg.Environment)
		if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			logger.Error("serve api", "error", err)
			os.Exit(1)
		}
	}()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)
	<-stop

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := server.Shutdown(ctx); err != nil {
		logger.Error("shutdown api", "error", err)
	}
}
