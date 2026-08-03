export const Title = ({
  size = "w-[150px] h-[150px] md:w-[190px] md:h-[190px]",
  textSize = "text-2xl md:text-4xl",
  compact = false,
}) => {
  if (compact) {
    return (
      <p
        className="font-quicksand text-xl font-bold tracking-tight text-aid-ink"
        aria-label="SnapAid"
      >
        SnapAid
      </p>
    );
  }

  return (
    <div
      className={`glass-strong relative flex items-center justify-center overflow-hidden rounded-[2rem] ${size}`}
      aria-label="SnapAid"
    >
      <p
        className={`relative font-quicksand font-bold tracking-tight text-aid-ink ${textSize}`}
      >
        SnapAid
      </p>
    </div>
  );
};
