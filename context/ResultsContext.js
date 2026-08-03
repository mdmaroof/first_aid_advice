"use client";

import { createContext, useContext, useState } from "react";

const ResultsContext = createContext(null);

export function ResultsProvider({ children }) {
  const [result, setResult] = useState(null);

  const clearResult = () => setResult(null);

  return (
    <ResultsContext.Provider value={{ result, setResult, clearResult }}>
      {children}
    </ResultsContext.Provider>
  );
}

export function useResults() {
  const context = useContext(ResultsContext);
  if (!context) {
    throw new Error("useResults must be used within a ResultsProvider");
  }
  return context;
}
