"use client";

import { motion } from "framer-motion";
import { Cross } from "lucide-react";
import { fadeUp, scaleTap } from "@/hooks/motion";

export const Title = ({
  size = "w-[150px] h-[150px] md:w-[190px] md:h-[190px]",
  textSize = "text-2xl md:text-4xl",
  compact = false,
}) => {
  if (compact) {
    return (
      <span
        className="inline-flex items-center gap-2 font-quicksand text-xl font-bold tracking-tight text-aid-ink"
        aria-label="SnapAid"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-aid-teal/10 text-aid-teal">
          <Cross className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
        </span>
        SnapAid
      </span>
    );
  }

  return (
    <motion.div
      variants={fadeUp}
      custom={1}
      initial="hidden"
      animate="show"
      whileHover={scaleTap.whileHover}
      transition={scaleTap.transition}
      className={`glass-strong relative flex flex-col items-center justify-center gap-2 overflow-hidden rounded-[2rem] ${size}`}
      aria-label="SnapAid"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-aid-teal/10 text-aid-teal md:h-12 md:w-12">
        <Cross className="h-5 w-5 md:h-6 md:w-6" strokeWidth={2.5} aria-hidden="true" />
      </span>
      <p
        className={`relative font-quicksand font-bold tracking-tight text-aid-ink ${textSize}`}
      >
        SnapAid
      </p>
    </motion.div>
  );
};
