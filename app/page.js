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
    <main className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-y-auto bg-aid-page px-4 py-10 text-aid-ink">
      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center animate-fade-up">
        <div className="mb-6">
          <EmergencyCTA />
        </div>

        <Title />

        <p className="mt-5 max-w-md text-center text-base text-aid-muted md:text-lg">
          Describe symptoms and get clear first-aid steps you can act on now.
        </p>

        <QuickOptions step={step} setStep={setStep} />
        <SearchInput step={step} setStep={setStep} />

        <div className="mt-10 text-center">
          <MedicalDisclaimer className="mx-auto text-center" />
        </div>
      </div>
    </main>
  );
}

export default Home;
