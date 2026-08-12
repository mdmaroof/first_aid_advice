package clinical

import "context"

type HistoryEntry struct {
	ID         string `json:"id"`
	PatientID  string `json:"patientId"`
	Category   string `json:"category"`
	Title      string `json:"title"`
	Details    string `json:"details,omitempty"`
	OccurredAt string `json:"occurredAt,omitempty"`
	Source     string `json:"source"`
	RecordedBy string `json:"recordedBy"`
	CreatedAt  string `json:"createdAt"`
}

type Repository interface {
	ListHistory(context.Context, string) ([]HistoryEntry, error)
	AddHistory(context.Context, string, string, HistoryEntry) (HistoryEntry, error)
}
