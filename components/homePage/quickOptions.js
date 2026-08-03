"use client";

import { callApi } from "@/hooks/callApi";
import { useResults } from "@/context/ResultsContext";
import { useRouter } from "next/navigation";

const QUICK_OPTIONS = [
  "heart pain",
  "nausea",
  "burn",
  "wound",
  "frostbite",
  "headache",
  "frozen shoulder",
  "severe body pain",
];

const GridBox = ({ onClick, text, disabled }) => {
  return (
    <button
      type="button"
      onClick={() => onClick(text)}
      disabled={disabled}
      className="cursor-pointer truncate rounded-xl border border-aid-line bg-white px-4 py-3 text-left text-sm font-semibold text-aid-ink transition-colors hover:border-aid-teal hover:bg-aid-mist focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aid-teal disabled:cursor-not-allowed disabled:opacity-50 md:text-base"
    >
      {text}
    </button>
  );
};

export const QuickOptions = ({ step, setStep }) => {
  const router = useRouter();
  const { setResult } = useResults();
  const isSearching = step === "step3";

  const callData = async (data) => {
    if (isSearching) return;

    setStep("step3");
    const res = await callApi(data);

    if (res.error) {
      setStep("step1");
      return;
    }

    setResult(res.data);
    router.push("/search");
  };

  return (
    <div
      role="group"
      aria-label="Common symptoms"
      className="mt-8 grid w-full max-w-3xl grid-cols-2 gap-2.5 md:mt-10 md:grid-cols-4 md:gap-3"
    >
      {QUICK_OPTIONS.map((option) => (
        <GridBox
          key={option}
          onClick={callData}
          text={option}
          disabled={isSearching}
        />
      ))}
    </div>
  );
};
