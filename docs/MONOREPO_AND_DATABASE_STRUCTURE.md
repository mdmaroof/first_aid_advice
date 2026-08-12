# Curais Monorepo and Database Structure

## Repository

```text
apps/
  patient/      Next.js patient application; SnapAid is Immediate Care
  doctor/       Next.js consent-led clinical workspace
packages/
  ui/           shared Curais brand, shell, and presentation primitives
services/
  api/          Go HTTP API and local SQLite adapter
docs/           product, architecture, security, and delivery contracts
```

Patient and Doctor remain independently deployable. They share design primitives, not authentication state, route trees, or audience-specific business logic.

## Local database

SQLite is used only for development and automated tests. It uses foreign keys, WAL mode, a busy timeout, and one application connection to keep behavior predictable.

Initial relational ownership:

- `users`: identity subject and coarse role.
- `patient_profiles`: patient-owned demographic and emergency context.
- `patient_allergies` and `patient_medications`: profile-owned structured health items.
- `audit_events`: append-only access/change facts.
- Later migrations add clinics, memberships, consent grants, visits, vitals, and attachments.

## Production recommendation

Use PostgreSQL as the default production database. Curais has transactional consent, role membership, record-version, visit, and audit relationships; PostgreSQL provides stronger constraints and safer multi-row transactions for these requirements.

MongoDB remains viable for document-shaped clinical payloads, but should not become the system of record for identity, consent, permissions, or audit history. If selected, use a split model:

- PostgreSQL: identity, clinics, memberships, sharing grants, consent, audit, record indexes.
- MongoDB: versioned clinical documents only, referenced by immutable IDs.

## Portability contract

- Domain packages depend on repository interfaces, never a database driver.
- SQLite and PostgreSQL get separate repository adapters and migrations.
- APIs expose domain JSON, not database rows or Mongo documents.
- IDs are application-generated opaque strings/UUIDs.
- Dates are RFC 3339 at API boundaries and native date/timestamp types in production.
- Every sensitive read/write/export creates an append-only audit event.
- Attachments use encrypted object storage; databases store metadata and integrity hashes only.

## Migration path

1. Develop against SQLite and run contract tests against repository behavior.
2. Add PostgreSQL migrations and a PostgreSQL adapter before persistent health data enters production.
3. Run the same repository contract suite against both adapters.
4. Use a one-time verified migration tool; reconcile row counts, hashes, and audit continuity.
5. Disable SQLite in any non-local environment.
