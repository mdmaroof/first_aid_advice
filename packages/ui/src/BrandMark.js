import { Plus } from "lucide-react";

export function BrandMark({ compact = false, label = "Curais" }) {
  const markSize = compact ? "h-9 w-9 rounded-xl" : "h-11 w-11 rounded-2xl";
  const iconSize = compact ? "h-4 w-4" : "h-5 w-5";

  return (
    <span className="inline-flex items-center gap-2.5" aria-label={label}>
      <span
        className={`relative inline-flex items-center justify-center border-[3px] border-r-transparent border-[#0b5d64] bg-white/45 text-[#0b5d64] ${markSize}`}
        aria-hidden="true"
      >
        <Plus className={iconSize} strokeWidth={3} />
      </span>
      <span className="font-quicksand text-xl font-bold tracking-[0.08em] text-[#10252b]">
        CURAIS
      </span>
    </span>
  );
}
