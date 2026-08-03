import { Phone, Info } from "lucide-react";

export function EmergencyCTA({ className = "", compact = false }) {
  return (
    <a
      href="tel:911"
      className={`inline-flex items-center justify-center gap-2 rounded-2xl bg-aid-emergency/90 font-bold text-white backdrop-blur-md transition-colors hover:bg-aid-emergency focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aid-emergency ${
        compact ? "px-3 py-2 text-xs" : "px-4 py-2.5 text-sm"
      } ${className}`}
      aria-label="Call emergency services at 911"
    >
      <Phone
        className={compact ? "h-3.5 w-3.5" : "h-4 w-4"}
        strokeWidth={2.5}
        aria-hidden="true"
      />
      Call 911
    </a>
  );
}

export function MedicalDisclaimer({ className = "" }) {
  return (
    <p
      role="note"
      className={`flex max-w-2xl items-start gap-2 text-sm leading-relaxed text-aid-muted ${className}`}
    >
      <Info
        className="mt-0.5 h-4 w-4 shrink-0 text-aid-teal"
        strokeWidth={2.25}
        aria-hidden="true"
      />
      <span>
        SnapAid provides general first-aid guidance only. It is not a diagnosis
        or a substitute for professional medical care. If someone is in danger,
        call emergency services immediately.
      </span>
    </p>
  );
}
