import { BrandMark } from "@curais/ui";

const patientURL = process.env.NEXT_PUBLIC_PATIENT_APP_URL || "http://localhost:3000";
const doctorURL = process.env.NEXT_PUBLIC_DOCTOR_APP_URL || "http://localhost:3001";

export function LegalPage({ eyebrow, title, summary, updated, children }) {
  return <div className="min-h-dvh"><header className="site-shell pt-4"><nav className="glass-strong flex min-h-16 items-center justify-between rounded-2xl px-4 sm:px-5"><a href="/"><BrandMark compact/></a><a href="/" className="rounded-xl px-3 py-2 text-sm font-bold text-aid-teal">Back to Curais</a></nav></header><main className="site-shell py-14 sm:py-20"><section className="mx-auto max-w-4xl"><p className="eyebrow">{eyebrow}</p><h1 className="mt-3 font-quicksand text-4xl font-bold tracking-tight sm:text-6xl">{title}</h1><p className="body-copy mt-5 max-w-3xl">{summary}</p><p className="mt-4 text-sm font-semibold text-aid-muted">Last updated: {updated}</p><article className="glass-strong legal-copy mt-10 rounded-[2rem] p-6 sm:p-10">{children}</article></section></main><footer className="border-t border-white/60 bg-white/25"><div className="site-shell flex flex-col gap-3 py-7 text-sm text-aid-muted sm:flex-row sm:justify-between"><p>© 2026 Curais</p><div className="flex flex-wrap gap-4"><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href={`${patientURL}/signin`}>Patient app</a><a href={`${doctorURL}/signin`}>Doctor EMR</a></div></div></footer></div>;
}

export function LegalSection({ title, children }) { return <section><h2>{title}</h2>{children}</section>; }
