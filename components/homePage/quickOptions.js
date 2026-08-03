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
  FlaskConical,
  ShieldAlert,
  Bone,
} from "lucide-react";
import { scaleTap, staggerContainer, staggerItem } from "@/hooks/motion";
import { QuickTypePicker } from "@/components/homePage/QuickTypePicker";
import { QUICK_TYPE_GROUPS } from "@/data/quickTypeGroups";

/**
 * Direct options = no subtypes.
 * `typeGroup` = opens a picker only when subtypes exist in QUICK_TYPE_GROUPS.
 */
const QUICK_OPTIONS = [
  { label: "Heart pain", Icon: HeartPulse },
  { label: "Breathing trouble", Icon: Wind },
  { label: "Bleeding", Icon: Droplets },
  { label: "Burn", Icon: Flame, typeGroup: "burn" },
  { label: "Choking", Icon: CircleAlert },
  { label: "Poison", Icon: FlaskConical, typeGroup: "poison" },
  { label: "Bite", Icon: Bone, typeGroup: "bite" },
  { label: "Allergy", Icon: ShieldAlert, typeGroup: "allergy" },
  { label: "Headache", Icon: Brain },
];

export const QuickOptions = ({ step, setStep, setError }) => {
  const router = useRouter();
  const { setResult } = useResults();
  const isSearching = step === "step3";
  const [activeGroupId, setActiveGroupId] = useState(null);

  const activeGroup = activeGroupId
    ? QUICK_TYPE_GROUPS[activeGroupId] ?? null
    : null;

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

    if (option.typeGroup && QUICK_TYPE_GROUPS[option.typeGroup]) {
      setError?.(null);
      setActiveGroupId(option.typeGroup);
      return;
    }

    callData(option.label);
  };

  const onTypeSelect = async (key) => {
    setActiveGroupId(null);
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
          const { label, Icon, typeGroup } = option;
          const hasTypes = Boolean(typeGroup && QUICK_TYPE_GROUPS[typeGroup]);
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
                  hasTypes ? "text-aid-emergency" : "text-aid-teal"
                }`}
                strokeWidth={2.25}
                aria-hidden="true"
              />
              {label}
            </motion.button>
          );
        })}
      </motion.div>

      <QuickTypePicker
        open={Boolean(activeGroup)}
        group={activeGroup}
        onClose={() => setActiveGroupId(null)}
        onSelect={onTypeSelect}
        busy={isSearching}
      />
    </>
  );
};
