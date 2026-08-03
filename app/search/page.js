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
      <main className="flex min-h-dvh items-center justify-center bg-aid-page text-aid-muted">
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
    <main className="min-h-dvh w-full bg-aid-page text-aid-ink">
      <div className="sticky top-0 z-20 border-b border-aid-line/80 bg-[#F7FBFC]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3 md:px-6">
          <Title compact />
          <div className="flex items-center gap-2">
            <EmergencyCTA compact />
            <button
              type="button"
              onClick={handleNewSearch}
              className="rounded-xl border border-aid-line bg-white px-3 py-2 text-xs font-semibold text-aid-ink transition-colors hover:border-aid-teal hover:text-aid-teal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aid-teal md:px-3.5 md:text-sm"
            >
              New search
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-6 md:px-6 md:py-8">
        <section
          aria-labelledby="assessment-heading"
          className="animate-fade-up rounded-2xl border border-aid-line bg-white p-5 md:p-7"
        >
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-aid-seafoam">
            Assessment
          </p>
          <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
            <h1
              id="assessment-heading"
              className="max-w-xl font-quicksand text-2xl font-bold tracking-tight text-aid-ink md:text-3xl"
            >
              Looks like {first_instance?.disease || "an urgent concern"}
            </h1>
            {first_instance?.accuracy ? (
              <span className="inline-flex items-center rounded-lg bg-aid-mist px-3 py-1.5 text-sm font-semibold text-aid-teal">
                {first_instance.accuracy} match
              </span>
            ) : null}
          </div>
          {medical_advice ? (
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-aid-muted md:text-lg">
              {medical_advice}
            </p>
          ) : null}
        </section>

        {instant_help?.length > 0 ? (
          <section
            aria-labelledby="help-heading"
            className="mt-5 animate-fade-up rounded-2xl border border-aid-line bg-white p-5 md:mt-6 md:p-7"
            style={{ animationDelay: "80ms" }}
          >
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-aid-seafoam">
                  Do this now
                </p>
                <h2
                  id="help-heading"
                  className="mt-1 font-quicksand text-xl font-bold text-aid-ink md:text-2xl"
                >
                  Advised help
                </h2>
              </div>
              <span className="text-sm text-aid-muted">
                {instant_help.length} steps
              </span>
            </div>

            <ol className="mt-5 space-y-0">
              {instant_help.map((item, index) => {
                const isLast = index === instant_help.length - 1;
                return (
                  <li key={`${item.step}-${index}`} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-aid-teal text-sm font-bold text-white">
                        {item.step}
                      </span>
                      {!isLast ? (
                        <span
                          aria-hidden="true"
                          className="my-1 w-px flex-1 bg-aid-line"
                        />
                      ) : null}
                    </div>
                    <p
                      className={`pb-5 text-base leading-relaxed text-aid-ink md:text-lg ${
                        isLast ? "pb-0" : ""
                      }`}
                    >
                      {item.info}
                    </p>
                  </li>
                );
              })}
            </ol>
          </section>
        ) : null}

        {symptoms_option?.length > 0 ? (
          <section
            aria-labelledby="symptoms-heading"
            className="mt-5 animate-fade-up rounded-2xl border border-aid-line bg-white p-5 md:mt-6 md:p-7"
            style={{ animationDelay: "140ms" }}
          >
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-aid-seafoam">
              Watch for
            </p>
            <h2
              id="symptoms-heading"
              className="mt-1 font-quicksand text-xl font-bold text-aid-ink md:text-2xl"
            >
              Other symptoms
            </h2>
            <p className="mt-1 text-sm text-aid-muted">
              These may help refine what you are seeing.
            </p>

            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {symptoms_option.map((item, index) => (
                <li
                  key={`${item.symptom}-${index}`}
                  className="rounded-xl border border-aid-line bg-aid-surface p-4"
                >
                  <p className="font-semibold text-aid-ink">{item.symptom}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-aid-muted">
                    {item.description}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className="mt-8 flex flex-col gap-5 border-t border-aid-line pt-6 md:mt-10">
          <button
            type="button"
            onClick={handleNewSearch}
            className="w-full rounded-xl bg-aid-teal px-6 py-3.5 text-base font-bold text-white transition-colors hover:bg-aid-teal-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aid-teal sm:w-auto"
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
