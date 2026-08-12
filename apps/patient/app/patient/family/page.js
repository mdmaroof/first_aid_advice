import { AppShell } from "@curais/ui";
import { FamilyManager } from "@/components/patient/FamilyManager";
export const metadata = { title: "My family | Curais" };
export default function FamilyPage() { return <AppShell audience="Patient app" actions={<a href="/patient" className="rounded-xl bg-aid-ink px-3 py-2 text-xs font-bold text-white">Patient home</a>}><section className="pb-16 pt-10"><p className="text-sm font-bold uppercase tracking-[.18em] text-aid-teal">Connected care</p><h1 className="mt-2 font-quicksand text-4xl font-bold">My family</h1><p className="mt-3 max-w-2xl text-aid-muted">Each person keeps their own login and chooses whether family-history context is shared.</p><FamilyManager /></section></AppShell>; }
