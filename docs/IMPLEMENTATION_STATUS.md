# Curais Implementation Status

## Foundation complete

- npm-workspaces monorepo with separately runnable Patient and Doctor apps.
- Shared Curais UI package for brand, shell, and feature-card primitives.
- Existing SnapAid AI/curated first-aid behavior preserved as public Curais Immediate Care.
- Patient home and local My Health profile flow.
- Patient Care Team screen for granting and revoking clinic access.
- Doctor shared-patient directory and profile view, restricted by active consent.
- Go HTTP API with SQLite migrations, repository boundaries, identity abstraction, clinic memberships, sharing grants, profile save/read, and audit events.
- PostgreSQL-first production database recommendation and MongoDB split-store option documented.
- Patient and doctor sign-up/sign-in/sign-out with role-isolated, expiring sessions.
- Public `/immediate-care` route with no authentication gate; legacy SnapAid routes redirect to it.
- Optional signed-in health-context review and explicit care-moment save after guidance; no automatic profile access or persistence.
- Patient and clinician-authored longitudinal health history.
- Individual family accounts with invitations, acceptance, and separate history-sharing permission.
- Consent-limited doctor search by name or exact mobile number.
- OpenAPI 3.1 Swagger contract and credential guide.
- Doctor EMR dashboard, appointments, encounters/vitals, prescriptions, and lab orders.
- Standard error envelopes, request-ID correlation, panic recovery, structured failure logs, shared UI parsing, and an operational error catalog.
- Public landing website on port 4000 with responsive glass UI, scroll motion, product entry modals, modern navigation/footer, privacy policy and terms.

## Ticket mapping

| Ticket | Status | Notes |
| --- | --- | --- |
| CUR-001 | Local vertical slice | SnapAid is available as public Curais Immediate Care while retaining its existing guidance behavior. |
| CUR-101 | Local vertical slice | Local password sessions work; production identity provider, phone verification, recovery, and clinician MFA remain required. |
| CUR-102 | Local vertical slice | Profile, allergies, medications, blood group, and emergency contact save through Go/SQLite. |
| CUR-105 | Local vertical slice | Grant and revoke lifecycle is persisted and audited; purpose/version/expiry comes next. |
| CUR-201 | Local vertical slice | Doctor authentication and EMR history work; production clinician verification and organization role administration come next. |
| CUR-202 | Local vertical slice | Doctor list/profile APIs require active membership plus patient `profile.read` grant. |

## Next delivery slice

1. Integrate a production identity provider with verified phone flow and clinician MFA.
2. Add consent purpose, policy version, expiry, and explicit renewal.
3. Add clinic onboarding and role administration.
4. Add encounter editing/versioning, lab result entry, appointment status transitions, billing, and patient-visible audit history.
5. Implement PostgreSQL adapter and migrations before production health-data persistence.
