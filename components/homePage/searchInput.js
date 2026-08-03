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
    <div className="rounded-full border-4 border-white p-1">
      <motion.button
        type="button"
        exit={exit}
        initial={initial}
        animate={animate}
        onClick={onClick}
        disabled={disabled}
        aria-busy={search || undefined}
        className="relative flex max-w-[312px] cursor-pointer items-center justify-center gap-1 rounded-full bg-white px-10 py-3 text-xl font-bold text-[#ff7b73] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-wait"
      >
        {text}
        {search ? (
          <span className="loader ml-2" aria-hidden="true" />
        ) : null}
        {search ? <span className="sr-only">Loading results</span> : null}
      </motion.button>
    </div>
  );
};

const InputSearchBox = ({ onSubmit, input, setInput }) => {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="rounded-full border-4 border-white p-1"
    >
      <motion.div
        initial={{ width: 250 }}
        animate={{ width: 340 }}
        className="relative grid max-w-full grid-cols-[1fr_auto] gap-1 overflow-hidden rounded-full bg-white p-1 text-xl text-[#ff7b73]"
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
          className="bg-transparent px-3 py-2 text-lg text-[#ff7b73] placeholder:text-[#ff7b73]/50 focus-visible:outline-none"
        />
        <button
          type="submit"
          className="rounded-full bg-[#ff7b73] px-4 py-2 font-bold text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff7b73]"
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
    <div className="mt-8 flex items-center justify-center md:mt-12">
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
          <ButtonComponent
            key="step3"
            initial={{ width: 340 }}
            animate={{ width: 230 }}
            text="Searching"
            search
            disabled
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
};
