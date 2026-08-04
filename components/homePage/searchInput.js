"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { callApi } from "@/hooks/callApi";
import { useResults } from "@/context/ResultsContext";
import { useRouter } from "next/navigation";
import { Keyboard, Search } from "lucide-react";
import { easeOut, scaleTap } from "@/hooks/motion";
import { InlineError } from "@/components/InlineStatus";
import { MAX_SYMPTOM_LENGTH } from "@/lib/aidResult";

const ButtonComponent = ({
  text,
  onClick,
  search = false,
  disabled = false,
  icon: Icon = null,
}) => {
  return (
    <motion.button
      type="button"
      layout
      initial={{ opacity: 0, scale: 0.96, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -6 }}
      transition={{ duration: 0.28, ease: easeOut }}
      whileHover={disabled ? undefined : scaleTap.whileHover}
      whileTap={disabled ? undefined : scaleTap.whileTap}
      onClick={onClick}
      disabled={disabled}
      aria-busy={search || undefined}
      className="glass-strong relative flex min-w-[220px] cursor-pointer items-center justify-center gap-2 rounded-2xl px-8 py-3.5 text-lg font-bold text-aid-ink transition-[background-color] hover:bg-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aid-teal disabled:cursor-wait"
    >
      {Icon && !search ? (
        <Icon className="h-5 w-5 text-aid-teal" strokeWidth={2.25} aria-hidden="true" />
      ) : null}
      {text}
      {search ? <span className="loader ml-1" aria-hidden="true" /> : null}
      {search ? <span className="sr-only">Loading results</span> : null}
    </motion.button>
  );
};

const InputSearchBox = ({ onSubmit, input, setInput, error }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -6 }}
      transition={{ duration: 0.28, ease: easeOut }}
      className="flex w-full min-w-0 max-w-md flex-col items-center"
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
        className="w-full min-w-0"
      >
        <div className="glass-strong flex w-full min-w-0 items-center gap-1 rounded-2xl p-1.5 focus-within:border-white/80">
          <span className="pl-2.5 text-aid-teal" aria-hidden="true">
            <Search className="h-4 w-4" strokeWidth={2.25} />
          </span>
          <label htmlFor="symptom-input" className="sr-only">
            Describe your symptoms
          </label>
          <input
            id="symptom-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="e.g. chest pain"
            autoComplete="off"
            maxLength={MAX_SYMPTOM_LENGTH}
            aria-invalid={Boolean(error) || undefined}
            aria-describedby={error ? "symptom-error" : undefined}
            className="min-w-0 flex-1 bg-transparent px-2 py-2.5 text-base text-aid-ink placeholder:text-aid-muted/70 focus-visible:outline-none"
          />
          <motion.button
            type="submit"
            whileHover={scaleTap.whileHover}
            whileTap={scaleTap.whileTap}
            transition={scaleTap.transition}
            className="shrink-0 rounded-xl bg-aid-ink/90 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-aid-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aid-ink"
          >
            Search
          </motion.button>
        </div>
      </form>
      <InlineError message={error} id="symptom-error" className="w-full" />
    </motion.div>
  );
};

export const SearchInput = ({ step, setStep, error, setError }) => {
  const [input, setInput] = useState("");
  const router = useRouter();
  const { setResult } = useResults();

  const stepMarker = async () => {
    if (step === "step1") {
      setError?.(null);
      setStep("step2");
      return;
    }

    if (step === "step2") {
      if (!input.trim()) {
        setError?.("Type a symptom first.");
        return;
      }

      setError?.(null);
      setStep("step3");
      const res = await callApi(input.trim());

      if (res.error) {
        setError?.(res.message || "Something went wrong. Please try again.");
        setStep("step2");
        return;
      }

      setResult(res.data);
      router.push("/search");
    }
  };

  return (
    <div className="mt-8 flex w-full min-w-0 flex-col items-center justify-center md:mt-9">
      <AnimatePresence mode="wait">
        {step === "step1" ? (
          <ButtonComponent
            key="step1"
            onClick={stepMarker}
            text="Type symptoms"
            icon={Keyboard}
          />
        ) : null}
        {step === "step2" ? (
          <InputSearchBox
            key="step2"
            input={input}
            setInput={(value) => {
              setInput(value);
              if (error) setError?.(null);
            }}
            onSubmit={stepMarker}
            error={error}
          />
        ) : null}
        {step === "step3" ? (
          <ButtonComponent key="step3" text="Searching" search disabled />
        ) : null}
      </AnimatePresence>
      {step !== "step2" ? <InlineError message={error} /> : null}
    </div>
  );
};
