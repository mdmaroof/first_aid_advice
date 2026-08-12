"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Building2, Loader2, ShieldCheck, ShieldX } from "lucide-react";
import { errorMessage, readApiResponse, useToast } from "@curais/ui";

export function CareTeamManager() {
  const { showToast } = useToast();
  const [data, setData] = useState({ clinics: [], grants: [] });
  const [status, setStatus] = useState({ type: "loading", message: "Loading access…" });

  const load = useCallback(async () => {
    setStatus({ type: "loading", message: "Loading access…" });
    try {
      const response = await fetch("/api/curais/care-team", { cache: "no-store" });
      const result = await readApiResponse(response);
      setData(result);
      setStatus({ type: "idle", message: "Access is controlled by you" });
    } catch (error) {
      setStatus({ type: "idle", message: "Access information unavailable" });
      showToast({ type: "error", title: "Care Team could not load", message: errorMessage(error, "Unable to load care team.") });
    }
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  const activeClinicIDs = useMemo(() => new Set(data.grants.filter((grant) => grant.status === "active").map((grant) => grant.clinicId)), [data.grants]);

  async function grant(clinicId) {
    setStatus({ type: "saving", message: "Granting access…" });
    try { const response = await fetch("/api/curais/care-team", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ clinicId, scope: "profile.read" }) }); await readApiResponse(response); await load(); showToast({ type: "success", title: "Clinic access granted", message: "The clinic can now read your essential health profile." }); }
    catch (error) { setStatus({ type: "idle", message: "Access unchanged" }); showToast({ type: "error", title: "Access was not granted", message: errorMessage(error, "Unable to grant access.") }); }
  }

  async function revoke(grantId) {
    setStatus({ type: "saving", message: "Revoking access…" });
    try { const response = await fetch(`/api/curais/care-team/${encodeURIComponent(grantId)}`, { method: "DELETE" }); await readApiResponse(response); await load(); showToast({ type: "warning", title: "Clinic access revoked", message: "Future access is blocked immediately. Existing attributable clinical records are retained." }); }
    catch (error) { setStatus({ type: "idle", message: "Access unchanged" }); showToast({ type: "error", title: "Access was not revoked", message: errorMessage(error, "Unable to revoke access.") }); }
  }

  return (
    <div className="mt-8 space-y-5">
      <div className="glass-strong rounded-[2rem] p-5 md:p-6">
        <div className="flex items-center justify-between gap-4"><div><h2 className="font-quicksand text-xl font-bold">Available clinics</h2><p className="mt-1 text-sm text-aid-muted">Local directory for this development slice.</p></div><Building2 className="h-6 w-6 text-aid-teal" /></div>
        <div className="mt-5 grid gap-3">
          {data.clinics.map((clinic) => {
            const active = activeClinicIDs.has(clinic.id);
            return <div key={clinic.id} className="glass flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-bold text-aid-ink">{clinic.name}</p><p className="mt-1 text-xs text-aid-muted">Permission: read essential health profile</p></div>{active ? <span className="inline-flex items-center gap-2 text-sm font-bold text-aid-teal"><ShieldCheck className="h-4 w-4" />Access active</span> : <button onClick={() => grant(clinic.id)} disabled={status.type === "saving"} className="min-h-11 rounded-xl bg-aid-teal px-4 py-2 text-sm font-bold text-white disabled:opacity-60">Grant access</button>}</div>;
          })}
        </div>
      </div>

      <div className="glass-strong rounded-[2rem] p-5 md:p-6">
        <h2 className="font-quicksand text-xl font-bold">Access history</h2>
        <div className="mt-4 space-y-3">
          {data.grants.length === 0 ? <p className="text-sm text-aid-muted">You have not shared your profile with a clinic.</p> : data.grants.map((grantItem) => <div key={grantItem.id} className="glass flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-bold text-aid-ink">{grantItem.clinicName}</p><p className="mt-1 text-xs text-aid-muted">{grantItem.status === "active" ? `Granted ${new Date(grantItem.grantedAt).toLocaleString()}` : `Revoked ${new Date(grantItem.revokedAt).toLocaleString()}`}</p></div>{grantItem.status === "active" ? <button onClick={() => revoke(grantItem.id)} disabled={status.type === "saving"} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-aid-emergency/30 px-4 py-2 text-sm font-bold text-aid-emergency disabled:opacity-60"><ShieldX className="h-4 w-4" />Revoke</button> : <span className="text-sm font-bold text-aid-muted">Revoked</span>}</div>)}
        </div>
      </div>

      <p role="status" className={`inline-flex items-center gap-2 text-sm font-semibold ${status.type === "error" ? "text-aid-emergency" : "text-aid-muted"}`}>{status.type === "loading" || status.type === "saving" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4 text-aid-teal" />}{status.message}</p>
    </div>
  );
}
