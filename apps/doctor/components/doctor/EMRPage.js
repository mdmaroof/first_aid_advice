import { AppShell, SignOutButton } from "@curais/ui";
import { DoctorNav } from "./DoctorNav";
import { EMRWorkspace } from "./EMRWorkspace";

export function EMRPage({ resource, eyebrow, title, description }) { return <AppShell audience="Doctor EMR" actions={<SignOutButton />}><DoctorNav/><section className="pb-16 pt-8"><p className="text-sm font-bold uppercase tracking-[.18em] text-aid-teal">{eyebrow}</p><h1 className="mt-2 font-quicksand text-4xl font-bold md:text-5xl">{title}</h1><p className="mt-3 max-w-2xl text-aid-muted">{description}</p><EMRWorkspace resource={resource}/></section></AppShell>; }
