import { AppShell } from "@curais/ui";
import { HistoryManager } from "@/components/patient/HistoryManager";
export const metadata = { title: "Health history | Curais" };
export default function HistoryPage() { return <AppShell audience="Patient app" actions={<a href="/patient" className="rounded-xl bg-aid-ink px-3 py-2 text-xs font-bold text-white">Patient home</a>}><section className="pb-16 pt-10"><p className="text-sm font-bold uppercase tracking-[.18em] text-aid-teal">My timeline</p><h1 className="mt-2 font-quicksand text-4xl font-bold">Health history</h1><p className="mt-3 max-w-2xl text-aid-muted">Keep diagnoses, procedures, visits, and family-history context together.</p><HistoryManager /></section></AppShell>; }
