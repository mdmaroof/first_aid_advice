# Curais Feature Ticket List

## P0 — Immediate Care safety and rebrand

| ID | Ticket | Acceptance criteria |
| --- | --- | --- |
| CUR-001 | Rebrand SnapAid to “Curais Immediate Care” | Curais identity used consistently; existing guidance flow stays functional. |
| CUR-002 | Add emergency intent router | High-risk intents show curated emergency action before any model output. |
| CUR-003 | Add AI safety evaluation set | Clinician-reviewed test cases cover chest pain, stroke signs, choking, anaphylaxis, poisoning, burns, pregnancy, and child scenarios. |
| CUR-004 | Replace serverless rate limiter | Limit is shared across instances and returns consistent retry information. |
| CUR-005 | Add feedback/reporting | User can flag unsafe or unhelpful guidance without submitting unnecessary personal data. |
| CUR-006 | Privacy and consent copy | Explains AI processing, no-diagnosis boundary, and data retention in plain language. |

## P1 — Personal Care Record

| ID | Ticket | Acceptance criteria |
| --- | --- | --- |
| CUR-101 | Account and phone verification | Authenticated users have secure sessions; sign-out invalidates session. |
| CUR-102 | Health profile | User can add/edit/delete allergies, medications, and emergency contacts. |
| CUR-103 | Save guidance with consent | No guidance is persisted until the user explicitly chooses Save. |
| CUR-104 | Export and delete data | User can export their records and request/account deletion from settings. |
| CUR-105 | Consent ledger | Every sharing/saving consent is versioned, timestamped, and revocable. |

## P2 — Clinic workspace

| ID | Ticket | Acceptance criteria |
| --- | --- | --- |
| CUR-201 | Clinic onboarding and roles | Owner, clinician, assistant, and support roles have least-privilege access. |
| CUR-202 | Patient sharing grant | Clinic sees a record only after patient authorization or documented lawful workflow. |
| CUR-203 | Visit record and vitals | Changes are attributed, timestamped, and auditable. |
| CUR-204 | Offline drafts | Local drafts are encrypted where supported and require review on sync. |
| CUR-205 | Access audit view | Patient/admin can view meaningful access events. |

