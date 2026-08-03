"use client";

import { Title } from "@/components/homePage";
import { EmergencyCTA, MedicalDisclaimer } from "@/components/SafetyBanner";
import { useResults } from "@/context/ResultsContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  CheckCircle2,
  Eye,
  ListChecks,
  Search,
} from "lucide-react";
import {
  fadeUp,
  scaleTap,
  staggerContainer,
  staggerItem,
} from "@/hooks/motion";

const SearchPage = () => {
  const { result, clearResult } = useResults();
  const router = useRouter();
  const [activeSymptom, setActiveSymptom] = useState(0);

  useEffect(() => {
    if (!result) {
      router.replace("/");
    }
  }, [result, router]);

  if (!result) {
    return (
      <main className="page-blobs flex min-h-dvh items-center justify-center bg-aid-page text-aid-muted">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative z-10 text-lg"
        >
          Loading guidance…
        </motion.p>
      </main>
    );
  }

  const { first_instance, instant_help, medical_advice, symptoms_option } =
    result;

  const handleNewSearch = () => {
    clearResult();
    router.push("/");
  };

  const selectedSymptom = symptoms_option?.[activeSymptom];

  return (
    <main className="page-blobs relative min-h-dvh w-full bg-aid-page text-aid-ink">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.45),transparent_35%)]" />

      <div className="relative z-10 mx-auto max-w-3xl px-4 py-4 pb-8 md:px-6 md:py-6 md:pb-10">
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="glass sticky top-3 z-20 mb-5 flex items-center justify-between gap-3 rounded-2xl px-4 py-3 md:mb-6 md:px-5"
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
            <motion.button
              type="button"
              whileHover={scaleTap.whileHover}
              whileTap={scaleTap.whileTap}
              transition={scaleTap.transition}
              onClick={handleNewSearch}
              className="glass-soft inline-flex items-center gap-1.5 rounded-2xl px-3 py-2 text-xs font-semibold text-aid-ink hover:bg-white/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aid-teal md:text-sm"
            >
              <Search className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden="true" />
              New search
            </motion.button>
          </div>
        </motion.header>

        <motion.section
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="glass-strong relative overflow-hidden rounded-[1.5rem] px-5 py-5 md:px-6 md:py-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-aid-teal">
                <Activity className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
                Possible match
              </p>
              <h1 className="mt-1.5 font-quicksand text-2xl font-bold tracking-tight text-aid-ink md:text-3xl md:leading-tight">
                {first_instance?.disease || "Urgent concern"}
              </h1>
            </div>
            {first_instance?.accuracy ? (
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15, duration: 0.3 }}
                className="glass-soft inline-flex shrink-0 items-center gap-1.5 rounded-2xl px-3 py-1.5 text-sm font-bold text-aid-teal"
              >
                <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
                {first_instance.accuracy}
              </motion.span>
            ) : null}
          </div>
          {medical_advice ? (
            <p className="mt-3 max-w-prose text-sm leading-relaxed text-aid-ink/80 md:text-[0.95rem] md:leading-7">
              {medical_advice}
            </p>
          ) : null}
        </motion.section>

        {instant_help?.length > 0 ? (
          <motion.section
            aria-labelledby="help-heading"
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="glass-strong mt-4 overflow-hidden rounded-[1.5rem] p-3 md:mt-5 md:p-4"
          >
            <div className="mb-3 flex items-center justify-between gap-3 px-1">
              <h2
                id="help-heading"
                className="inline-flex items-center gap-2 font-quicksand text-lg font-bold text-aid-ink"
              >
                <ListChecks className="h-5 w-5 text-aid-teal" strokeWidth={2.25} aria-hidden="true" />
                What to do
              </h2>
              <span className="text-xs font-medium text-aid-muted">
                {instant_help.length} steps
              </span>
            </div>

            <motion.ol
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="flex flex-col gap-2"
            >
              {instant_help.map((item, index) => (
                <motion.li key={`${item.step}-${index}`} variants={staggerItem}>
                  <article className="glass flex gap-3 rounded-[1.15rem] px-3.5 py-3 md:px-4 md:py-3.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-aid-teal/10 font-quicksand text-xs font-bold text-aid-teal">
                      {String(item.step).padStart(2, "0")}
                    </span>
                    <p className="pt-0.5 text-sm leading-relaxed text-aid-ink md:text-[0.95rem] md:leading-6">
                      {item.info}
                    </p>
                  </article>
                </motion.li>
              ))}
            </motion.ol>
          </motion.section>
        ) : null}

        {symptoms_option?.length > 0 ? (
          <motion.section
            aria-labelledby="symptoms-heading"
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-4 md:mt-5"
          >
            <div className="mb-3 flex items-center justify-between gap-3 px-1">
              <h2
                id="symptoms-heading"
                className="inline-flex items-center gap-2 font-quicksand text-lg font-bold text-aid-ink"
              >
                <Eye className="h-5 w-5 text-aid-teal" strokeWidth={2.25} aria-hidden="true" />
                Also look for
              </h2>
              <span className="text-xs font-medium text-aid-muted">
                Tap a sign
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {symptoms_option.map((item, index) => {
                const selected = activeSymptom === index;
                return (
                  <motion.button
                    key={`${item.symptom}-${index}`}
                    type="button"
                    whileHover={scaleTap.whileHover}
                    whileTap={scaleTap.whileTap}
                    transition={scaleTap.transition}
                    onClick={() => setActiveSymptom(index)}
                    aria-pressed={selected}
                    className={`inline-flex items-center rounded-2xl px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aid-teal ${
                      selected
                        ? "bg-aid-ink text-white"
                        : "glass-strong text-aid-ink hover:bg-white/60"
                    }`}
                  >
                    {item.symptom}
                  </motion.button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              {selectedSymptom ? (
                <motion.div
                  key={selectedSymptom.symptom}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22 }}
                  className="glass-strong mt-3 rounded-[1.25rem] px-4 py-4 md:px-5"
                >
                  <p className="font-semibold text-aid-ink">
                    {selectedSymptom.symptom}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-aid-muted md:text-[0.95rem]">
                    {selectedSymptom.description}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.section>
        ) : null}

        <motion.footer
          custom={8}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="glass mt-5 flex flex-col gap-4 rounded-[1.5rem] px-5 py-4 md:mt-6 md:flex-row md:items-center md:justify-between md:gap-6 md:px-6"
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
