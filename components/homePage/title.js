export const Title = ({
  size = "w-[148px] h-[148px] md:w-[200px] md:h-[200px]",
  textSize = "text-2xl md:text-4xl",
  compact = false,
}) => {
  if (compact) {
    return (
      <div className="flex items-center gap-2.5" aria-label="SnapAid">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-aid-teal text-sm font-bold text-white">
          SA
        </span>
        <span className="font-quicksand text-xl font-bold tracking-tight text-aid-ink">
          SnapAid
        </span>
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-[2rem] bg-white ring-1 ring-aid-line ${size}`}
      aria-label="SnapAid"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(20,145,155,0.16),transparent_55%)]"
      />
      <p
        className={`relative font-quicksand font-bold tracking-tight text-aid-teal ${textSize}`}
      >
        SnapAid
      </p>
    </div>
  );
};
