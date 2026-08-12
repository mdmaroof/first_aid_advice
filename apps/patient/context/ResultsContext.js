"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { normalizeAidResult } from "@/lib/aidResult";

const STORAGE_KEY = "snapaid:last-result";

const ResultsContext = createContext(null);

function readStoredResult() {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return normalizeAidResult(JSON.parse(raw));
  } catch {
    return null;
  }
}

function writeStoredResult(result) {
  if (typeof window === "undefined") return;
  try {
    if (!result) {
      sessionStorage.removeItem(STORAGE_KEY);
      return;
    }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(result));
  } catch {
    // Quota / private mode — ignore
  }
}

export function ResultsProvider({ children }) {
  const [result, setResultState] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setResultState(readStoredResult());
    setHydrated(true);
  }, []);

  const setResult = useCallback((next) => {
    const normalized = next ? normalizeAidResult(next) : null;
    setResultState(normalized);
    writeStoredResult(normalized);
  }, []);

  const clearResult = useCallback(() => {
    setResultState(null);
    writeStoredResult(null);
  }, []);

  const value = useMemo(
    () => ({ result, setResult, clearResult, hydrated }),
    [result, setResult, clearResult, hydrated]
  );

  return (
    <ResultsContext.Provider value={value}>{children}</ResultsContext.Provider>
  );
}

export function useResults() {
  const context = useContext(ResultsContext);
  if (!context) {
    throw new Error("useResults must be used within a ResultsProvider");
  }
  return context;
}
