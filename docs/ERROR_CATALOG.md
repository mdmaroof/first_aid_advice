# Curais Error Catalog and Troubleshooting Guide

This is the operational reference for errors returned by the Curais API, the Patient app, the Doctor EMR, and SnapAid.

## Standard error response

Every Go API error uses this shape:

```json
{
  "error": {
    "code": "invalid_mobile",
    "message": "Use an E.164 mobile number including country code, for example +919876543210.",
    "requestId": "req-184a44e235632291397d2a3c",
    "details": [
      { "field": "mobilePhone", "message": "Use E.164 format." }
    ]
  }
}
```

The same request ID is returned in the `X-Request-ID` response header and written to structured API logs. `details` is optional and is intended for field-level validation.

When reporting a problem, record:

1. The `error.code`.
2. The `error.requestId` or `X-Request-ID` header.
3. The time, app, route, and action attempted.
4. Whether the issue is reproducible.

Never send passwords, bearer tokens, full medical records, or database files in an issue report.

## HTTP status guide

| Status | Meaning | First action |
| --- | --- | --- |
| `400` | Invalid input | Correct the fields using the message/details. |
| `401` | No valid session | Sign in again; check cookie/proxy configuration. |
| `403` | Authenticated but not allowed | Check role, ownership, clinic membership, and consent. |
| `404` | Route or record not found | Confirm IDs, route, and record state. |
| `409` | Uniqueness/state conflict | Use a different value or inspect the existing record. |
| `413` | Body too large | Reduce the request below 64 KB; use attachment storage for files. |
| `500` | Unexpected internal failure | Search logs using the request ID. |
| `502` | Upstream returned invalid content | Retry and inspect the upstream provider. |
| `503` | API/upstream unavailable | Check process health, URL, network, and credentials. |

## Request and validation errors

| Code | Status | What went wrong | Resolution |
| --- | ---: | --- | --- |
| `empty_request_body` | 400 | A JSON body was required but empty. | Send one JSON object with `Content-Type: application/json`. |
| `malformed_json` | 400 | JSON syntax is invalid. | Validate commas, quotes, braces, and escaping. |
| `multiple_json_values` | 400 | More than one JSON value was sent. | Send exactly one object. |
| `unknown_field` | 400 | Payload contains an unsupported property. | Remove the field shown in `details`. |
| `invalid_field_type` | 400 | A property has the wrong JSON type. | Use the field type shown in Swagger. |
| `invalid_request` | 400 | Request could not be interpreted. | Compare the request with `/swagger`. |
| `request_too_large` | 413 | JSON body exceeds 64 KB. | Reduce it; never embed files as JSON/base64. |
| `display_name_required` | 400 | Patient display name is blank. | Provide a non-empty name. |
| `invalid_mobile` | 400 | Mobile is not in E.164 format. | Use `+` plus country code and digits only. |
| `invalid_scope` | 400 | Unsupported consent scope requested. | Currently use `profile.read`. |
| `invalid_history` | 400 | History title/category is invalid. | Use a supported category and non-empty title. |
| `invalid_clinical_record` | 400 | Required appointment/encounter/prescription/lab fields are missing or invalid. | Review the resource schema in Swagger. |

## Authentication and account errors

| Code | Status | What went wrong | Resolution |
| --- | ---: | --- | --- |
| `invalid_signup` | 400 | Name, email, role, or password failed validation. | Use a valid email and password of at least 10 characters. |
| `email_taken` | 409 | Email already has an account. | Sign in or use account recovery when implemented. |
| `invalid_credentials` | 401 | Email/password is wrong or account role does not match the app. | Verify credentials and use the correct Patient/Doctor app. |
| `unauthenticated` | 401 | Session is missing, invalid, or expired. | Sign in again; verify the HttpOnly cookie and API URL. |
| `forbidden` | 403 | Identity has the wrong role or patient ownership. | Do not change IDs manually; use the correct account. |

## Consent, family, and record errors

| Code | Status | What went wrong | Resolution |
| --- | ---: | --- | --- |
| `sharing_grant_required` | 403 | Doctor clinic lacks active patient consent. | Patient grants access in Care Team; confirm doctor membership is active. |
| `clinic_not_found` | 404 | Clinic/hospital is missing or disabled. | Select an active organization from the directory. |
| `grant_not_found` | 404 | Active grant is missing, revoked, or belongs to another patient. | Refresh Care Team and use the current grant. |
| `profile_not_found` | 404 | Patient profile does not exist. | Patient completes profile setup. |
| `patient_not_found` | 404 | Family invitation email is not a Patient account. | Ask the relative to create a Patient account or verify the email. |
| `invitation_not_found` | 404 | Invitation is missing, already answered, or belongs to another patient. | Refresh the family list and use a pending incoming invitation. |
| `route_not_found` | 404 | API path does not exist. | Check Swagger and the `/v1` prefix. |

## Infrastructure and unexpected errors

| Code | Status | What went wrong | Resolution |
| --- | ---: | --- | --- |
| `api_unavailable` | 503 | Next.js proxy cannot reach the Go API. | Start `npm run api:dev`; verify `CURAIS_API_URL`, port, DNS, and firewall. |
| `invalid_api_response` | 502/varies | Proxy/UI could not parse the API response. | Check API process/version and proxy logs. |
| `internal_error` | 500 | Unexpected server/repository failure or recovered panic. | Search API logs for `request_id=<error.requestId>`. Do not expose raw database errors to users. |

## SnapAid guidance errors

| Code | Status | Meaning | Resolution |
| --- | ---: | --- | --- |
| `guidance_provider_empty_response` | 502 | AI provider returned no content. | Retry; verify provider health and configuration. |
| `guidance_provider_invalid_response` | 502 | AI content was not valid JSON. | Retry; inspect provider/model compatibility. |
| `guidance_provider_incomplete_response` | 502 | AI response failed the safety/result schema. | Retry; review prompt/schema/provider behavior. |
| `guidance_provider_unavailable` | 503 | AI request failed. | Use curated emergency controls, check provider credentials/network, then retry. |

## Log diagnosis

The Go API writes one completion record for every request:

```text
request completed request_id=req-... method=POST path=/v1/doctor/encounters status=400 duration_ms=2
```

Unexpected failures add an error record with the same request ID and an internal operation name. Recovered panics include a stack trace only in server logs—not in the response.

Suggested incident workflow:

1. Reproduce once and copy the request ID.
2. Find that ID in API logs.
3. Identify the operation and underlying repository/upstream error.
4. Check API health at `/healthz` and contract at `/swagger`.
5. Confirm database migration state and environment variables.
6. Fix the cause; do not replace safe public messages with raw internal errors.

## Startup failures

Startup errors occur before an HTTP request exists, so they have no request ID.

| Log operation | Likely cause | Check |
| --- | --- | --- |
| `open database` | Invalid path/permissions or SQLite failure | `CURAIS_DATABASE_PATH`, directory permissions, disk space. |
| `migrate database` | Schema conflict/corruption | Migration SQL, SQLite integrity, backup. |
| `seed local database` | Local seed constraint failure | Existing local rows/schema version. |
| `serve api` | Port already used or binding denied | `CURAIS_API_ADDRESS`, running processes, sandbox/firewall. |
| `shutdown api` | Requests did not finish before timeout | Slow queries, locked DB, stalled upstreams. |
