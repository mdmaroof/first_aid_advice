import { CalendarDays, ClipboardPlus, Search, ShieldCheck, Users } from "lucide-react";
import { AppShell, FeatureCard } from "@curais/ui";

const features = [
  { icon: Users, eyebrow: "Patient access", title: "Shared patients", description: "Open records only through an active patient sharing grant or an approved clinical workflow.", href: "/patients", action: "View shared patients" },
  { icon: ClipboardPlus, eyebrow: "Clinical workflow", title: "Visit notes", description: "Capture structured vitals and attributable visit notes with an auditable change history.", action: "Planned" },
  { icon: CalendarDays, eyebrow: "Continuity", title: "Today’s care", description: "Review appointments, follow-ups, and consent status without exposing unrelated patient data.", action: "Planned" },
];

export default function DoctorHome() {
  return (
    <AppShell audience="Doctor app" actions={<button className="rounded-xl bg-aid-ink px-3 py-2 text-xs font-bold text-white">Sign in</button>}>
      <section className="pb-8 pt-14 md:pt-20">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-aid-teal">Clinical workspace</p>
        <h1 className="mt-3 max-w-4xl font-quicksand text-4xl font-bold tracking-tight text-aid-ink md:text-6xl">Focused care, with patient permission built in.</h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-aid-muted md:text-lg">Curais gives doctors the context patients choose to share, with clear roles and a complete access trail.</p>
        <a href="/patients" className="glass mt-8 flex max-w-2xl items-center gap-3 rounded-2xl px-4 py-3 transition hover:bg-white/60">
          <Search className="h-5 w-5 text-aid-teal" aria-hidden="true" />
          <span className="text-sm text-aid-muted">Patient search will require an active sharing grant</span>
          <ShieldCheck className="ml-auto h-5 w-5 text-aid-teal" aria-hidden="true" />
        </a>
      </section>
      <section className="grid gap-4 pb-16 md:grid-cols-3">{features.map((feature) => <FeatureCard key={feature.title} {...feature} />)}</section>
    </AppShell>
  );
}
