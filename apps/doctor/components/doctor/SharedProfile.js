"use client";

import { useEffect, useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { errorMessage, readApiResponse, useToast } from "@curais/ui";

export function SharedProfile({ patientID }) {
  const { showToast } = useToast();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => { fetch(`/api/curais/patients/${encodeURIComponent(patientID)}`, { cache: "no-store" }).then(readApiResponse).then(setProfile).catch((reason) => { const message=errorMessage(reason,"Unable to load profile.");setError(message);showToast({type:"error",title:"Patient profile unavailable",message}); }); }, [patientID, showToast]);
  if (error) return <div className="glass-strong rounded-[2rem] p-6"><h1 className="font-quicksand text-2xl font-bold">Access unavailable</h1><p className="mt-3 text-aid-emergency">{error}</p><p className="mt-3 text-sm text-aid-muted">The patient may have revoked the sharing grant.</p></div>;
  if (!profile) return <p role="status" className="inline-flex items-center gap-2 text-aid-muted"><Loader2 className="h-4 w-4 animate-spin" />Verifying active consent…</p>;
  return <div><p className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-aid-teal"><ShieldCheck className="h-4 w-4" />Patient-shared EMR</p><h1 className="mt-3 font-quicksand text-4xl font-bold">{profile.displayName}</h1><div className="glass-strong mt-7 grid gap-5 rounded-[2rem] p-6 sm:grid-cols-2"><ProfileItem label="Date of birth" value={profile.dateOfBirth} /><ProfileItem label="Blood group" value={profile.bloodGroup} /><ProfileItem label="Mobile" value={profile.mobilePhone} /><ProfileItem label="Emergency contact" value={[profile.emergencyContact?.name, profile.emergencyContact?.phone].filter(Boolean).join(" · ")} /><ProfileItem label="Allergies" value={profile.allergies?.map((item) => item.name).join(", ")} wide /><ProfileItem label="Medications" value={profile.medications?.map((item) => item.name).join(", ")} wide /></div></div>;
}

function ProfileItem({ label, value, wide = false }) { return <div className={`glass rounded-2xl p-4 ${wide ? "sm:col-span-2" : ""}`}><p className="text-xs font-bold uppercase tracking-[0.12em] text-aid-teal">{label}</p><p className="mt-2 text-sm font-semibold text-aid-ink">{value || "Not recorded"}</p></div>; }
