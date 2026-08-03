# SnapAid

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
