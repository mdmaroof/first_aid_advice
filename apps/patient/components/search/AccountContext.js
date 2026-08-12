"use client";

import { useState } from "react";
import { Clock3, FileHeart, Loader2, LogIn, Pill, Save, ShieldCheck } from "lucide-react";
import { useToast } from "@curais/ui";

export function AccountContext({ result }) {
  const { showToast } = useToast();
  const [state, setState] = useState({ status: "idle", profile: null, history: [] });
  const [saving, setSaving] = useState(false);

  async function loadContext() {
    setState((current) => ({ ...current, status: "loading" }));
    try {
      const [profileResponse, historyResponse] = await Promise.all([
        fetch("/api/curais/profile", { cache: "no-store" }),
        fetch("/api/curais/history", { cache: "no-store" }),
      ]);

      if (profileResponse.status === 401 || historyResponse.status === 401) {
        setState({ status: "anonymous", profile: null, history: [] });
        return;
      }

      if (!profileResponse.ok && profileResponse.status !== 404) throw new Error("profile");
      if (!historyResponse.ok) throw new Error("history");

      const profile = profileResponse.status === 404 ? null : await profileResponse.json();
      const historyPayload = await historyResponse.json();
      setState({ status: "ready", profile, history: (historyPayload.history || []).slice(0, 3) });
    } catch {
      setState((current) => ({ ...current, status: "idle" }));
      showToast({ type: "error", title: "Health context unavailable", message: "Your guidance is still available. Try loading your account context again later." });
    }
  }

  async function saveCareMoment() {
    if (saving) return;
    setSaving(true);
    const title = result?.first_instance?.disease || "Immediate Care guidance";
    const steps = (result?.instant_help || []).map((item) => `${item.step}. ${item.info}`).join(" ");
    try {
      const response = await fetch("/api/curais/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: "other",
          title: `Immediate Care: ${title}`,
          details: `Patient chose to save general first-aid guidance, not a diagnosis. ${result?.medical_advice || ""} ${steps}`.trim(),
          occurredAt: new Date().toISOString().slice(0, 10),
        }),
      });
      if (!response.ok) throw new Error("save");
      showToast({ type: "success", title: "Care moment saved", message: "It is now available in your patient health timeline." });
    } catch {
      showToast({ type: "error", title: "Care moment not saved", message: "Your guidance is unchanged. Please try saving again later." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="glass mt-4 rounded-[1.5rem] p-4 md:p-5" aria-labelledby="account-context-title">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-aid-teal/10 text-aid-teal"><ShieldCheck className="h-5 w-5" /></span>
        <div className="min-w-0 flex-1">
          <h2 id="account-context-title" className="font-quicksand text-lg font-bold">Your health context—only when you choose</h2>
          <p className="mt-1 text-sm leading-6 text-aid-muted">Review your allergies, medicines and recent history beside this guidance. It never delays or changes the emergency steps above.</p>
        </div>
      </div>

      {state.status === "idle" || state.status === "loading" ? (
        <button onClick={loadContext} disabled={state.status === "loading"} className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-aid-teal px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60 sm:w-auto">
          {state.status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileHeart className="h-4 w-4" />}
          {state.status === "loading" ? "Checking your account…" : "Review my health context"}
        </button>
      ) : null}

      {state.status === "anonymous" ? (
        <div className="mt-4 flex flex-col gap-3 rounded-xl bg-white/45 p-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-aid-muted">Immediate Care remains available without an account. Sign in only if you want history features.</p>
          <a href="/signin?next=/immediate-care/search" className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-aid-ink px-4 py-2 text-sm font-bold text-white"><LogIn className="h-4 w-4" />Sign in</a>
        </div>
      ) : null}

      {state.status === "ready" ? (
        <div className="mt-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <ContextList icon={ShieldCheck} title="Allergies" items={(state.profile?.allergies || []).map((item) => item.name)} empty="No allergies saved" />
            <ContextList icon={Pill} title="Current medicines" items={(state.profile?.medications || []).map((item) => item.name)} empty="No medicines saved" />
          </div>
          <div className="mt-3 rounded-xl border border-white/70 bg-white/45 p-3">
            <p className="flex items-center gap-2 text-sm font-bold"><Clock3 className="h-4 w-4 text-aid-teal" />Recent health history</p>
            {state.history.length ? <ul className="mt-2 space-y-2">{state.history.map((item) => <li key={item.id} className="text-xs leading-5 text-aid-muted"><span className="font-bold text-aid-ink">{item.title}</span>{item.occurredAt ? ` · ${item.occurredAt}` : ""}</li>)}</ul> : <p className="mt-2 text-xs text-aid-muted">No history entries saved yet.</p>}
          </div>
          <button onClick={saveCareMoment} disabled={saving} className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-aid-ink px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60 sm:w-auto">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{saving ? "Saving…" : "Save this care moment"}
          </button>
        </div>
      ) : null}
    </section>
  );
}

function ContextList({ icon: Icon, title, items, empty }) {
  return <div className="rounded-xl border border-white/70 bg-white/45 p-3"><p className="flex items-center gap-2 text-sm font-bold"><Icon className="h-4 w-4 text-aid-teal" />{title}</p><p className="mt-2 text-xs leading-5 text-aid-muted">{items.length ? items.join(", ") : empty}</p></div>;
}
