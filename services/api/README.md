# Curais Go API

The API uses Go's standard HTTP stack and SQLite for local development. Repository interfaces keep domain code independent from the database adapter.

```bash
go mod download
go run ./cmd/api
```

Local profile requests must include matching development identity headers:

```text
X-Curais-Actor-ID: patient-1
X-Curais-Actor-Role: patient
```

These headers are deliberately disabled outside `CURAIS_ENV=local`; production must use verified identity tokens and server-derived claims.
