"use client";

import { Phone, Info, FlaskConical } from "lucide-react";
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

export function PoisonHotlineCTA({ className = "", compact = false }) {
  const { poison, loading } = useEmergency();

  if (loading || !poison?.number) return null;

  return (
    <a
      href={`tel:${poison.number}`}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl border border-aid-emergency/30 bg-white/55 font-bold text-aid-emergency backdrop-blur-md transition-colors hover:bg-white/75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aid-emergency ${
        compact ? "px-3 py-2 text-xs" : "px-4 py-2.5 text-sm"
      } ${className}`}
      aria-label={`Call poison control at ${poison.label}`}
    >
      <FlaskConical
        className={compact ? "h-3.5 w-3.5" : "h-4 w-4"}
        strokeWidth={2.5}
        aria-hidden="true"
      />
      {compact ? `Poison ${poison.label}` : `Poison control ${poison.label}`}
    </a>
  );
}

export function EmergencyActions({
  className = "",
  compact = false,
  showPoison = false,
}) {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <EmergencyCTA compact={compact} />
      {showPoison ? <PoisonHotlineCTA compact={compact} /> : null}
    </div>
  );
}

export function MedicalDisclaimer({ className = "", boxed = false }) {
  return (
    <p
      role="note"
      className={`inline-flex max-w-md items-start text-left leading-relaxed ${
        boxed
          ? "glass-strong gap-2.5 rounded-2xl px-4 py-3 text-sm font-semibold"
          : "gap-1.5 text-sm text-aid-muted"
      } ${className}`}
    >
      <Info
        className={`mt-0.5 shrink-0 text-aid-teal ${
          boxed ? "h-5 w-5" : "h-4 w-4"
        }`}
        strokeWidth={boxed ? 2.5 : 2.25}
        aria-hidden="true"
      />
      <span className={boxed ? "text-aid-teal" : undefined}>
        General first-aid only — not a diagnosis.{" "}
        {boxed ? (
          <span className="text-aid-emergency">
            In danger? Call emergency services now.
          </span>
        ) : (
          "In danger? Call emergency services now."
        )}
      </span>
    </p>
  );
}
