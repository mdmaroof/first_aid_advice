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
      className="cursor-pointer truncate rounded-full border border-[#ff7b73] bg-white px-6 py-2.5 text-sm font-semibold text-[#ff7b73] transition-all duration-300 hover:border-white hover:bg-transparent hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-60 md:px-8 md:text-base"
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
      className="mt-8 grid w-full max-w-[900px] grid-cols-2 gap-3 px-1 md:mt-12 md:grid-cols-4 md:gap-4"
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
