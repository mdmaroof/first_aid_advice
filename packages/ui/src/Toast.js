"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, CircleAlert, Info, TriangleAlert, X } from "lucide-react";

const ToastContext = createContext(null);
const iconByType = { error: CircleAlert, success: CheckCircle2, info: Info, warning: TriangleAlert };

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismissToast = useCallback((id) => {
    const timer = timers.current.get(id);
    if (timer) clearTimeout(timer);
    timers.current.delete(id);
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(({ type = "info", title, message, duration = 6000 }) => {
    const id = globalThis.crypto?.randomUUID?.() || `toast-${Date.now()}-${Math.random()}`;
    const nextToast = { id, type, title: title || defaultTitle(type), message };
    setToasts((current) => [...current.slice(-3), nextToast]);
    if (duration > 0) {
      timers.current.set(id, setTimeout(() => dismissToast(id), duration));
    }
    return id;
  }, [dismissToast]);

  useEffect(() => () => {
    timers.current.forEach(clearTimeout);
    timers.current.clear();
  }, []);

  const value = useMemo(() => ({ showToast, dismissToast }), [dismissToast, showToast]);
  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context;
}

function ToastViewport({ toasts, onDismiss }) {
  return (
    <div
      className="pointer-events-none fixed inset-x-3 top-3 z-[100] flex flex-col items-end gap-3 sm:inset-x-auto sm:right-5 sm:top-5 sm:w-[min(26rem,calc(100vw-2.5rem))]"
      aria-live="polite"
      aria-relevant="additions removals"
    >
      {toasts.map((toast) => {
        const Icon = iconByType[toast.type] || Info;
        const isError = toast.type === "error";
        return (
          <section
            key={toast.id}
            role={isError ? "alert" : "status"}
            className={`pointer-events-auto relative w-full overflow-hidden rounded-2xl border p-4 shadow-[0_20px_55px_rgba(18,32,38,.20),inset_0_1px_0_rgba(255,255,255,.8)] backdrop-blur-3xl animate-[toast-in_.22s_ease-out] before:pointer-events-none before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/35 before:to-transparent ${
              isError
                ? "border-red-200/80 bg-red-50/65 text-red-950"
                : toast.type === "success"
                  ? "border-emerald-200/80 bg-emerald-50/65 text-emerald-950"
                  : toast.type === "warning"
                    ? "border-amber-200/80 bg-amber-50/65 text-amber-950"
                    : "border-white/80 bg-white/55 text-aid-ink"
            }`}
          >
            <div className="relative z-10 flex items-start gap-3">
              <span className={`mt-0.5 rounded-xl border border-white/60 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,.7)] ${isError ? "bg-red-100/65 text-aid-emergency" : toast.type === "success" ? "bg-emerald-100/65 text-emerald-700" : toast.type === "warning" ? "bg-amber-100/65 text-amber-700" : "bg-aid-teal/10 text-aid-teal"}`}>
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="font-quicksand text-sm font-bold">{toast.title}</h2>
                {toast.message ? <p className="mt-1 break-words text-sm leading-relaxed opacity-80">{toast.message}</p> : null}
              </div>
              <button type="button" onClick={() => onDismiss(toast.id)} className="rounded-lg p-1 opacity-60 transition hover:bg-black/5 hover:opacity-100" aria-label="Dismiss notification">
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </section>
        );
      })}
      <style jsx global>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(-10px) scale(.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-\[toast-in_\.22s_ease-out\] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

function defaultTitle(type) {
  if (type === "error") return "Something needs attention";
  if (type === "success") return "Done";
  if (type === "warning") return "Please note";
  return "Curais update";
}
