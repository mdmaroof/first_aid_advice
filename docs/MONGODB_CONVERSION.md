# SQLite to MongoDB Conversion

## Recommended role

MongoDB should not replace PostgreSQL for identity, clinic membership, consent grants, or audit authorization. If Curais adopts MongoDB, use it for versioned document-shaped clinical data while PostgreSQL remains the authorization system of record.

## Split-store architecture

### PostgreSQL retains

- Users and verified identities.
- Clinics and role memberships.
- Sharing grants, consent purpose/version/expiry, and revocation.
- Audit events and clinical document indexes.
- Transactional references to object-storage attachments.

### MongoDB stores

- Versioned visit documents.
- Flexible clinical observations and questionnaire responses.
- Device payloads after validation and normalization.
- Never raw authorization decisions or mutable audit history.

Example collection document:

```json
{
  "_id": "visit_01J...",
  "patientId": "patient_01J...",
  "clinicId": "clinic_01J...",
  "schemaVersion": 1,
  "recordVersion": 3,
  "status": "signed",
  "observations": [],
  "createdAt": "2026-08-12T08:00:00Z",
  "updatedAt": "2026-08-12T08:10:00Z"
}
```

## Adapter and authorization rule

1. API resolves actor through verified identity.
2. PostgreSQL authorization repository confirms membership and active patient grant.
3. Only then may the Mongo clinical repository fetch by both `patientId` and resource ID.
4. API emits the audit event to the PostgreSQL ledger.
5. Mongo document IDs and versions are referenced in PostgreSQL for traceability.

Do not trust a `patientId` supplied by the client without the PostgreSQL authorization check.

## Indexes and validation

- Compound indexes on `{patientId, updatedAt}`, `{clinicId, createdAt}`, and unique `{_id, recordVersion}` where the version model requires it.
- JSON Schema validation per `schemaVersion`.
- Majority write concern for signed clinical records.
- Transactions only where replica-set support and bounded document scope make them reliable.
- Immutable signed versions; corrections create a successor version.

## Conversion sequence

1. Introduce a `ClinicalDocumentRepository` interface without changing existing profile/access repositories.
2. Define canonical domain schemas and version upgrade functions.
3. Create Mongo collections, validators, indexes, encryption settings, and retention rules.
4. Export only the selected document-shaped entities; keep consent and audit in PostgreSQL.
5. Import with stable IDs and manifests, then compare counts, hashes, versions, and sampled renderings.
6. Shadow-read Mongo responses against the source without serving them.
7. Enable reads, then writes, behind separate feature flags.

## Rollback and failure handling

- PostgreSQL authorization stays authoritative throughout rollout.
- Keep source documents immutable during cutover and retain export manifests.
- If Mongo is unavailable, fail closed for clinical reads; never bypass grant checks or serve stale cached health records without an explicit safe policy.
- Use reconciliation jobs for cross-store indexes, but never infer consent from Mongo data.

## When not to use MongoDB

If the primary workload remains profiles, visits, vitals, clinic membership, and consent with predictable schemas, PostgreSQL JSONB is simpler and safer operationally. Add MongoDB only after real document variability or scale justifies a second sensitive datastore.
