"use client";

import { useEffect, useId, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Pill,
  Droplet,
  Eye,
  Wind,
  Leaf,
  HelpCircle,
  FlaskConical,
  Flame,
  Zap,
  Sun,
  Dog,
  Worm,
  Bug,
  Utensils,
  Syringe,
  X,
} from "lucide-react";
import { EmergencyCTA, PoisonHotlineCTA } from "@/components/SafetyBanner";
import { easeOut, scaleTap, staggerContainer, staggerItem } from "@/hooks/motion";

const ICONS = {
  Pill,
  Droplet,
  Eye,
  Wind,
  Leaf,
  HelpCircle,
  FlaskConical,
  Flame,
  Zap,
  Sun,
  Dog,
  Worm,
  Bug,
  Utensils,
  Syringe,
};

/**
 * Shared subtype picker for Poison / Burn / Bite / Allergy.
 * Only used when a quick option has real subtypes.
 */
export function QuickTypePicker({
  open,
  group,
  onClose,
  onSelect,
  busy = false,
}) {
  const titleId = useId();
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open || !group) return undefined;

    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, group, onClose]);

  if (!group) return null;

  const accentEmergency = group.accent === "emergency";

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-aid-ink/45 backdrop-blur-sm"
            aria-label={`Close ${group.eyebrow}`}
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.28, ease: easeOut }}
            className="relative z-10 max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-t-[1.75rem] border border-white/60 bg-[#d5e8eb] p-4 shadow-2xl sm:rounded-[1.75rem] sm:p-5"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                    accentEmergency ? "text-aid-emergency" : "text-aid-teal"
                  }`}
                >
                  {group.eyebrow}
                </p>
                <h2
                  id={titleId}
                  className="mt-1 font-quicksand text-xl font-bold tracking-tight text-aid-ink"
                >
                  {group.title}
                </h2>
                <p className="mt-1 text-sm text-aid-muted">{group.subtitle}</p>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="glass-soft rounded-xl p-2 text-aid-ink hover:bg-white/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aid-teal"
                aria-label="Close"
              >
                <X className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
              </button>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              <EmergencyCTA compact />
              {group.showPoisonHotline ? <PoisonHotlineCTA compact /> : null}
            </div>

            <motion.div
              role="list"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="grid gap-2 sm:grid-cols-2"
            >
              {group.types.map(({ id, key, label, hint, icon }) => {
                const Icon = ICONS[icon] || HelpCircle;
                return (
                  <motion.button
                    key={id}
                    type="button"
                    role="listitem"
                    variants={staggerItem}
                    whileHover={busy ? undefined : scaleTap.whileHover}
                    whileTap={busy ? undefined : scaleTap.whileTap}
                    transition={scaleTap.transition}
                    disabled={busy}
                    onClick={() => onSelect(key)}
                    className="glass-strong flex items-start gap-3 rounded-2xl px-3.5 py-3 text-left hover:bg-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aid-teal disabled:cursor-wait disabled:opacity-60"
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                        accentEmergency
                          ? "bg-aid-emergency/10 text-aid-emergency"
                          : "bg-aid-teal/10 text-aid-teal"
                      }`}
                    >
                      <Icon
                        className="h-4 w-4"
                        strokeWidth={2.25}
                        aria-hidden="true"
                      />
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-aid-ink">
                        {label}
                      </span>
                      <span className="mt-0.5 block text-xs font-medium text-aid-muted">
                        {hint}
                      </span>
                    </span>
                  </motion.button>
                );
              })}
            </motion.div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
