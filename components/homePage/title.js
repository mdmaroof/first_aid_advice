export const Title = ({
  size = "w-[160px] h-[160px] md:w-[220px] md:h-[220px]",
  textSize = "text-2xl md:text-5xl",
}) => {
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-white shadow-[0_12px_40px_rgba(0,0,0,0.12)] ${size}`}
      aria-label="SnapAid"
    >
      <p className={`font-quicksand font-bold tracking-tight text-[#ff7b73] ${textSize}`}>
        SnapAid
      </p>
    </div>
  );
};
