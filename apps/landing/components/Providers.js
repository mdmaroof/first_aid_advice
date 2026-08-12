"use client";

import { ToastProvider } from "@curais/ui";

export function Providers({ children }) {
  return <ToastProvider>{children}</ToastProvider>;
}
