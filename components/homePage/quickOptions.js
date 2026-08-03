"use client";

import { callApi } from "@/hooks/callApi";
import { useResults } from "@/context/ResultsContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  HeartPulse,
  Wind,
  Droplets,
  Flame,
  CircleAlert,
  Brain,
  Dog,
  Snail,
} from "lucide-react";
import { scaleTap, staggerContainer, staggerItem } from "@/hooks/motion";

const QUICK_OPTIONS = [
  { label: "Heart pain", Icon: HeartPulse },
  { label: "Breathing trouble", Icon: Wind },
  { label: "Bleeding", Icon: Droplets },
  { label: "Burn", Icon: Flame },
  { label: "Choking", Icon: CircleAlert },
  { label: "Headache", Icon: Brain },
  { label: "Dog bite", Icon: Dog },
  { label: "Snake bite", Icon: Snail },
];

export const QuickOptions = ({ step, setStep }) => {
  const router = useRouter();
  const { setResult } = useResults();
  const isSearching = step === "step3";

  const callData = async (data) => {
    if (isSearching) return;

    setStep("step3");
    const res = await callApi(data);

    if (res.error) {
      setStep("step1");
      return;
    }

    setResult(res.data);
    router.push("/search");
  };

  return (
    <motion.div
      role="group"
      aria-label="Common symptoms"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="mt-8 flex w-full max-w-2xl flex-wrap justify-center gap-2.5 md:mt-9"
    >
      {QUICK_OPTIONS.map(({ label, Icon }) => (
        <motion.button
          key={label}
          type="button"
          variants={staggerItem}
          whileHover={isSearching ? undefined : scaleTap.whileHover}
          whileTap={isSearching ? undefined : scaleTap.whileTap}
          transition={scaleTap.transition}
          onClick={() => callData(label)}
          disabled={isSearching}
          className="glass-strong inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold text-aid-ink hover:bg-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aid-teal disabled:cursor-not-allowed disabled:opacity-50 md:px-5 md:text-base"
        >
          <Icon
            className="h-4 w-4 shrink-0 text-aid-teal"
            strokeWidth={2.25}
            aria-hidden="true"
          />
          {label}
        </motion.button>
      ))}
    </motion.div>
  );
};
