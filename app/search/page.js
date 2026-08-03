"use client";

import { Title } from "@/components/homePage";
import { EmergencyCTA, MedicalDisclaimer } from "@/components/SafetyBanner";
import { useResults } from "@/context/ResultsContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const SearchPage = () => {
  const { result, clearResult } = useResults();
  const router = useRouter();

  useEffect(() => {
    if (!result) {
      router.replace("/");
    }
  }, [result, router]);

  if (!result) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-aid-gradient text-white">
        <p className="text-lg">Loading guidance…</p>
      </main>
    );
  }

  const { first_instance, instant_help, medical_advice, symptoms_option } =
    result;

  const handleNewSearch = () => {
    clearResult();
    router.push("/");
  };

  return (
    <main className="relative min-h-dvh w-full overflow-y-auto bg-aid-gradient px-4 py-6 text-white md:px-10 md:py-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.16),_transparent_40%)]" />

      <div className="relative z-10 mx-auto max-w-4xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <EmergencyCTA />
          <button
            type="button"
            onClick={handleNewSearch}
            className="rounded-full border-2 border-white/70 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            New search
          </button>
        </div>

        <header className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
          <Title size="w-[96px] h-[96px] md:w-[112px] md:h-[112px]" textSize="text-xl md:text-2xl" />
          <div className="flex-1">
            <h1 className="font-quicksand text-3xl font-bold tracking-tight md:text-4xl">
              Looks like {first_instance?.disease || "an urgent concern"}
            </h1>
            {first_instance?.accuracy ? (
              <p className="mt-1 text-base text-white/90 md:text-lg">
                Estimated match: {first_instance.accuracy}
              </p>
            ) : null}
            {medical_advice ? (
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/95 md:text-lg">
                {medical_advice}
              </p>
            ) : null}
          </div>
        </header>

        {symptoms_option?.length > 0 ? (
          <section
            aria-labelledby="symptoms-heading"
            className="mt-8 rounded-2xl bg-white p-4 shadow-sm md:mt-10 md:p-6"
          >
            <h2
              id="symptoms-heading"
              className="font-quicksand text-xl font-bold text-[#ff7b73]"
            >
              Look for other symptoms
            </h2>
            <ul className="mt-4 flex flex-col gap-3">
              {symptoms_option.map((item, index) => (
                <li
                  key={`${item.symptom}-${index}`}
                  className="rounded-xl border-2 border-[#ff7b73]/30 px-4 py-3"
                >
                  <p className="text-lg font-semibold text-[#ff7b73]">
                    {item.symptom}
                  </p>
                  <p className="mt-1 text-sm font-light leading-relaxed text-neutral-700 md:text-base">
                    {item.description}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {instant_help?.length > 0 ? (
          <section
            aria-labelledby="help-heading"
            className="mt-6 rounded-2xl bg-white p-4 shadow-sm md:mt-8 md:p-6"
          >
            <h2
              id="help-heading"
              className="font-quicksand text-xl font-bold text-[#ff7b73]"
            >
              Advised help
            </h2>
            <ol className="mt-4 flex flex-col gap-3">
              {instant_help.map((item, index) => (
                <li
                  key={`${item.step}-${index}`}
                  className="flex gap-3 text-[#c94f48]"
                >
                  <span className="min-w-7 font-bold text-[#ff7b73]">
                    {item.step}.
                  </span>
                  <span className="leading-relaxed">{item.info}</span>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        <div className="mt-8 flex flex-col items-start gap-5 md:mt-10">
          <button
            type="button"
            onClick={handleNewSearch}
            className="rounded-full border-4 border-white bg-white px-6 py-3 text-lg font-bold text-[#ff7b73] transition-transform hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:px-10 md:text-xl"
          >
            Search new symptoms
          </button>
          <MedicalDisclaimer />
        </div>
      </div>
    </main>
  );
};

export default SearchPage;
