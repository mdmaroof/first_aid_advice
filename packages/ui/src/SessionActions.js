"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignOutButton({ redirectTo = "/signin" }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function signOut() {
    setBusy(true);
    try { await fetch("/api/auth/signout", { method: "POST" }); }
    finally { router.replace(redirectTo); router.refresh(); }
  }
  return <button type="button" onClick={signOut} disabled={busy} className="rounded-xl bg-aid-ink px-3 py-2 text-xs font-bold text-white disabled:opacity-60">{busy ? "Signing out…" : "Sign out"}</button>;
}
