import { AppShell } from "@curais/ui";
import { ProfileForm } from "@/components/patient/ProfileForm";

export const metadata = {
  title: "My Health | Curais",
  description: "A patient-controlled Curais health profile.",
};

export default function ProfilePage() {
  return (
    <AppShell
      audience="Patient app"
      actions={<a href="/patient" className="rounded-xl bg-aid-ink px-3 py-2 text-xs font-bold text-white">Patient home</a>}
    >
      <section className="mx-auto max-w-3xl pb-16 pt-10 md:pt-14">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-aid-teal">My Health</p>
        <h1 className="mt-2 font-quicksand text-3xl font-bold tracking-tight text-aid-ink md:text-5xl">Your essential care context</h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-aid-muted">This local foundation stores only the profile you explicitly save. Doctor sharing is not enabled yet.</p>
        <ProfileForm />
      </section>
    </AppShell>
  );
}
