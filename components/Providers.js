"use client";

import { ResultsProvider } from "@/context/ResultsContext";

export function Providers({ children }) {
  return <ResultsProvider>{children}</ResultsProvider>;
}
