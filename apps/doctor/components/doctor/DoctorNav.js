import { CalendarDays, ClipboardList, FlaskConical, LayoutDashboard, Pill, Users } from "lucide-react";

const links = [
  ["/", "Dashboard", LayoutDashboard], ["/patients", "Patients", Users], ["/appointments", "Appointments", CalendarDays],
  ["/encounters", "Encounters", ClipboardList], ["/prescriptions", "Prescriptions", Pill], ["/labs", "Labs", FlaskConical],
];
export function DoctorNav() { return <nav className="mt-4 flex gap-2 overflow-x-auto pb-2" aria-label="Doctor EMR navigation">{links.map(([href,label,Icon])=><a key={href} href={href} className="glass inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-aid-ink transition hover:bg-white/70"><Icon className="h-4 w-4 text-aid-teal" />{label}</a>)}</nav>; }
