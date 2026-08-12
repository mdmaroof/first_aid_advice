import { BrandMark } from "./BrandMark";

export function AppShell({ audience, actions, children }) {
  return (
    <main className="page-blobs relative min-h-dvh overflow-x-hidden text-aid-ink">
      <div className="safe-content relative z-10 mx-auto w-full max-w-6xl">
        <header className="glass sticky top-3 z-30 flex items-center justify-between gap-4 rounded-2xl px-4 py-3 md:px-5">
          <BrandMark compact />
          <div className="flex items-center gap-2">
            <span className="hidden rounded-full bg-aid-teal/10 px-3 py-1.5 text-xs font-bold text-aid-teal sm:inline-flex">
              {audience}
            </span>
            {actions}
          </div>
        </header>
        {children}
      </div>
    </main>
  );
}
