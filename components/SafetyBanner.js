"use client";

import { Phone, Info } from "lucide-react";
import { useEmergency } from "@/context/EmergencyContext";

export function EmergencyCTA({ className = "", compact = false }) {
  const { number, label, loading } = useEmergency();
  const display = loading ? "…" : label;

  return (
    <a
      href={`tel:${number}`}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl bg-aid-emergency/90 font-bold text-white backdrop-blur-md transition-colors hover:bg-aid-emergency focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aid-emergency ${
        compact ? "px-3 py-2 text-xs" : "px-4 py-2.5 text-sm"
      } ${className}`}
      aria-label={
        loading
          ? "Call local emergency services"
          : `Call emergency services at ${label}`
      }
    >
      <Phone
        className={compact ? "h-3.5 w-3.5" : "h-4 w-4"}
        strokeWidth={2.5}
        aria-hidden="true"
      />
      {loading ? "Emergency" : `Call ${display}`}
    </a>
  );
}

export function MedicalDisclaimer({ className = "" }) {
  return (
    <p
      role="note"
      className={`flex gap-2 items-start text-sm leading-relaxed text-aid-muted ${className}`}
    >
      <Info
        className="shrink-0 text-aid-teal"
        strokeWidth={2.25}
        aria-hidden="true"
      />
      <span className="text-justify">
        SnapAid provides general first-aid guidance only. It is not a diagnosis
        or a substitute for professional medical care. If someone is in danger,
        call emergency services immediately.
      </span>
    </p>
  );
}
