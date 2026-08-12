# Curais Implementation Status

## Foundation complete

- npm-workspaces monorepo with separately runnable Patient and Doctor apps.
- Shared Curais UI package for brand, shell, and feature-card primitives.
- Existing SnapAid routes and AI/curated first-aid behavior preserved in Patient.
- Patient home and local My Health profile flow.
- Doctor workspace shell with patient access intentionally disabled pending consent.
- Go HTTP API with SQLite migrations, repository boundary, security headers, local-only identity guard, profile save/read, and audit events.
- PostgreSQL-first production database recommendation and MongoDB split-store option documented.

## Ticket mapping

| Ticket | Status | Notes |
| --- | --- | --- |
| CUR-001 | Started | Curais shells exist; SnapAid public rebrand is intentionally not applied yet. |
| CUR-101 | Not started | Production identity provider and verified phone flow required. |
| CUR-102 | Local vertical slice | Profile, allergies, medications, blood group, and emergency contact save through Go/SQLite. |
| CUR-105 | Schema foundation | Audit event exists; versioned consent ledger comes next. |
| CUR-201 | UI foundation | Doctor workspace exists; sign-in and clinic roles come next. |
| CUR-202 | Blocked by design | No doctor patient access until sharing grants are implemented. |

## Next delivery slice

1. Production-grade identity abstraction with local development adapter.
2. Clinic, membership, and patient sharing-grant migrations.
3. Consent grant/revoke API plus immutable audit coverage.
4. Doctor patient search constrained to active grants.
5. Patient Care Team screen showing and revoking access.
