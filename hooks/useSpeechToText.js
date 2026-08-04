"use client";

import { useCallback, useEffect, useRef, useState } from "react";

function getSpeechRecognition() {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

/**
 * Free browser speech-to-text (Web Speech API).
 * Auto-closes on silence. onComplete({ transcript, reason }) when session ends
 * without a manual stop — use transcript to auto-search when non-empty.
 */
export function useSpeechToText({
  lang = "en-US",
  onResult,
  onComplete,
  onError,
  maxLength,
} = {}) {
  const Recognition = getSpeechRecognition();
  const supported = Boolean(Recognition);

  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const transcriptRef = useRef("");
  const manualStopRef = useRef(false);
  const completedRef = useRef(false);
  const sessionRef = useRef(0);

  const onResultRef = useRef(onResult);
  const onCompleteRef = useRef(onComplete);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onResultRef.current = onResult;
    onCompleteRef.current = onComplete;
    onErrorRef.current = onError;
  }, [onResult, onComplete, onError]);

  const completeOnce = useCallback((sessionId, reason) => {
    if (sessionId !== sessionRef.current) return;
    if (completedRef.current) return;
    completedRef.current = true;

    const transcript = transcriptRef.current.trim();
    setListening(false);
    recognitionRef.current = null;

    if (manualStopRef.current) {
      manualStopRef.current = false;
      return;
    }

    onCompleteRef.current?.({
      transcript,
      reason: transcript ? "speech" : reason || "silence",
    });
  }, []);

  const stop = useCallback(() => {
    manualStopRef.current = true;
    completedRef.current = true;
    sessionRef.current += 1;
    const recognition = recognitionRef.current;
    if (recognition) {
      try {
        recognition.stop();
      } catch {
        // already stopped
      }
      recognitionRef.current = null;
    }
    setListening(false);
  }, []);

  const start = useCallback(() => {
    if (!Recognition) {
      onErrorRef.current?.("Voice input isn't supported in this browser.");
      return;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }

    const sessionId = sessionRef.current + 1;
    sessionRef.current = sessionId;
    manualStopRef.current = false;
    completedRef.current = false;
    transcriptRef.current = "";

    const recognition = new Recognition();
    recognition.lang = lang;
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      if (sessionId !== sessionRef.current) return;
      setListening(true);
    };

    recognition.onresult = (event) => {
      if (sessionId !== sessionRef.current) return;

      let transcript = "";
      for (let i = 0; i < event.results.length; i += 1) {
        transcript += event.results[i][0]?.transcript ?? "";
      }
      transcript = transcript.trim();
      if (!transcript) return;

      const next =
        typeof maxLength === "number"
          ? transcript.slice(0, maxLength)
          : transcript;

      transcriptRef.current = next;
      onResultRef.current?.(next, {
        isFinal: Boolean(event.results[event.results.length - 1]?.isFinal),
      });
    };

    recognition.onerror = (event) => {
      if (sessionId !== sessionRef.current) return;
      const code = event?.error;

      if (code === "no-speech" || code === "aborted") {
        completeOnce(sessionId, "silence");
        return;
      }

      if (code === "not-allowed") {
        onErrorRef.current?.(
          "Microphone blocked. Allow mic access to speak symptoms."
        );
      } else {
        onErrorRef.current?.("Couldn't hear that. Try again or type.");
      }
      completeOnce(sessionId, "error");
    };

    recognition.onend = () => {
      completeOnce(
        sessionId,
        transcriptRef.current.trim() ? "speech" : "silence"
      );
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      onErrorRef.current?.("Couldn't start voice input. Try again.");
      setListening(false);
      recognitionRef.current = null;
      completedRef.current = true;
    }
  }, [Recognition, completeOnce, lang, maxLength]);

  const toggle = useCallback(() => {
    if (listening) stop();
    else start();
  }, [listening, start, stop]);

  useEffect(() => () => stop(), [stop]);

  return { supported, listening, start, stop, toggle };
}
