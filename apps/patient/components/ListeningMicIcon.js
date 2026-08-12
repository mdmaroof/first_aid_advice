"use client";

import { Mic } from "lucide-react";
import { motion } from "framer-motion";

const BARS = [
  { h: 6, delay: 0 },
  { h: 11, delay: 0.12 },
  { h: 8, delay: 0.24 },
  { h: 13, delay: 0.08 },
  { h: 7, delay: 0.2 },
];

/** Soft pulsing mic for the listen/stop button. */
export function ListeningMicIcon({ className = "" }) {
  return (
    <motion.span
      className={`inline-flex h-4 w-4 shrink-0 items-center justify-center ${className}`}
      aria-hidden="true"
      animate={{ opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
    >
      <Mic className="h-4 w-4" strokeWidth={2.25} />
    </motion.span>
  );
}

/** Animated "Listening" label for the input placeholder area. */
export function ListeningLabel({ className = "" }) {
  return (
    <span
      className={`pointer-events-none inline-flex items-center gap-2.5 ${className}`}
      aria-hidden="true"
    >
      <span className="inline-flex h-4 items-end justify-center gap-[2px] text-aid-teal">
        {BARS.map((bar, index) => (
          <motion.span
            key={index}
            className="w-[2px] rounded-full bg-current"
            style={{ height: bar.h }}
            animate={{ scaleY: [0.4, 1, 0.5, 1, 0.4] }}
            transition={{
              duration: 0.9,
              repeat: Infinity,
              ease: "easeInOut",
              delay: bar.delay,
            }}
          />
        ))}
      </span>
      <span className="text-base font-medium text-aid-teal/80">
        Listening
        <motion.span
          className="inline-block w-4 text-left"
          animate={{ opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
        >
          …
        </motion.span>
      </span>
    </span>
  );
}
