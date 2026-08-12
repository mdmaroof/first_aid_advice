package httpapi

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strings"
)

type requestIDContextKey struct{}

type APIError struct {
	Code      string       `json:"code"`
	Message   string       `json:"message"`
	RequestID string       `json:"requestId"`
	Details   []FieldError `json:"details,omitempty"`
}

type FieldError struct {
	Field   string `json:"field"`
	Message string `json:"message"`
}

type errorEnvelope struct {
	Error APIError `json:"error"`
}

func writeError(w http.ResponseWriter, status int, code, message string) {
	writeDetailedError(w, status, code, message)
}

func writeDetailedError(w http.ResponseWriter, status int, code, message string, details ...FieldError) {
	writeJSONStatus(w, status, errorEnvelope{Error: APIError{
		Code: code, Message: message, RequestID: w.Header().Get("X-Request-ID"), Details: details,
	}})
}

func decodeJSON(w http.ResponseWriter, r *http.Request, value any) bool {
	r.Body = http.MaxBytesReader(w, r.Body, 64<<10)
	defer r.Body.Close()
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()

	if err := decoder.Decode(value); err != nil {
		var maxBytesError *http.MaxBytesError
		var syntaxError *json.SyntaxError
		var typeError *json.UnmarshalTypeError
		switch {
		case errors.As(err, &maxBytesError):
			writeError(w, http.StatusRequestEntityTooLarge, "request_too_large", "The request body exceeds the 64 KB limit.")
		case errors.As(err, &syntaxError), errors.Is(err, io.ErrUnexpectedEOF):
			writeError(w, http.StatusBadRequest, "malformed_json", "The request contains malformed JSON.")
		case errors.As(err, &typeError):
			writeDetailedError(w, http.StatusBadRequest, "invalid_field_type", "A request field has the wrong data type.", FieldError{Field: typeError.Field, Message: typeError.Error()})
		case errors.Is(err, io.EOF):
			writeError(w, http.StatusBadRequest, "empty_request_body", "A JSON request body is required.")
		case strings.HasPrefix(err.Error(), "json: unknown field "):
			field := strings.Trim(err.Error()[len("json: unknown field "):], `"`)
			writeDetailedError(w, http.StatusBadRequest, "unknown_field", "The request contains an unsupported field.", FieldError{Field: field, Message: "Remove this field and try again."})
		default:
			writeError(w, http.StatusBadRequest, "invalid_request", "The request body could not be read.")
		}
		return false
	}

	if err := decoder.Decode(&struct{}{}); !errors.Is(err, io.EOF) {
		writeError(w, http.StatusBadRequest, "multiple_json_values", "Send exactly one JSON object in the request body.")
		return false
	}
	return true
}

func (h *Handler) internalError(w http.ResponseWriter, operation string, err error) {
	requestID := w.Header().Get("X-Request-ID")
	h.logger.Error("request failed", "operation", operation, "request_id", requestID, "error", err)
	writeError(w, http.StatusInternalServerError, "internal_error", fmt.Sprintf("The request could not be completed. Reference: %s", requestID))
}
