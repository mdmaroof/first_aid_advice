import { AppShell } from "@curais/ui";
import { SharedProfile } from "@/components/doctor/SharedProfile";
import { ClinicalHistory } from "@/components/doctor/ClinicalHistory";

export default function SharedPatientPage({ params }) {
  return (
    <AppShell audience="Doctor app" actions={<a href="/patients" className="rounded-xl bg-aid-ink px-3 py-2 text-xs font-bold text-white">Shared patients</a>}>
      <section className="mx-auto max-w-5xl pb-16 pt-10 md:pt-14"><SharedProfile patientID={params.patientID} /><ClinicalHistory patientID={params.patientID} /></section>
    </AppShell>
  );
}
