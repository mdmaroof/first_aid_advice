"use client";

import { useEffect, useState } from "react";
import { Title, SearchInput, QuickOptions } from "@/components/homePage";
import { EmergencyCTA, MedicalDisclaimer } from "@/components/SafetyBanner";
import { OfflineBanner } from "@/components/InlineStatus";
import { useStepTracker } from "@/hooks/steps";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer, staggerItem } from "@/hooks/motion";

function Home() {
  const { step, setStep } = useStepTracker();
  const [error, setError] = useState(null);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const sync = () => setOffline(!navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  return (
    <main className="page-blobs relative flex min-h-dvh w-full flex-col items-center justify-center overflow-y-auto text-aid-ink">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.45),transparent_40%)]" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="safe-content relative z-10 flex w-full max-w-2xl flex-col items-center py-6"
      >
        <motion.div variants={staggerItem} className="mb-6">
          <EmergencyCTA />
        </motion.div>

        <Title />

        <motion.p
          variants={fadeUp}
          custom={2}
          initial="hidden"
          animate="show"
          className="mt-5 max-w-md text-center text-base text-aid-ink/75 md:text-lg"
        >
          Type symptoms. Get clear steps you can act on now.
        </motion.p>

        {offline ? <OfflineBanner className="mt-5" /> : null}

        <QuickOptions step={step} setStep={setStep} setError={setError} />
        <SearchInput
          step={step}
          setStep={setStep}
          error={error}
          setError={setError}
        />

        <motion.div
          variants={fadeUp}
          custom={8}
          initial="hidden"
          animate="show"
          className="mt-10 text-center"
        >
          <MedicalDisclaimer boxed />
        </motion.div>
      </motion.div>
    </main>
  );
}

export default Home;
