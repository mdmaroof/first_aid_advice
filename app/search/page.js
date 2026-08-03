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
      <main className="page-blobs flex min-h-dvh items-center justify-center bg-aid-page text-aid-muted">
        <p className="relative z-10 text-lg">Loading guidance…</p>
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
    <main className="page-blobs relative min-h-dvh w-full bg-aid-page text-aid-ink">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.4),transparent_35%)]" />

      <div className="relative z-10 mx-auto max-w-3xl px-4 py-4 md:px-6 md:py-6">
        <header className="glass sticky top-3 z-20 mb-4 flex items-center justify-between gap-3 rounded-2xl px-4 py-3 md:mb-5 md:px-5">
          <Title compact />
          <div className="flex items-center gap-2">
            <EmergencyCTA compact />
            <button
              type="button"
              onClick={handleNewSearch}
              className="glass-soft rounded-2xl px-3 py-2 text-xs font-semibold text-aid-ink transition-[background-color] hover:bg-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aid-teal md:text-sm"
            >
              New search
            </button>
          </div>
        </header>

        <section className="glass-strong rounded-[1.5rem] px-5 py-5 md:px-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h1 className="font-quicksand text-2xl font-bold tracking-tight text-aid-ink md:text-3xl">
              {first_instance?.disease || "Urgent concern"}
            </h1>
            {first_instance?.accuracy ? (
              <span className="text-sm font-semibold text-aid-teal">
                {first_instance.accuracy}
              </span>
            ) : null}
          </div>
          {medical_advice ? (
            <p className="mt-3 text-sm leading-relaxed text-aid-ink/80 md:text-base">
              {medical_advice}
            </p>
          ) : null}
        </section>

        {instant_help?.length > 0 ? (
          <section aria-labelledby="help-heading" className="mt-4 md:mt-5">
            <h2
              id="help-heading"
              className="mb-3 px-1 font-quicksand text-base font-bold text-aid-ink md:text-lg"
            >
              What to do
            </h2>
            <ol className="flex flex-col gap-2.5">
              {instant_help.map((item, index) => (
                <li key={`${item.step}-${index}`}>
                  <article className="glass-strong flex gap-3 rounded-[1.25rem] px-4 py-3.5 md:px-5">
                    <span className="font-quicksand text-sm font-bold text-aid-teal">
                      {String(item.step).padStart(2, "0")}
                    </span>
                    <p className="text-sm leading-relaxed text-aid-ink md:text-base">
                      {item.info}
                    </p>
                  </article>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {symptoms_option?.length > 0 ? (
          <section aria-labelledby="symptoms-heading" className="mt-4 md:mt-5">
            <h2
              id="symptoms-heading"
              className="mb-3 px-1 font-quicksand text-base font-bold text-aid-ink md:text-lg"
            >
              Also look for
            </h2>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {symptoms_option.map((item, index) => (
                <article
                  key={`${item.symptom}-${index}`}
                  className="glass-strong rounded-[1.25rem] px-4 py-3.5"
                >
                  <h3 className="text-sm font-semibold text-aid-ink md:text-base">
                    {item.symptom}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-aid-muted">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <footer className="mt-5 flex flex-col gap-3 border-t border-white/40 pt-5 md:mt-6 md:flex-row md:items-center md:justify-between">
          <MedicalDisclaimer className="text-xs md:text-sm" />
          <button
            type="button"
            onClick={handleNewSearch}
            className="w-fit shrink-0 rounded-2xl bg-aid-ink px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-aid-ink/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aid-ink"
          >
            Search new symptoms
          </button>
        </footer>
      </div>
    </main>
  );
};

export default SearchPage;
