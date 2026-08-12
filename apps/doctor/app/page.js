import { AppShell, SignOutButton } from "@curais/ui";
import { DoctorNav } from "@/components/doctor/DoctorNav";
import { Dashboard } from "@/components/doctor/Dashboard";

export default function DoctorHome(){return <AppShell audience="Doctor EMR" actions={<SignOutButton/>}><DoctorNav/><section className="pb-16 pt-9"><p className="text-sm font-bold uppercase tracking-[.18em] text-aid-teal">Clinical command center</p><h1 className="mt-2 max-w-3xl font-quicksand text-4xl font-bold md:text-6xl">Good care starts with the right context.</h1><p className="mt-4 max-w-2xl text-aid-muted">Manage today’s schedule, consented records, encounters, medication orders, and diagnostics from one workspace.</p><Dashboard/></section></AppShell>}
