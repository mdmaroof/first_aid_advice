"use client";

import { useState } from "react";
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
  Worm,
  FlaskConical,
} from "lucide-react";
import { scaleTap, staggerContainer, staggerItem } from "@/hooks/motion";
import { PoisonTypePicker } from "@/components/homePage/PoisonTypePicker";

const QUICK_OPTIONS = [
  { label: "Heart pain", Icon: HeartPulse },
  { label: "Breathing trouble", Icon: Wind },
  { label: "Bleeding", Icon: Droplets },
  { label: "Burn", Icon: Flame },
  { label: "Choking", Icon: CircleAlert },
  { label: "Poison", Icon: FlaskConical, opensPoison: true },
  { label: "Headache", Icon: Brain },
  { label: "Dog bite", Icon: Dog },
  { label: "Snake bite", Icon: Worm },
];

export const QuickOptions = ({ step, setStep, setError }) => {
  const router = useRouter();
  const { setResult } = useResults();
  const isSearching = step === "step3";
  const [poisonOpen, setPoisonOpen] = useState(false);

  const callData = async (data) => {
    if (isSearching) return;

    setError?.(null);
    setStep("step3");
    const res = await callApi(data);

    if (res.error) {
      setError?.(res.message || "Something went wrong. Please try again.");
      setStep("step1");
      return;
    }

    setResult(res.data);
    router.push("/search");
  };

  const onQuickClick = (option) => {
    if (isSearching) return;
    if (option.opensPoison) {
      setError?.(null);
      setPoisonOpen(true);
      return;
    }
    callData(option.label);
  };

  const onPoisonSelect = async (key) => {
    setPoisonOpen(false);
    await callData(key);
  };

  return (
    <>
      <motion.div
        role="group"
        aria-label="Common symptoms"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="mt-8 flex w-full max-w-2xl flex-wrap justify-center gap-2.5 md:mt-9"
      >
        {QUICK_OPTIONS.map((option) => {
          const { label, Icon } = option;
          return (
            <motion.button
              key={label}
              type="button"
              variants={staggerItem}
              whileHover={isSearching ? undefined : scaleTap.whileHover}
              whileTap={isSearching ? undefined : scaleTap.whileTap}
              transition={scaleTap.transition}
              onClick={() => onQuickClick(option)}
              disabled={isSearching}
              className="glass-strong inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold text-aid-ink hover:bg-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aid-teal disabled:cursor-not-allowed disabled:opacity-50 md:px-5 md:text-base"
            >
              <Icon
                className={`h-4 w-4 shrink-0 ${
                  option.opensPoison ? "text-aid-emergency" : "text-aid-teal"
                }`}
                strokeWidth={2.25}
                aria-hidden="true"
              />
              {label}
            </motion.button>
          );
        })}
      </motion.div>

      <PoisonTypePicker
        open={poisonOpen}
        onClose={() => setPoisonOpen(false)}
        onSelect={onPoisonSelect}
        busy={isSearching}
      />
    </>
  );
};
