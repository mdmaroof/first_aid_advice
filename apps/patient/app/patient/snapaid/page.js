"use client";

import { useEffect, useState } from "react";
import { Title, SearchInput, QuickOptions } from "@/components/homePage";
import { EmergencyCTA, MedicalDisclaimer } from "@/components/SafetyBanner";
import { OfflineBanner } from "@/components/InlineStatus";
import { useStepTracker } from "@/hooks/steps";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer, staggerItem } from "@/hooks/motion";

export function SnapAidHome({ signedIn = false }) {
  const { step, setStep } = useStepTracker();
  const [error, setError] = useState(null);
  const [offline, setOffline] = useState(false);
  const [useHealthContext, setUseHealthContext] = useState(false);
  useEffect(() => {
    const sync = () => setOffline(!navigator.onLine);
    sync(); window.addEventListener("online", sync); window.addEventListener("offline", sync);
    return () => { window.removeEventListener("online", sync); window.removeEventListener("offline", sync); };
  }, []);
  return <main className="page-blobs relative flex min-h-dvh w-full flex-col items-center justify-center overflow-y-auto text-aid-ink">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.45),transparent_40%)]" />
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="safe-content relative z-10 flex w-full max-w-2xl flex-col items-center py-6">
      <div className="flex w-full items-center justify-between"><a href={process.env.NEXT_PUBLIC_LANDING_URL || "http://localhost:4000"} className="rounded-xl bg-white/50 px-3 py-2 text-xs font-bold text-aid-teal">← Curais home</a><EmergencyCTA /></div>
      <Title />
      <motion.p variants={fadeUp} custom={2} initial="hidden" animate="show" className="mt-5 max-w-md text-center text-base text-aid-ink/75 md:text-lg">Type symptoms. Get clear steps you can act on now.</motion.p>
      {offline ? <OfflineBanner className="mt-5" /> : null}
      {signedIn ? <HealthContextChoice checked={useHealthContext} onChange={setUseHealthContext} /> : null}
      <QuickOptions step={step} setStep={setStep} setError={setError} useHealthContext={useHealthContext} />
      <SearchInput step={step} setStep={setStep} error={error} setError={setError} useHealthContext={useHealthContext} />
      <motion.div variants={fadeUp} custom={8} initial="hidden" animate="show" className="mt-10 text-center"><MedicalDisclaimer boxed /></motion.div>
    </motion.div>
  </main>;
}

function HealthContextChoice({ checked, onChange }) {
  return <label className="glass mt-5 flex w-full max-w-md cursor-pointer items-start gap-3 rounded-2xl p-3 text-left"><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="mt-1 h-4 w-4 accent-aid-teal"/><span><span className="block text-sm font-bold text-aid-ink">Use my saved health context for this search</span><span className="mt-1 block text-xs leading-5 text-aid-muted">Sends only saved allergies, medicines and recent history to the guidance provider. Emergency escalation never becomes less urgent.</span></span></label>;
}

export default SnapAidHome;
