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
    <main className="page-blobs relative flex min-h-dvh w-full flex-col items-center justify-center overflow-y-auto bg-aid-page px-4 py-10 text-aid-ink">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.45),transparent_40%)]" />

      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center">
        <div className="mb-6">
          <EmergencyCTA />
        </div>

        <Title />

        <p className="mt-5 max-w-md text-center text-base text-aid-ink/75 md:text-lg">
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
