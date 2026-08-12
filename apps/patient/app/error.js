"use client";

import Link from "next/link";
import { EmergencyCTA, MedicalDisclaimer } from "@/components/SafetyBanner";
import { Title } from "@/components/homePage";

export default function Error({ reset }) {
  return (
    <main className="page-blobs relative flex min-h-dvh w-full flex-col items-center justify-center text-aid-ink">
      <div className="safe-content relative z-10 flex max-w-lg flex-col items-center gap-5 py-10 text-center">
        <Title />
        <h1 className="font-quicksand text-2xl font-bold tracking-tight">
          Guidance unavailable
        </h1>
        <p className="text-aid-ink/75">
          We couldn’t load that screen. If someone is in danger, call emergency
          services now.
        </p>
        <EmergencyCTA />
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-2xl bg-aid-ink px-5 py-2.5 text-sm font-bold text-white hover:bg-aid-ink/90"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-2xl border border-white/60 bg-white/40 px-5 py-2.5 text-sm font-bold text-aid-ink backdrop-blur-xl"
          >
            Go home
          </Link>
        </div>
        <MedicalDisclaimer className="text-left" />
      </div>
    </main>
  );
}
