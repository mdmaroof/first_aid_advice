"use client";
import { Title, SearchInput, QuickOptions } from "@/components/homePage";
import { useStepTracker } from "@/hooks/steps";
import { useEffect } from "react";

function Home() {
  const { step, setStep } = useStepTracker();

  useEffect(() => {
    const getData = localStorage.getItem("getData");

    if (getData) {
      localStorage.removeItem("getData");
    };
  }, [])

  return (
    <main className="fixed bg-[#ff7b73] w-full h-full text-white flex flex-col items-center justify-center">
      <Title />
      <QuickOptions step={step} setStep={setStep} />
      <SearchInput step={step} setStep={setStep} />
    </main >
  );
}
export default Home;
