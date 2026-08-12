"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { DEFAULT_EMERGENCY } from "@/data/emergencyNumbers";

const EmergencyContext = createContext({
  number: DEFAULT_EMERGENCY.number,
  label: DEFAULT_EMERGENCY.label,
  countryCode: null,
  poison: null,
  loading: true,
});

export function EmergencyProvider({ children }) {
  const [emergency, setEmergency] = useState({
    number: DEFAULT_EMERGENCY.number,
    label: DEFAULT_EMERGENCY.label,
    countryCode: null,
    poison: null,
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;

    fetch("/api/emergency")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data?.number) return;
        setEmergency({
          number: data.number,
          label: data.label || data.number,
          countryCode: data.countryCode ?? null,
          poison: data.poison ?? null,
          loading: false,
        });
      })
      .catch(() => {
        if (!cancelled) {
          setEmergency((prev) => ({ ...prev, loading: false }));
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <EmergencyContext.Provider value={emergency}>
      {children}
    </EmergencyContext.Provider>
  );
}

export function useEmergency() {
  return useContext(EmergencyContext);
}
