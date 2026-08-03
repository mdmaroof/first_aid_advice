export function EmergencyCTA({ className = "", compact = false }) {
  return (
    <a
      href="tel:911"
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-aid-emergency font-bold text-white transition-colors hover:bg-[#9b1c14] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aid-emergency ${
        compact ? "px-3.5 py-2 text-xs" : "px-4 py-2.5 text-sm"
      } ${className}`}
      aria-label="Call emergency services at 911"
    >
      <span
        aria-hidden="true"
        className="h-2 w-2 shrink-0 rounded-full bg-white"
      />
      Call 911
    </a>
  );
}

export function MedicalDisclaimer({ className = "" }) {
  return (
    <p
      role="note"
      className={`max-w-2xl text-sm leading-relaxed text-aid-muted ${className}`}
    >
      SnapAid provides general first-aid guidance only. It is not a diagnosis or a
      substitute for professional medical care. If someone is in danger, call
      emergency services immediately.
    </p>
  );
}
