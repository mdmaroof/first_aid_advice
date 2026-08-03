"use client";

import { Title, SearchInput, QuickOptions } from "@/components/homePage";
import { EmergencyCTA, MedicalDisclaimer } from "@/components/SafetyBanner";
import { useStepTracker } from "@/hooks/steps";
import { useResults } from "@/context/ResultsContext";
import { useEffect } from "react";

function Home() {
  const { step, setStep } = useStepTracker();
  const { clearResult } = useResults();

  useEffect(() => {
    clearResult();
  }, [clearResult]);

  return (
    <main className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-y-auto bg-aid-gradient px-4 py-10 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_45%)]" />

      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center">
        <div className="mb-6">
          <EmergencyCTA />
        </div>

        <Title />

        <p className="mt-5 max-w-md text-center text-base text-white/90 md:text-lg">
          Describe symptoms and get clear first-aid steps you can act on now.
        </p>

        <QuickOptions step={step} setStep={setStep} />
        <SearchInput step={step} setStep={setStep} />

        <div className="mt-10">
          <MedicalDisclaimer />
        </div>
      </div>
    </main>
  );
}

export default Home;
