"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { callApi } from "@/hooks/callApi";
import { useResults } from "@/context/ResultsContext";
import { useRouter } from "next/navigation";
import { Keyboard, Mic, MicOff, Search } from "lucide-react";
import { easeOut, scaleTap } from "@/hooks/motion";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import { InlineError } from "@/components/InlineStatus";
import { MAX_SYMPTOM_LENGTH } from "@/lib/aidResult";

const layoutSpring = {
  layout: { type: "spring", stiffness: 420, damping: 34 },
  opacity: { duration: 0.14, ease: easeOut },
};

export const SearchInput = ({ step, setStep, error, setError }) => {
  const [input, setInput] = useState("");
  const router = useRouter();
  const { setResult } = useResults();
  const expanded = step === "step2";
  const searchingRef = useRef(false);

  const runSearch = useCallback(
    async (raw) => {
      const query = String(raw ?? "").trim();
      if (!query || searchingRef.current) return;

      searchingRef.current = true;
      setError?.(null);
      setStep("step3");

      try {
        const res = await callApi(query);

        if (res.error) {
          setError?.(res.message || "Something went wrong. Please try again.");
          setStep("step2");
          return;
        }

        setResult(res.data);
        router.push("/search");
      } finally {
        searchingRef.current = false;
      }
    },
    [router, setError, setResult, setStep]
  );

  const handleSpeechResult = useCallback(
    (transcript) => {
      setInput(transcript);
      if (error) setError?.(null);
    },
    [error, setError]
  );

  const handleSpeechComplete = useCallback(
    ({ transcript }) => {
      const text = String(transcript ?? "").trim();
      if (!text) {
        // Silence / no speech — mic already closed; do not search.
        return;
      }
      setInput(text);
      runSearch(text);
    },
    [runSearch]
  );

  const handleSpeechError = useCallback(
    (message) => {
      setError?.(message);
    },
    [setError]
  );

  const { supported: speechSupported, listening, toggle, stop } =
    useSpeechToText({
      lang: "en-US",
      maxLength: MAX_SYMPTOM_LENGTH,
      onResult: handleSpeechResult,
      onComplete: handleSpeechComplete,
      onError: handleSpeechError,
    });

  useEffect(() => {
    if (step !== "step2") stop();
  }, [step, stop]);

  const stepMarker = async () => {
    if (step === "step1") {
      setError?.(null);
      setStep("step2");
      return;
    }

    if (step === "step2") {
      if (!input.trim()) {
        setError?.("Type or speak a symptom first.");
        return;
      }

      stop();
      await runSearch(input);
    }
  };

  return (
    <div className="mt-8 flex w-full min-w-0 flex-col items-center justify-center md:mt-9">
      <div className="flex w-full max-w-md justify-center">
        <motion.div
          layout
          transition={layoutSpring}
          className={`glass-strong overflow-hidden rounded-2xl ${
            expanded ? "w-full" : "w-auto min-w-[220px]"
          }`}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {step === "step1" ? (
              <motion.button
                key="step1"
                type="button"
                layout="position"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={layoutSpring}
                whileHover={scaleTap.whileHover}
                whileTap={scaleTap.whileTap}
                onClick={stepMarker}
                className="flex w-full cursor-pointer items-center justify-center gap-2 px-8 py-3.5 text-lg font-bold text-aid-ink hover:bg-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aid-teal"
              >
                <Keyboard
                  className="h-5 w-5 text-aid-teal"
                  strokeWidth={2.25}
                  aria-hidden="true"
                />
                Type symptoms
              </motion.button>
            ) : null}

            {step === "step2" ? (
              <motion.form
                key="step2"
                layout="position"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={layoutSpring}
                onSubmit={(event) => {
                  event.preventDefault();
                  stepMarker();
                }}
                className="flex w-full min-w-0 items-center gap-1 p-1.5"
              >
                <span className="pl-2.5 text-aid-teal" aria-hidden="true">
                  <Search className="h-4 w-4" strokeWidth={2.25} />
                </span>
                <label htmlFor="symptom-input" className="sr-only">
                  Describe your symptoms
                </label>
                <input
                  id="symptom-input"
                  value={input}
                  onChange={(event) => {
                    setInput(event.target.value);
                    if (error) setError?.(null);
                  }}
                  placeholder={
                    listening ? "Listening…" : "e.g. chest pain"
                  }
                  autoComplete="off"
                  autoFocus
                  maxLength={MAX_SYMPTOM_LENGTH}
                  aria-invalid={Boolean(error) || undefined}
                  aria-describedby={error ? "symptom-error" : undefined}
                  className="min-w-0 flex-1 bg-transparent px-2 py-2.5 text-base text-aid-ink placeholder:text-aid-muted/70 focus-visible:outline-none"
                />
                {speechSupported ? (
                  <motion.button
                    type="button"
                    whileHover={scaleTap.whileHover}
                    whileTap={scaleTap.whileTap}
                    transition={scaleTap.transition}
                    onClick={toggle}
                    aria-pressed={listening}
                    aria-label={
                      listening ? "Stop voice input" : "Speak symptoms"
                    }
                    title={listening ? "Stop listening" : "Speak symptoms"}
                    className={`shrink-0 rounded-xl p-2.5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aid-teal ${
                      listening
                        ? "bg-aid-emergency/90 text-white hover:bg-aid-emergency"
                        : "bg-aid-teal/15 text-aid-teal hover:bg-aid-teal/25"
                    }`}
                  >
                    {listening ? (
                      <MicOff className="h-4 w-4" strokeWidth={2.25} />
                    ) : (
                      <Mic className="h-4 w-4" strokeWidth={2.25} />
                    )}
                  </motion.button>
                ) : null}
                <motion.button
                  type="submit"
                  whileHover={scaleTap.whileHover}
                  whileTap={scaleTap.whileTap}
                  transition={scaleTap.transition}
                  className="shrink-0 rounded-xl bg-aid-ink/90 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-aid-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aid-ink"
                >
                  Search
                </motion.button>
              </motion.form>
            ) : null}

            {step === "step3" ? (
              <motion.div
                key="step3"
                layout="position"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={layoutSpring}
                role="status"
                aria-busy="true"
                className="flex w-full items-center justify-center gap-2 px-8 py-3.5 text-lg font-bold text-aid-ink"
              >
                Searching
                <span className="loader ml-1" aria-hidden="true" />
                <span className="sr-only">Loading results</span>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </div>

      {step === "step2" ? (
        <InlineError message={error} id="symptom-error" className="w-full max-w-md" />
      ) : (
        <InlineError message={error} />
      )}
    </div>
  );
};
