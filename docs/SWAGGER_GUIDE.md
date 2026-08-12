# Curais Swagger and API Authentication Guide

Start the Go API with `npm run api:dev`, then open [http://localhost:8080/swagger](http://localhost:8080/swagger). The embedded contract is served at `http://localhost:8080/swagger/openapi.yaml`.

The machine-readable OpenAPI 3.1 contract is [`openapi.yaml`](./openapi.yaml). Import it into Swagger UI, Swagger Editor, Postman, Insomnia, Bruno, or an SDK generator.

## Local Swagger UI

Run a Swagger UI container and mount the contract, or paste `openapi.yaml` into [Swagger Editor](https://editor.swagger.io/). The local server URL is `http://127.0.0.1:8080`.

## Authentication

Curais does not use permanent API keys for patient-facing or clinician-facing PHI access. Sign-in returns an opaque, expiring bearer session:

```http
Authorization: Bearer <opaque-session-token>
```

The Next.js apps place this value in a `HttpOnly`, `SameSite=Lax` cookie. JavaScript cannot read that cookie. The server-side proxy converts it back to an Authorization header when calling the Go API.

Local development still supports `X-Curais-Actor-ID` and `X-Curais-Actor-Role` when `CURAIS_ENV=local`. These headers are disabled outside local mode and must never be treated as production credentials.

## Service keys

Machine-to-machine service credentials are intentionally not implemented yet. Production service keys should be short-lived OAuth 2.0 client-credential tokens with narrowly scoped audiences, rotation, rate limits, and vault-managed secrets. Do not reuse patient sessions as service keys and do not put any credential in URLs, mobile apps, Git, or Swagger examples.

## Consent boundaries

- A patient can access only the patient ID attached to their session.
- A doctor can search or open only patients with an active sharing grant to one of the doctor’s active clinic memberships.
- Exact mobile-number lookup operates only inside that consented set.
- Family accounts remain separate. A link requires an invitation and acceptance; family-history sharing is a separate choice.
- History entries identify whether the patient or a doctor recorded them and create an audit event.
