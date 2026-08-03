"use client";

import { useEffect } from "react";
import { Title } from "@/components/homePage";
import { FirstAidSteps } from "@/components/search/FirstAidSteps";
import { SymptomsTabs } from "@/components/search/SymptomsTabs";
import { EmergencyCTA, MedicalDisclaimer } from "@/components/SafetyBanner";
import { useResults } from "@/context/ResultsContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Activity, CheckCircle2, Search } from "lucide-react";
import { fadeUp, scaleTap } from "@/hooks/motion";

const SearchPage = () => {
  const { result, clearResult, hydrated } = useResults();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !result) {
      router.replace("/");
    }
  }, [result, router, hydrated]);

  if (!hydrated || !result) {
    return (
      <main className="page-blobs flex min-h-dvh items-center justify-center text-aid-muted">
        <div className="safe-content relative z-10 flex flex-col items-center gap-3">
          <span className="loader" aria-hidden="true" />
          <p className="text-lg">Loading guidance…</p>
        </div>
      </main>
    );
  }

  const { first_instance, instant_help, medical_advice, symptoms_option } =
    result;

  const handleNewSearch = () => {
    clearResult();
    router.push("/");
  };

  return (
    <main className="page-blobs relative min-h-dvh w-full text-aid-ink">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.45),transparent_35%)]" />

      <div className="safe-content relative z-10 mx-auto max-w-3xl md:px-2 md:py-2">
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="glass sticky z-20 mb-4 flex items-center justify-between gap-3 rounded-2xl px-4 py-3 md:px-5"
          style={{ top: "max(0.75rem, var(--safe-top))" }}
        >
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNewSearch}
            className="rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aid-teal"
            aria-label="Back to SnapAid home"
          >
            <Title compact />
          </motion.button>
          <div className="flex items-center gap-2">
            <EmergencyCTA compact />
          </div>
        </motion.header>

        <motion.section
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="glass-strong rounded-[1.5rem] px-4 py-4 md:px-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-aid-teal">
                <Activity
                  className="h-3.5 w-3.5"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
                Possible match
              </p>
              <h1 className="mt-1 font-quicksand text-xl font-bold tracking-tight text-aid-ink md:text-2xl">
                {first_instance?.disease || "Urgent concern"}
              </h1>
            </div>
            {first_instance?.accuracy ? (
              <span className="glass-soft inline-flex shrink-0 items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-bold text-aid-teal md:text-sm">
                <CheckCircle2
                  className="h-3.5 w-3.5"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
                {first_instance.accuracy}
              </span>
            ) : null}
          </div>
          {medical_advice ? (
            <p className="mt-2.5 text-base font-semibold leading-snug text-aid-ink md:text-lg">
              {medical_advice}
            </p>
          ) : null}
        </motion.section>

        <FirstAidSteps steps={instant_help} />

        <SymptomsTabs symptomsOption={symptoms_option} />

        <motion.footer
          custom={8}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="glass mt-4 flex flex-col gap-3 rounded-[1.5rem] px-4 py-3 md:flex-row md:items-center md:justify-between md:px-5"
        >
          <MedicalDisclaimer className="text-xs md:text-sm" />
          <motion.button
            type="button"
            whileHover={scaleTap.whileHover}
            whileTap={scaleTap.whileTap}
            transition={scaleTap.transition}
            onClick={handleNewSearch}
            className="inline-flex w-fit shrink-0 items-center gap-2 rounded-2xl bg-aid-ink px-4 py-2.5 text-sm font-bold text-white hover:bg-aid-ink/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aid-ink"
          >
            <Search className="h-4 w-4" strokeWidth={2.25} aria-hidden="true" />
            Search new symptoms
          </motion.button>
        </motion.footer>
      </div>
    </main>
  );
};

export default SearchPage;
