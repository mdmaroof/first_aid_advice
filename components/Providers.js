"use client";

import { ResultsProvider } from "@/context/ResultsContext";
import { EmergencyProvider } from "@/context/EmergencyContext";

export function Providers({ children }) {
  return (
    <EmergencyProvider>
      <ResultsProvider>{children}</ResultsProvider>
    </EmergencyProvider>
  );
}
