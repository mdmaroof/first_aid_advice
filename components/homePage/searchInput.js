"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { callApi } from "@/hooks/callApi";
import { useResults } from "@/context/ResultsContext";
import { useRouter } from "next/navigation";

const ButtonComponent = ({
  text,
  onClick,
  initial = {},
  animate = {},
  exit = {},
  search = false,
  disabled = false,
}) => {
  return (
    <motion.button
      type="button"
      exit={exit}
      initial={initial}
      animate={animate}
      onClick={onClick}
      disabled={disabled}
      aria-busy={search || undefined}
      className="glass-strong relative flex min-w-[220px] cursor-pointer items-center justify-center gap-2 rounded-2xl px-8 py-3.5 text-lg font-bold text-aid-ink transition-[background-color] hover:bg-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aid-teal disabled:cursor-wait"
    >
      {text}
      {search ? <span className="loader ml-1" aria-hidden="true" /> : null}
      {search ? <span className="sr-only">Loading results</span> : null}
    </motion.button>
  );
};

const InputSearchBox = ({ onSubmit, input, setInput }) => {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="w-full max-w-md"
    >
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong grid grid-cols-[1fr_auto] overflow-hidden rounded-2xl focus-within:border-white/80"
      >
        <label htmlFor="symptom-input" className="sr-only">
          Describe your symptoms
        </label>
        <input
          id="symptom-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="e.g. sharp chest pain"
          autoComplete="off"
          className="bg-transparent px-4 py-3.5 text-base text-aid-ink placeholder:text-aid-muted/70 focus-visible:outline-none"
        />
        <button
          type="submit"
          className="bg-aid-ink/90 px-5 py-3.5 font-bold text-white transition-colors hover:bg-aid-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aid-ink"
        >
          Search
        </button>
      </motion.div>
    </form>
  );
};

export const SearchInput = ({ step, setStep }) => {
  const [input, setInput] = useState("");
  const router = useRouter();
  const { setResult } = useResults();

  const stepMarker = async () => {
    if (step === "step1") {
      setStep("step2");
      return;
    }

    if (step === "step2") {
      if (!input.trim()) return;

      setStep("step3");
      const res = await callApi(input.trim());

      if (res.error) {
        setStep("step2");
        return;
      }

      setResult(res.data);
      router.push("/search");
    }
  };

  return (
    <div className="mt-8 flex w-full items-center justify-center md:mt-9">
      <AnimatePresence mode="wait">
        {step === "step1" ? (
          <ButtonComponent
            key="step1"
            onClick={stepMarker}
            exit={{ opacity: 0 }}
            text="Type symptoms"
          />
        ) : null}
        {step === "step2" ? (
          <InputSearchBox
            key="step2"
            input={input}
            setInput={setInput}
            onSubmit={stepMarker}
          />
        ) : null}
        {step === "step3" ? (
          <ButtonComponent key="step3" text="Searching" search disabled />
        ) : null}
      </AnimatePresence>
    </div>
  );
};
