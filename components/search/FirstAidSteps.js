"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/hooks/motion";

export function FirstAidSteps({ steps }) {
  if (!steps?.length) return null;

  return (
    <motion.section
      aria-labelledby="help-heading"
      custom={1}
      variants={fadeUp}
      initial="hidden"
      animate="show"
      className="glass-strong mt-3 rounded-[1.5rem] px-4 py-4 md:px-5"
    >
      <h2
        id="help-heading"
        className="mb-3 font-quicksand text-base font-bold text-aid-ink md:text-lg"
      >
        First aid steps
      </h2>

      <ol className="flex flex-col gap-2.5">
        {steps.map((item, index) => (
          <li key={`${item.step}-${index}`}>
            <article className="glass-strong relative overflow-hidden rounded-xl px-3 pb-3 pt-5">
              <span className="absolute -top-2 left-3 z-10 rounded-lg bg-aid-teal px-2.5 py-0.5 font-quicksand text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                Step {item.step}
              </span>
              <span className="absolute right-0 top-0 rounded-bl-xl bg-aid-ink/90 px-2.5 py-1 font-quicksand text-xs font-bold text-white">
                {String(item.step).padStart(2, "0")}
              </span>
              <p className="pr-8 text-sm leading-relaxed text-aid-ink md:leading-6">
                {item.info}
              </p>
            </article>
          </li>
        ))}
      </ol>
    </motion.section>
  );
}
