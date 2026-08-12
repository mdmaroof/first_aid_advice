import { AppShell } from "@curais/ui";
import { PatientDirectory } from "@/components/doctor/PatientDirectory";

export const metadata = { title: "Shared patients | Curais Doctor" };

export default function PatientsPage() {
  return (
    <AppShell audience="Doctor app" actions={<a href="/" className="rounded-xl bg-aid-ink px-3 py-2 text-xs font-bold text-white">Doctor home</a>}>
      <section className="pb-16 pt-10 md:pt-14">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-aid-teal">Patient access</p>
        <h1 className="mt-2 font-quicksand text-3xl font-bold tracking-tight text-aid-ink md:text-5xl">Shared patients only</h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-aid-muted">This directory is generated from active clinic memberships and patient grants. Revoked patients disappear immediately.</p>
        <PatientDirectory />
      </section>
    </AppShell>
  );
}
