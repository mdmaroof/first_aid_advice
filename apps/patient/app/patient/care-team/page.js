import { AppShell } from "@curais/ui";
import { CareTeamManager } from "@/components/patient/CareTeamManager";

export const metadata = {
  title: "Care Team | Curais",
  description: "Control which clinics can read your Curais health profile.",
};

export default function CareTeamPage() {
  return (
    <AppShell audience="Patient app" actions={<a href="/patient" className="rounded-xl bg-aid-ink px-3 py-2 text-xs font-bold text-white">Patient home</a>}>
      <section className="mx-auto max-w-3xl pb-16 pt-10 md:pt-14">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-aid-teal">Care Team</p>
        <h1 className="mt-2 font-quicksand text-3xl font-bold tracking-tight text-aid-ink md:text-5xl">You decide who can see your profile</h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-aid-muted">A clinic receives read-only profile access only after you grant it here. You can revoke that access at any time.</p>
        <CareTeamManager />
      </section>
    </AppShell>
  );
}
