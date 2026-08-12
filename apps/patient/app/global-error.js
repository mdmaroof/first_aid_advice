"use client";

import { useEffect } from "react";
import { EmergencyCTA, MedicalDisclaimer } from "@/components/SafetyBanner";
import { Title } from "@/components/homePage";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-dvh bg-[#c5e0e4] text-[#122026]">
        <main className="mx-auto flex min-h-dvh w-full max-w-lg flex-col items-center justify-center gap-5 px-4 py-10 text-center">
          <Title />
          <h1 className="font-bold text-2xl tracking-tight">
            Something went wrong
          </h1>
          <p className="text-[#4f646c]">
            SnapAid hit an unexpected error. Call emergency services if someone
            is in danger, then try again.
          </p>
          <EmergencyCTA />
          <button
            type="button"
            onClick={reset}
            className="rounded-2xl bg-[#122026] px-5 py-2.5 text-sm font-bold text-white"
          >
            Try again
          </button>
          <MedicalDisclaimer className="text-left" />
        </main>
      </body>
    </html>
  );
}
