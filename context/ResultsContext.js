"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ResultsContext = createContext(null);

export function ResultsProvider({ children }) {
  const [result, setResult] = useState(null);

  const clearResult = useCallback(() => {
    setResult(null);
  }, []);

  const value = useMemo(
    () => ({ result, setResult, clearResult }),
    [result, clearResult]
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
