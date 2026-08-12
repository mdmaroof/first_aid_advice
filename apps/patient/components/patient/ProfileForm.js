"use client";

import { useEffect, useState } from "react";
import { Loader2, Save, ShieldCheck } from "lucide-react";

const emptyProfile = {
  displayName: "",
  dateOfBirth: "",
  bloodGroup: "",
  emergencyContact: { name: "", phone: "" },
  allergies: [],
  medications: [],
};

function listToText(items) {
  return (items ?? []).map((item) => item.name).filter(Boolean).join(", ");
}

function textToList(value, extraField) {
  return value.split(",").map((item) => item.trim()).filter(Boolean).map((name) => ({ name, [extraField]: "" }));
}

export function ProfileForm() {
  const [profile, setProfile] = useState(emptyProfile);
  const [allergies, setAllergies] = useState("");
  const [medications, setMedications] = useState("");
  const [status, setStatus] = useState({ type: "loading", message: "Loading local profile…" });

  useEffect(() => {
    let active = true;
    fetch("/api/curais/profile", { cache: "no-store" })
      .then(async (response) => {
        if (response.status === 404) return null;
        if (!response.ok) throw new Error("Start the Curais API to load this profile.");
        return response.json();
      })
      .then((value) => {
        if (!active) return;
        if (value) {
          setProfile({ ...emptyProfile, ...value, emergencyContact: { ...emptyProfile.emergencyContact, ...value.emergencyContact } });
          setAllergies(listToText(value.allergies));
          setMedications(listToText(value.medications));
        }
        setStatus({ type: "idle", message: value ? `Saved profile version ${value.version}` : "No saved profile yet" });
      })
      .catch((error) => active && setStatus({ type: "error", message: error.message }));
    return () => { active = false; };
  }, []);

  const update = (field, value) => setProfile((current) => ({ ...current, [field]: value }));
  const updateContact = (field, value) => setProfile((current) => ({ ...current, emergencyContact: { ...current.emergencyContact, [field]: value } }));

  async function submit(event) {
    event.preventDefault();
    setStatus({ type: "saving", message: "Saving…" });
    try {
      const response = await fetch("/api/curais/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...profile, allergies: textToList(allergies, "severity"), medications: textToList(medications, "details") }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result?.error?.message || "Unable to save profile.");
      setProfile(result);
      setStatus({ type: "success", message: `Saved profile version ${result.version}` });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  }

  const fieldClass = "mt-1.5 w-full rounded-xl border border-white/70 bg-white/55 px-3 py-2.5 text-aid-ink outline-none transition focus:border-aid-teal focus:ring-2 focus:ring-aid-teal/15";

  return (
    <form onSubmit={submit} className="glass-strong mt-8 rounded-[2rem] p-5 md:p-7">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-bold text-aid-ink">Full name<input required value={profile.displayName} onChange={(event) => update("displayName", event.target.value)} className={fieldClass} /></label>
        <label className="text-sm font-bold text-aid-ink">Date of birth<input type="date" value={profile.dateOfBirth} onChange={(event) => update("dateOfBirth", event.target.value)} className={fieldClass} /></label>
        <label className="text-sm font-bold text-aid-ink">Blood group<input placeholder="e.g. O+" value={profile.bloodGroup} onChange={(event) => update("bloodGroup", event.target.value)} className={fieldClass} /></label>
        <label className="text-sm font-bold text-aid-ink">Emergency contact name<input value={profile.emergencyContact.name} onChange={(event) => updateContact("name", event.target.value)} className={fieldClass} /></label>
        <label className="text-sm font-bold text-aid-ink sm:col-span-2">Emergency contact phone<input type="tel" value={profile.emergencyContact.phone} onChange={(event) => updateContact("phone", event.target.value)} className={fieldClass} /></label>
        <label className="text-sm font-bold text-aid-ink sm:col-span-2">Allergies <span className="font-normal text-aid-muted">(comma separated)</span><input placeholder="e.g. peanuts, penicillin" value={allergies} onChange={(event) => setAllergies(event.target.value)} className={fieldClass} /></label>
        <label className="text-sm font-bold text-aid-ink sm:col-span-2">Current medications <span className="font-normal text-aid-muted">(comma separated)</span><input placeholder="e.g. metformin" value={medications} onChange={(event) => setMedications(event.target.value)} className={fieldClass} /></label>
      </div>
      <div className="mt-6 flex flex-col gap-3 border-t border-white/60 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p role="status" className={`inline-flex items-center gap-2 text-sm font-semibold ${status.type === "error" ? "text-aid-emergency" : "text-aid-muted"}`}>
          {status.type === "loading" || status.type === "saving" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4 text-aid-teal" />}{status.message}
        </p>
        <button disabled={status.type === "saving"} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-aid-teal px-5 py-2.5 text-sm font-bold text-white hover:bg-aid-teal-deep disabled:opacity-60"><Save className="h-4 w-4" />Save my profile</button>
      </div>
    </form>
  );
}
