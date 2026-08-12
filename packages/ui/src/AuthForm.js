"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BrandMark } from "./BrandMark";

export function AuthForm({ role, homePath, counterpart }) {
  const router = useRouter();
  const [mode, setMode] = useState("signin");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.get("email"),
          password: data.get("password"),
          displayName: data.get("displayName") || undefined,
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(payload?.error?.message || "We could not complete that request.");
        return;
      }
      router.replace(homePath);
      router.refresh();
    } catch {
      setError("The Curais API is unavailable. Start the API and try again.");
    } finally {
      setBusy(false);
    }
  }

  const audience = role === "doctor" ? "Doctor" : "Patient";
  return (
    <main className="page-blobs flex min-h-dvh items-center justify-center px-4 py-10 text-aid-ink">
      <section className="glass-strong relative z-10 w-full max-w-md rounded-[2rem] p-6 md:p-8">
        <BrandMark />
        <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-aid-teal">{audience} app</p>
        <h1 className="mt-2 font-quicksand text-3xl font-bold">{mode === "signin" ? "Welcome back" : "Create your account"}</h1>
        <p className="mt-2 text-sm leading-relaxed text-aid-muted">
          {mode === "signin" ? `Sign in to your private ${audience.toLowerCase()} workspace.` : `Set up a secure ${audience.toLowerCase()} workspace in a minute.`}
        </p>

        <div className="mt-6 grid grid-cols-2 rounded-2xl bg-white/35 p-1" aria-label="Authentication mode">
          {["signin", "signup"].map((item) => (
            <button key={item} type="button" onClick={() => { setMode(item); setError(""); }} className={`rounded-xl px-3 py-2 text-sm font-bold transition ${mode === item ? "bg-aid-ink text-white" : "text-aid-muted hover:bg-white/40"}`}>
              {item === "signin" ? "Sign in" : "Sign up"}
            </button>
          ))}
        </div>

        <form className="mt-6 space-y-4" onSubmit={submit}>
          {mode === "signup" ? <Field label="Full name" name="displayName" autoComplete="name" minLength={2} /> : null}
          <Field label="Email" name="email" type="email" autoComplete="email" />
          <Field label="Password" name="password" type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} minLength={10} hint={mode === "signup" ? "At least 10 characters" : undefined} />
          {error ? <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-aid-emergency">{error}</p> : null}
          <button disabled={busy} className="w-full rounded-2xl bg-aid-teal px-4 py-3 font-bold text-white transition hover:bg-aid-teal-deep disabled:cursor-wait disabled:opacity-60">
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>
        {role === "doctor" && mode === "signup" ? <p className="mt-4 text-xs leading-relaxed text-aid-muted">Doctor accounts require clinic membership before patient records become visible.</p> : null}
        {counterpart ? <a className="mt-6 block text-center text-sm font-bold text-aid-teal hover:underline" href={counterpart.href}>{counterpart.label}</a> : null}
      </section>
    </main>
  );
}

function Field({ label, hint, ...props }) {
  return <label className="block text-sm font-bold text-aid-ink">{label}<input required {...props} className="mt-1.5 w-full rounded-xl border border-white/70 bg-white/55 px-3 py-3 font-normal outline-none transition focus:border-aid-teal focus:ring-2 focus:ring-aid-teal/20" />{hint ? <span className="mt-1 block text-xs font-normal text-aid-muted">{hint}</span> : null}</label>;
}
