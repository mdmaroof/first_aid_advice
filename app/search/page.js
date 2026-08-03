"use client";

import { Title } from "@/components/homePage";
import { FirstAidSteps } from "@/components/search/FirstAidSteps";
import { EmergencyCTA, MedicalDisclaimer } from "@/components/SafetyBanner";
import { useResults } from "@/context/ResultsContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  CheckCircle2,
  Eye,
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

  useEffect(() => {
    if (!result) {
      router.replace("/");
    }
  }, [result, router]);

  if (!result) {
    return (
      <main className="page-blobs flex min-h-dvh items-center justify-center text-aid-muted">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="safe-content relative z-10 text-lg"
        >
          Loading guidance…
        </motion.p>
      </main>
    );
  }

  const { first_instance, instant_help, medical_advice, symptoms_option } =
    result;

  const symptomsLastSpansFull =
    (symptoms_option?.length ?? 0) % 2 !== 0;

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
            {/* <motion.button
              type="button"
              whileHover={scaleTap.whileHover}
              whileTap={scaleTap.whileTap}
              transition={scaleTap.transition}
              onClick={handleNewSearch}
              className="glass-soft inline-flex items-center gap-1.5 rounded-2xl px-3 py-2 text-xs font-semibold text-aid-ink hover:bg-white/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aid-teal md:text-sm"
            >
              <Search className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden="true" />
              New search
            </motion.button> */}
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
                <Activity className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
                Possible match
              </p>
              <h1 className="mt-1 font-quicksand text-xl font-bold tracking-tight text-aid-ink md:text-2xl">
                {first_instance?.disease || "Urgent concern"}
              </h1>
            </div>
            {first_instance?.accuracy ? (
              <span className="glass-soft inline-flex shrink-0 items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-bold text-aid-teal md:text-sm">
                <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
                {first_instance.accuracy}
              </span>
            ) : null}
          </div>
          {medical_advice ? (
            <p className="mt-2.5 text-sm leading-relaxed text-aid-ink/85 md:leading-6">
              {medical_advice}
            </p>
          ) : null}
        </motion.section>

        <FirstAidSteps steps={instant_help} />

        {symptoms_option?.length > 0 ? (
          <motion.section
            aria-labelledby="symptoms-heading"
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="glass-strong mt-3 rounded-[1.5rem] p-3 md:p-4"
          >
            <h2
              id="symptoms-heading"
              className="mb-2.5 inline-flex items-center gap-2 px-1 font-quicksand text-base font-bold text-aid-ink md:text-lg"
            >
              <Eye className="h-4 w-4 text-aid-teal md:h-5 md:w-5" strokeWidth={2.25} aria-hidden="true" />
              Also look for
            </h2>

            <motion.ul
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="grid gap-2 sm:grid-cols-2"
            >
              {symptoms_option.map((item, index) => (
                <motion.li
                  key={`${item.symptom}-${index}`}
                  variants={staggerItem}
                  className={
                    symptomsLastSpansFull &&
                    index === symptoms_option.length - 1
                      ? "sm:col-span-2"
                      : ""
                  }
                >
                  <article className="glass h-full rounded-xl px-3 py-2.5">
                    <p className="text-sm font-semibold text-aid-ink">
                      {item.symptom}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-aid-muted md:text-sm">
                      {item.description}
                    </p>
                  </article>
                </motion.li>
              ))}
            </motion.ul>
          </motion.section>
        ) : null}

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
