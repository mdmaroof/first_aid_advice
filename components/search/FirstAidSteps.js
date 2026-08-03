"use client";

import { ListChecks } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer, staggerItem } from "@/hooks/motion";

export function FirstAidSteps({ steps }) {
  if (!steps?.length) return null;

  const lastSpansFull = steps.length % 2 !== 0;

  return (
    <motion.section
      aria-labelledby="help-heading"
      custom={1}
      variants={fadeUp}
      initial="hidden"
      animate="show"
      className="glass-strong mt-3 rounded-[1.5rem] p-3 md:p-4"
    >
      <h2
        id="help-heading"
        className="mb-2.5 inline-flex items-center gap-2 px-1 font-quicksand text-base font-bold text-aid-ink md:text-lg"
      >
        <ListChecks
          className="h-4 w-4 text-aid-teal md:h-5 md:w-5"
          strokeWidth={2.25}
          aria-hidden="true"
        />
        First aid steps
      </h2>

      <motion.ol
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid gap-2 sm:grid-cols-2"
      >
        {steps.map((item, index) => (
          <motion.li
            key={`${item.step}-${index}`}
            variants={staggerItem}
            className={
              lastSpansFull && index === steps.length - 1 ? "sm:col-span-2" : ""
            }
          >
            <article className="glass flex h-full gap-3 rounded-xl px-3 py-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-aid-teal/10 font-quicksand text-sm font-bold text-aid-teal">
                {item.step}
              </span>
              <p className="text-sm font-medium leading-snug text-aid-ink md:text-[0.95rem]">
                {item.info}
              </p>
            </article>
          </motion.li>
        ))}
      </motion.ol>
    </motion.section>
  );
}
