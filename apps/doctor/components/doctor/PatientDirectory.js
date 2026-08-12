"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Search, ShieldCheck, UserRound } from "lucide-react";

export function PatientDirectory() {
  const [query, setQuery] = useState("");
  const [patients, setPatients] = useState([]);
  const [status, setStatus] = useState({ type: "loading", message: "Loading consented patients…" });

  const load = useCallback(async (search = "") => {
    setStatus({ type: "loading", message: "Checking active grants…" });
    try {
      const response = await fetch(`/api/curais/patients?query=${encodeURIComponent(search)}`, { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result?.error?.message || "Unable to load shared patients.");
      setPatients(result.patients || []);
      setStatus({ type: "idle", message: `${result.patients?.length || 0} actively shared patient${result.patients?.length === 1 ? "" : "s"}` });
    } catch (error) { setStatus({ type: "error", message: error.message }); }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="mt-8">
      <form onSubmit={(event) => { event.preventDefault(); load(query); }} className="glass flex max-w-2xl items-center gap-3 rounded-2xl p-2 pl-4">
        <Search className="h-5 w-5 text-aid-teal" aria-hidden="true" />
        <label htmlFor="patient-query" className="sr-only">Search shared patients</label>
        <input id="patient-query" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by patient name" className="min-w-0 flex-1 bg-transparent py-2 text-sm text-aid-ink outline-none placeholder:text-aid-muted" />
        <button className="min-h-11 rounded-xl bg-aid-teal px-4 py-2 text-sm font-bold text-white">Search</button>
      </form>

      <p role="status" className={`mt-4 inline-flex items-center gap-2 text-sm font-semibold ${status.type === "error" ? "text-aid-emergency" : "text-aid-muted"}`}>{status.type === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4 text-aid-teal" />}{status.message}</p>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {patients.map((patient) => <a href={`/patients/${encodeURIComponent(patient.patientId)}`} key={patient.patientId} className="glass-strong rounded-[1.5rem] p-5 transition hover:-translate-y-1"><span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-aid-teal/10 text-aid-teal"><UserRound className="h-5 w-5" /></span><h2 className="mt-4 font-quicksand text-xl font-bold">{patient.displayName}</h2><p className="mt-2 text-sm text-aid-muted">Blood group: {patient.bloodGroup || "Not recorded"}</p><p className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-aid-teal">Active profile grant</p></a>)}
      </div>
      {status.type === "idle" && patients.length === 0 ? <div className="glass-strong mt-5 rounded-[1.5rem] p-6 text-sm leading-relaxed text-aid-muted">No patient currently shares a profile with your clinic. A patient must grant access from their Care Team screen.</div> : null}
    </div>
  );
}
