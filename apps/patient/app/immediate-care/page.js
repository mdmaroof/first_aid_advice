import { cookies } from "next/headers";
import { SnapAidHome } from "@/app/patient/snapaid/page";

export const metadata = {
  title: "Immediate Care | Curais",
  description: "Public first-aid guidance with direct emergency escalation. No account required.",
};

export default function ImmediateCarePage() {
  const signedIn = Boolean(cookies().get("curais_patient_session")?.value);
  return <SnapAidHome signedIn={signedIn} />;
}
