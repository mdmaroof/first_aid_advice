export function EmergencyCTA({ className = "" }) {
  return (
    <a
      href="tel:911"
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-[#1a1a1a] px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${className}`}
      aria-label="Call emergency services at 911"
    >
      <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#ff4d45]" />
      Emergency? Call 911
    </a>
  );
}

export function MedicalDisclaimer({ variant = "dark" }) {
  const isLight = variant === "light";

  return (
    <p
      role="note"
      className={`max-w-xl text-center text-xs leading-relaxed md:text-sm ${
        isLight ? "text-[#ff7b73]/80" : "text-white/80"
      }`}
    >
      SnapAid provides general first-aid guidance only. It is not a diagnosis or a
      substitute for professional medical care. If someone is in danger, call
      emergency services immediately.
    </p>
  );
}
