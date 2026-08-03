"use client";

import { useState } from "react";
import { AlertTriangle, HeartHandshake } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp, staggerContainer, staggerItem } from "@/hooks/motion";

const TABS = [
  {
    id: "critical",
    label: "Critical",
    hint: "Act fast",
    Icon: AlertTriangle,
    empty: "No critical signs listed.",
  },
  {
    id: "basic",
    label: "Basic first aid",
    hint: "Less serious",
    Icon: HeartHandshake,
    empty: "No basic signs listed.",
  },
];

export function normalizeSymptoms(symptomsOption) {
  if (!symptomsOption) {
    return { critical: [], basic: [] };
  }

  if (Array.isArray(symptomsOption)) {
    return { critical: symptomsOption, basic: [] };
  }

  return {
    critical: symptomsOption.critical ?? [],
    basic: symptomsOption.basic ?? symptomsOption.not_serious ?? [],
  };
}

export function SymptomsTabs({ symptomsOption }) {
  const symptoms = normalizeSymptoms(symptomsOption);
  const hasAny = symptoms.critical.length > 0 || symptoms.basic.length > 0;
  const defaultTab =
    symptoms.critical.length > 0 ? "critical" : "basic";
  const [active, setActive] = useState(defaultTab);

  if (!hasAny) return null;

  const items = symptoms[active] ?? [];
  const lastSpansFull = items.length % 2 !== 0;
  const activeTab = TABS.find((tab) => tab.id === active) ?? TABS[0];

  return (
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
        className="mb-2.5 px-1 font-quicksand text-base font-bold text-aid-ink md:text-lg"
      >
        Watch for
      </h2>

      <div
        role="tablist"
        aria-label="Symptom severity"
        className="glass-soft mb-3 grid grid-cols-2 gap-1 rounded-2xl p-1"
      >
        {TABS.map(({ id, label, hint, Icon }) => {
          const isActive = active === id;
          const count = symptoms[id]?.length ?? 0;
          const isCritical = id === "critical";

          return (
            <button
              key={id}
              type="button"
              role="tab"
              id={`tab-${id}`}
              aria-selected={isActive}
              aria-controls={`panel-${id}`}
              disabled={count === 0}
              onClick={() => setActive(id)}
              className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40 ${
                isActive
                  ? isCritical
                    ? "bg-aid-emergency/90 text-white focus-visible:outline-aid-emergency"
                    : "bg-aid-teal text-white focus-visible:outline-aid-teal"
                  : "text-aid-ink/80 hover:bg-white/40 focus-visible:outline-aid-teal"
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} aria-hidden="true" />
              <span className="leading-tight">
                {label}
                <span className="mt-0.5 block text-[10px] font-semibold opacity-80 md:hidden">
                  {hint}
                </span>
              </span>
              <span className="hidden text-[10px] font-semibold opacity-80 sm:inline">
                · {hint}
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          role="tabpanel"
          id={`panel-${active}`}
          aria-labelledby={`tab-${active}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
        >
          {items.length === 0 ? (
            <p className="px-1 py-3 text-sm text-aid-muted">{activeTab.empty}</p>
          ) : (
            <motion.ul
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="grid gap-2 sm:grid-cols-2"
            >
              {items.map((item, index) => (
                <motion.li
                  key={`${item.symptom}-${index}`}
                  variants={staggerItem}
                  className={
                    lastSpansFull && index === items.length - 1
                      ? "sm:col-span-2"
                      : ""
                  }
                >
                  <article
                    className={`glass h-full rounded-xl px-3 py-2.5 ${
                      active === "critical"
                        ? "border-aid-emergency/25"
                        : "border-aid-teal/20"
                    }`}
                  >
                    <p
                      className={`text-sm font-bold ${
                        active === "critical"
                          ? "text-aid-emergency"
                          : "text-aid-ink"
                      }`}
                    >
                      {item.symptom}
                    </p>
                    {item.description ? (
                      <p className="mt-1 text-xs font-medium leading-snug text-aid-muted md:text-sm">
                        {item.description}
                      </p>
                    ) : null}
                  </article>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.section>
  );
}
