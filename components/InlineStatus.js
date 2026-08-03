"use client";

import { AlertCircle, WifiOff } from "lucide-react";

export function InlineError({ message, className = "", id }) {
  if (!message) return null;

  return (
    <p
      id={id}
      role="alert"
      className={`mt-3 flex max-w-md items-start gap-2 rounded-2xl border border-aid-emergency/25 bg-aid-emergency/10 px-3 py-2.5 text-left text-sm font-semibold text-aid-emergency ${className}`}
    >
      <AlertCircle
        className="mt-0.5 h-4 w-4 shrink-0"
        strokeWidth={2.5}
        aria-hidden="true"
      />
      <span>{message}</span>
    </p>
  );
}

export function OfflineBanner({ className = "" }) {
  return (
    <p
      role="status"
      className={`glass flex max-w-md items-start gap-2 rounded-2xl px-3 py-2.5 text-left text-sm font-semibold text-aid-ink ${className}`}
    >
      <WifiOff
        className="mt-0.5 h-4 w-4 shrink-0 text-aid-teal"
        strokeWidth={2.5}
        aria-hidden="true"
      />
      <span>
        Offline — quick options still work. For anything else, call emergency
        services.
      </span>
    </p>
  );
}
