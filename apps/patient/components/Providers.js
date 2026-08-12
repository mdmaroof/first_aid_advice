"use client";

import { ResultsProvider } from "@/context/ResultsContext";
import { EmergencyProvider } from "@/context/EmergencyContext";
import { ToastProvider } from "@curais/ui";

export function Providers({ children }) {
  return (
    <ToastProvider>
      <EmergencyProvider>
        <ResultsProvider>{children}</ResultsProvider>
      </EmergencyProvider>
    </ToastProvider>
  );
}
