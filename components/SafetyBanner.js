"use client";

import { Phone, Info } from "lucide-react";
import { useEmergency } from "@/context/EmergencyContext";

export function EmergencyCTA({ className = "", compact = false }) {
  const { number, label, loading } = useEmergency();
  const display = loading ? "…" : label;
  const ready = !loading && Boolean(number);

  const classNames = `inline-flex items-center justify-center gap-2 rounded-2xl bg-aid-emergency/90 font-bold text-white backdrop-blur-md transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aid-emergency ${
    compact ? "px-3 py-2 text-xs" : "px-4 py-2.5 text-sm"
  } ${ready ? "hover:bg-aid-emergency" : "cursor-wait opacity-80"} ${className}`;

  if (!ready) {
    return (
      <span
        className={classNames}
        aria-busy="true"
        aria-label="Detecting local emergency number"
      >
        <Phone
          className={compact ? "h-3.5 w-3.5" : "h-4 w-4"}
          strokeWidth={2.5}
          aria-hidden="true"
        />
        Emergency
      </span>
    );
  }

  return (
    <a
      href={`tel:${number}`}
      className={classNames}
      aria-label={`Call emergency services at ${label}`}
    >
      <Phone
        className={compact ? "h-3.5 w-3.5" : "h-4 w-4"}
        strokeWidth={2.5}
        aria-hidden="true"
      />
      {`Call ${display}`}
    </a>
  );
}

export function MedicalDisclaimer({ className = "" }) {
  return (
    <p
      role="note"
      className={`flex items-start gap-2 text-sm leading-relaxed text-aid-muted ${className}`}
    >
      <Info
        className="shrink-0 text-aid-teal"
        strokeWidth={2.25}
        aria-hidden="true"
      />
      <span>
        General first-aid only — not a diagnosis. In danger? Call emergency
        services now.
      </span>
    </p>
  );
}
