import { Activity, HeartPulse, ShieldCheck, Stethoscope, Users, History } from "lucide-react";
import { AppShell, FeatureCard, SignOutButton } from "@curais/ui";

const features = [
  {
    icon: HeartPulse,
    eyebrow: "Available now",
    title: "Immediate Care",
    description: "Use SnapAid for clear first-aid steps and emergency escalation without creating an account.",
    href: "/patient/snapaid",
    action: "Get help now",
  },
  { icon: History, eyebrow: "Personal timeline", title: "Health History", description: "Record diagnoses, procedures, visits, and important family-health context.", href: "/patient/history", action: "Open history" },
  { icon: Users, eyebrow: "Consent-led", title: "My Family", description: "Connect individual family accounts while each person controls what they share.", href: "/patient/family", action: "Manage family" },
  {
    icon: Activity,
    eyebrow: "Local foundation",
    title: "My Health",
    description: "Keep allergies, medications, conditions, emergency contacts, and saved care moments under your control.",
    href: "/patient/profile",
    action: "Set up profile",
  },
  {
    icon: Stethoscope,
    eyebrow: "Available locally",
    title: "Care Team",
    description: "Share only the records you choose with a doctor or clinic and revoke access when needed.",
    href: "/patient/care-team",
    action: "Manage access",
  },
];

export const metadata = {
  title: "Patient home | Curais",
  description: "Curais patient care home.",
};

export default function PatientHome() {
  return (
    <AppShell audience="Patient app" actions={<div className="flex items-center gap-2"><a href="/patient/snapaid" className="rounded-xl bg-aid-teal px-3 py-2 text-xs font-bold text-white">SnapAid</a><SignOutButton /></div>}>
      <section className="grid gap-8 pb-8 pt-14 md:grid-cols-[1.2fr_0.8fr] md:items-center md:pt-20">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-aid-teal">Your care, connected</p>
          <h1 className="mt-3 max-w-3xl font-quicksand text-4xl font-bold tracking-tight text-aid-ink md:text-6xl">
            Clear help now. Better care next.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-aid-muted md:text-lg">
            Curais begins with safe immediate guidance and grows into a health record you control.
          </p>
        </div>
        <div className="glass-strong rounded-[2rem] p-5">
          <div className="flex items-start gap-3">
            <span className="rounded-2xl bg-aid-teal/10 p-3 text-aid-teal"><ShieldCheck className="h-6 w-6" /></span>
            <div><p className="font-quicksand text-lg font-bold">Privacy by design</p><p className="mt-1 text-sm leading-relaxed text-aid-muted">Immediate Care works without an account. Health data is saved only after explicit consent.</p></div>
          </div>
        </div>
      </section>
      <section className="grid gap-4 pb-16 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => <FeatureCard key={feature.title} {...feature} />)}
      </section>
    </AppShell>
  );
}
