# Curais monorepo

Curais contains two independently deployable applications and a Go API:

- `apps/patient` - patient experience; the existing SnapAid product remains its Immediate Care feature.
- `apps/doctor` - clinical workspace.
- `packages/ui` - shared visual primitives and Curais identity.
- `services/api` - Go backend using SQLite locally.

## Development

```bash
npm install
npm run dev:patient # http://localhost:3000
npm run dev:doctor  # http://localhost:3001
npm run api:dev     # http://localhost:8080
```

Patient routes:

- `/signin` - patient sign-in and sign-up.
- `/patient` - authenticated Curais patient home.
- `/patient/snapaid` - existing SnapAid Immediate Care flow.
- `/patient/profile` - local My Health vertical slice backed by the Go API.
- `/patient/care-team` - grant/revoke local clinic profile access.
- `/patient/history` - patient-authored longitudinal health history.
- `/patient/family` - invitation-based family account connections.

Doctor routes:

- `/signin` - doctor sign-in and sign-up.
- `/` - authenticated doctor EMR workspace.
- `/patients` - patients with active grants to the doctor's clinic.
- `/patients/{patientID}` - consent-checked shared profile and clinical history.

The apps use opaque Go API sessions stored in HttpOnly cookies. Local identity
headers remain available only as a development testing adapter.

API endpoints and migration runbooks are documented in `docs/API_REFERENCE.md`,
`docs/openapi.yaml`, `docs/SWAGGER_GUIDE.md`, `docs/POSTGRESQL_CONVERSION.md`,
and `docs/MONGODB_CONVERSION.md`.

For deployment, create separate projects rooted at `apps/patient` and
`apps/doctor`, and deploy `services/api` as an independent Go service. Do not
serve the local SQLite database from a serverless filesystem.

## SnapAid

Instant first-aid guidance. Describe symptoms (or tap a common emergency) and get clear, step-by-step actions — plus a one-tap call to local emergency services.

**Live:** [https://www.snapaid.live](https://www.snapaid.live)

> SnapAid provides general first-aid guidance only. It is not a diagnosis or a substitute for professional medical care.

## Stack

- Next.js App Router
- Tailwind CSS
- Framer Motion
- DeepSeek (via OpenAI-compatible API) for free-text symptom guidance
- Curated quick-aid responses for common emergencies (no API needed)

## Getting started

```bash
npm install
cp .env.example .env.local   # if present — or create .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment

| Variable | Purpose |
| --- | --- |
| `DEEPSEEK_API_KEY` | Server-side key for `/api` guidance |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (optional; defaults to snapaid.live / Vercel URL) |

## Scripts

```bash
npm run dev    # local development
npm run build  # production build
npm run start  # run production build
npm run lint   # ESLint
```

## Notes

- Quick options (heart pain, bleeding, choking, …) are served from local data.
- Free-text searches call `/api` and are rate-limited.
- Results are kept in `sessionStorage` so a refresh on `/search` does not lose guidance.
