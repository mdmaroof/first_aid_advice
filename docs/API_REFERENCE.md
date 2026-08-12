# Curais API Reference

Machine-readable OpenAPI 3.1 documentation is in [`openapi.yaml`](./openapi.yaml). Credential handling is covered in [`SWAGGER_GUIDE.md`](./SWAGGER_GUIDE.md).

## Status and base URL

The implemented API is versioned under `/v1`. Local default:

```text
http://127.0.0.1:8080
```

All health-data responses use `Cache-Control: no-store` and JSON. Authenticated requests use the opaque session returned by sign-in:

```text
Authorization: Bearer <session-token>
```

Local development also accepts identity headers; non-local environments reject this adapter.

```text
X-Curais-Actor-ID: patient-local-1 | doctor-local-1
X-Curais-Actor-Role: patient | doctor
```

These headers are not authentication. The patient and doctor apps use bearer sessions through server-side HttpOnly cookies.

## Authentication

- `POST /v1/auth/signup`
- `POST /v1/auth/signin`
- `GET /v1/auth/me`
- `POST /v1/auth/signout`

Passwords require at least 10 characters and use salted PBKDF2-SHA256 hashes. Sessions expire after seven days, and only token hashes are stored.

## Error envelope

```json
{
  "error": {
    "code": "sharing_grant_required",
    "message": "An active patient sharing grant is required."
  }
}
```

Common status codes: `400` validation, `401` no identity, `403` wrong role/ownership or missing grant, `404` resource missing, `500` internal failure.

## Health

### `GET /healthz`

Returns `200` with `{"status":"ok"}`. No identity required.

## Patient profile

### `GET /v1/patients/{patientID}/profile`

Patient identity must exactly match `{patientID}`.

### `PUT /v1/patients/{patientID}/profile`

Replaces the patient's core profile, allergy list, and medication list atomically. Creates an audit event and increments `version` on updates.

```json
{
  "displayName": "Aisha Khan",
  "dateOfBirth": "1990-03-12",
  "bloodGroup": "O+",
  "mobilePhone": "+919000000000",
  "emergencyContact": { "name": "Imran", "phone": "+919000000000" },
  "allergies": [{ "name": "Peanuts", "severity": "high" }],
  "medications": [{ "name": "Metformin", "details": "500 mg" }]
}
```

## Clinic directory and Care Team

### `GET /v1/directory/clinics`

Returns active clinics to an authenticated actor.

### `GET /v1/patients/{patientID}/care-team`

Patient-owned endpoint returning `{clinics, grants}` including revoked grant history.

### `POST /v1/patients/{patientID}/sharing-grants`

Patient-owned endpoint. Currently accepts one bounded scope:

```json
{ "clinicId": "clinic-local-1", "scope": "profile.read" }
```

Returns `201`. Re-granting the same clinic/scope reactivates the existing grant and updates its timestamp.

### `DELETE /v1/patients/{patientID}/sharing-grants/{grantID}`

Patient-owned endpoint. Revokes only an active grant belonging to that patient. Returns `204`.

## Doctor access

### `GET /v1/doctor/patients?query={text}`

Doctor identity required. Returns only patients with an active `profile.read` grant to a clinic where the doctor has an active membership. Search matches patient name/ID or an exact E.164 mobile number and is limited to 50 results. It is never a global mobile directory.

### `GET /v1/doctor/patients/{patientID}/profile`

Doctor identity required. The API checks membership plus active consent on every request. Returns `403 sharing_grant_required` immediately after revocation.

## Longitudinal history

- `GET|POST /v1/patients/{patientID}/history`
- `GET|POST /v1/doctor/patients/{patientID}/history`

Patient writes are marked `source=patient`; clinician writes are marked `source=doctor` and attributable to the doctor session. Doctor reads and writes require active clinic membership and patient consent.

## Family connections

- `GET /v1/patients/{patientID}/family`
- `POST /v1/patients/{patientID}/family/invitations`
- `POST /v1/patients/{patientID}/family/invitations/{linkID}/response`

Each person keeps separate credentials. The invited patient must accept, and family-history permission is recorded separately. This does not expose a relative's complete medical record.

## Local examples

```bash
curl http://127.0.0.1:8080/v1/patients/patient-local-1/care-team \
  -H 'X-Curais-Actor-ID: patient-local-1' \
  -H 'X-Curais-Actor-Role: patient'

curl -X POST http://127.0.0.1:8080/v1/patients/patient-local-1/sharing-grants \
  -H 'Content-Type: application/json' \
  -H 'X-Curais-Actor-ID: patient-local-1' \
  -H 'X-Curais-Actor-Role: patient' \
  --data '{"clinicId":"clinic-local-1","scope":"profile.read"}'

curl http://127.0.0.1:8080/v1/doctor/patients \
  -H 'X-Curais-Actor-ID: doctor-local-1' \
  -H 'X-Curais-Actor-Role: doctor'
```

## Planned API concerns

- Verified OAuth/OIDC or managed-identity adapter and clinician MFA.
- Pagination cursors, conditional updates, idempotency keys, and formal request IDs.
- Consent purpose/version/expiry and emergency break-glass workflow.
- OpenAPI 3.1 generation after the identity and versioning contract stabilizes.
