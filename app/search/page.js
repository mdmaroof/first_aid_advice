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
    <main className="page-blobs relative min-h-dvh w-full overflow-y-auto bg-aid-page text-aid-ink">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.4),transparent_35%)]" />

      <div className="relative z-10 mx-auto max-w-2xl px-4 py-5 md:px-6 md:py-8">
        <header className="glass mb-5 flex items-center justify-between gap-3 rounded-2xl px-4 py-3 md:px-5">
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

        <article className="glass-strong rounded-[1.75rem] px-5 py-6 md:px-8 md:py-8">
          <h1 className="font-quicksand text-[1.75rem] font-bold leading-tight tracking-tight text-aid-ink md:text-4xl">
            {first_instance?.disease || "Urgent concern"}
          </h1>

          {first_instance?.accuracy ? (
            <p className="mt-2 text-sm text-aid-muted md:text-base">
              Roughly {first_instance.accuracy} likely — treat this as guidance,
              not a diagnosis.
            </p>
          ) : null}

          {medical_advice ? (
            <p className="mt-5 max-w-prose text-base leading-relaxed text-aid-ink/85 md:text-lg">
              {medical_advice}
            </p>
          ) : null}

          {instant_help?.length > 0 ? (
            <section aria-labelledby="help-heading" className="mt-8">
              <h2
                id="help-heading"
                className="font-quicksand text-lg font-bold text-aid-ink md:text-xl"
              >
                What to do
              </h2>
              <ol className="mt-4 space-y-4">
                {instant_help.map((item, index) => (
                  <li
                    key={`${item.step}-${index}`}
                    className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1"
                  >
                    <span className="pt-0.5 font-quicksand text-sm font-bold text-aid-teal">
                      {String(item.step).padStart(2, "0")}
                    </span>
                    <p className="text-base leading-relaxed text-aid-ink md:text-lg">
                      {item.info}
                    </p>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          {symptoms_option?.length > 0 ? (
            <section aria-labelledby="symptoms-heading" className="mt-9">
              <h2
                id="symptoms-heading"
                className="font-quicksand text-lg font-bold text-aid-ink md:text-xl"
              >
                Also look for
              </h2>
              <dl className="mt-4 space-y-4 border-t border-aid-ink/10 pt-4">
                {symptoms_option.map((item, index) => (
                  <div key={`${item.symptom}-${index}`}>
                    <dt className="font-semibold text-aid-ink">
                      {item.symptom}
                    </dt>
                    <dd className="mt-1 text-sm leading-relaxed text-aid-muted md:text-base">
                      {item.description}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}

          <div className="mt-9 flex flex-col gap-4 border-t border-aid-ink/10 pt-6">
            <button
              type="button"
              onClick={handleNewSearch}
              className="w-fit rounded-2xl bg-aid-ink px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-aid-ink/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aid-ink md:text-base"
            >
              Search new symptoms
            </button>
            <MedicalDisclaimer />
          </div>
        </article>
      </div>
    </main>
  );
};

export default SearchPage;
