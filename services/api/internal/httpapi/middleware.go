package httpapi

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"net/http"
	"runtime/debug"
	"time"
)

type responseRecorder struct {
	http.ResponseWriter
	status int
}

func (r *responseRecorder) WriteHeader(status int) {
	if r.status != 0 {
		return
	}
	r.status = status
	r.ResponseWriter.WriteHeader(status)
}

func (r *responseRecorder) Write(body []byte) (int, error) {
	if r.status == 0 {
		r.WriteHeader(http.StatusOK)
	}
	return r.ResponseWriter.Write(body)
}

func (h *Handler) middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		started := time.Now()
		requestID := newRequestID()
		r = r.WithContext(context.WithValue(r.Context(), requestIDContextKey{}, requestID))
		w.Header().Set("X-Request-ID", requestID)
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("Cache-Control", "no-store")
		recorder := &responseRecorder{ResponseWriter: w}

		defer func() {
			if recovered := recover(); recovered != nil {
				h.logger.Error("panic recovered", "request_id", requestID, "method", r.Method, "path", r.URL.Path, "panic_type", fmt.Sprintf("%T", recovered), "stack", string(debug.Stack()))
				if recorder.status == 0 {
					writeError(recorder, http.StatusInternalServerError, "internal_error", "An unexpected error occurred. Reference: "+requestID)
				}
			}
			status := recorder.status
			if status == 0 {
				status = http.StatusOK
			}
			h.logger.Info("request completed", "request_id", requestID, "method", r.Method, "path", r.URL.Path, "status", status, "duration_ms", time.Since(started).Milliseconds())
		}()

		next.ServeHTTP(recorder, r)
	})
}

func newRequestID() string {
	value := make([]byte, 12)
	if _, err := rand.Read(value); err != nil {
		return "req-unavailable"
	}
	return "req-" + hex.EncodeToString(value)
}
