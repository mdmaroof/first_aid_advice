"use client";

import { Title } from "@/components/homePage";
import { EmergencyCTA, MedicalDisclaimer } from "@/components/SafetyBanner";
import { useResults } from "@/context/ResultsContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
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
              className="glass-soft rounded-2xl px-3 py-2 text-xs font-semibold text-aid-ink hover:bg-white/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aid-teal md:text-sm"
            >
              New search
            </motion.button>
          </div>
        </motion.header>

        <motion.section
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="glass-strong relative overflow-hidden rounded-[1.5rem] px-5 py-5 md:px-6 md:py-6"
        >
          <div
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-1 bg-aid-teal/70"
          />
          <div className="flex flex-wrap items-start justify-between gap-3 pl-2">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-aid-teal">
                Possible match
              </p>
              <h1 className="mt-1 font-quicksand text-2xl font-bold tracking-tight text-aid-ink md:text-[1.85rem] md:leading-tight">
                {first_instance?.disease || "Urgent concern"}
              </h1>
            </div>
            {first_instance?.accuracy ? (
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15, duration: 0.3 }}
                className="glass-soft shrink-0 rounded-xl px-3 py-1.5 text-sm font-bold text-aid-teal"
              >
                {first_instance.accuracy}
              </motion.span>
            ) : null}
          </div>
          {medical_advice ? (
            <p className="mt-4 max-w-prose pl-2 text-sm leading-relaxed text-aid-ink/80 md:text-[0.95rem] md:leading-7">
              {medical_advice}
            </p>
          ) : null}
        </motion.section>

        {instant_help?.length > 0 ? (
          <section aria-labelledby="help-heading" className="mt-6">
            <motion.div
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mb-3 flex items-end justify-between gap-3 px-1"
            >
              <h2
                id="help-heading"
                className="font-quicksand text-lg font-bold text-aid-ink"
              >
                What to do
              </h2>
              <span className="text-xs font-medium text-aid-muted">
                {instant_help.length} steps
              </span>
            </motion.div>
            <motion.ol
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="flex flex-col gap-2.5"
            >
              {instant_help.map((item, index) => (
                <motion.li
                  key={`${item.step}-${index}`}
                  variants={staggerItem}
                >
                  <motion.article
                    whileHover={{
                      y: -2,
                      backgroundColor: "rgba(255,255,255,0.62)",
                    }}
                    transition={scaleTap.transition}
                    className="glass-strong flex gap-3.5 rounded-[1.25rem] px-4 py-3.5 md:px-5 md:py-4"
                  >
                    <span className="glass-soft flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-quicksand text-xs font-bold text-aid-teal">
                      {String(item.step).padStart(2, "0")}
                    </span>
                    <p className="pt-1 text-sm leading-relaxed text-aid-ink md:text-base md:leading-7">
                      {item.info}
                    </p>
                  </motion.article>
                </motion.li>
              ))}
            </motion.ol>
          </section>
        ) : null}

        {symptoms_option?.length > 0 ? (
          <section aria-labelledby="symptoms-heading" className="mt-6">
            <motion.div
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mb-3 flex items-end justify-between gap-3 px-1"
            >
              <h2
                id="symptoms-heading"
                className="font-quicksand text-lg font-bold text-aid-ink"
              >
                Also look for
              </h2>
              <span className="text-xs font-medium text-aid-muted">
                Related signs
              </span>
            </motion.div>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="grid gap-2.5 sm:grid-cols-2"
            >
              {symptoms_option.map((item, index) => (
                <motion.article
                  key={`${item.symptom}-${index}`}
                  variants={staggerItem}
                  whileHover={{
                    y: -2,
                    backgroundColor: "rgba(255,255,255,0.62)",
                  }}
                  transition={scaleTap.transition}
                  className="glass-strong rounded-[1.25rem] px-4 py-3.5 md:px-5"
                >
                  <h3 className="font-semibold text-aid-ink">{item.symptom}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-aid-muted">
                    {item.description}
                  </p>
                </motion.article>
              ))}
            </motion.div>
          </section>
        ) : null}

        <motion.footer
          custom={8}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="glass mt-6 flex flex-col gap-4 rounded-[1.5rem] px-5 py-4 md:flex-row md:items-center md:justify-between md:gap-6 md:px-6"
        >
          <MedicalDisclaimer className="text-xs md:text-sm" />
          <motion.button
            type="button"
            whileHover={scaleTap.whileHover}
            whileTap={scaleTap.whileTap}
            transition={scaleTap.transition}
            onClick={handleNewSearch}
            className="w-fit shrink-0 rounded-2xl bg-aid-ink px-4 py-2.5 text-sm font-bold text-white hover:bg-aid-ink/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aid-ink"
          >
            Search new symptoms
          </motion.button>
        </motion.footer>
      </div>
    </main>
  );
};

export default SearchPage;
