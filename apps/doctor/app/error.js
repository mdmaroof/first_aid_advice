"use client";

import { useEffect } from "react";

export default function DoctorError({ error, reset }) {
  useEffect(() => { console.error("Doctor app route error", error); }, [error]);
  return <main className="flex min-h-dvh items-center justify-center bg-[#d9ecee] px-4 text-aid-ink"><section className="glass-strong w-full max-w-lg rounded-[2rem] p-7 text-center"><p className="text-sm font-bold uppercase tracking-[.16em] text-aid-teal">Doctor EMR</p><h1 className="mt-3 font-quicksand text-3xl font-bold">This workspace could not load</h1><p className="mt-3 text-aid-muted">Try again. If the problem continues, give support the reference shown in the failed request or server log.</p>{error?.digest?<p className="mt-3 font-mono text-xs text-aid-muted">Reference: {error.digest}</p>:null}<button onClick={reset} className="mt-6 rounded-xl bg-aid-teal px-5 py-3 font-bold text-white">Try again</button></section></main>;
}
