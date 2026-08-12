import Link from "next/link";

export const metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main className="page-blobs relative flex min-h-dvh w-full flex-col items-center justify-center text-aid-ink">
      <div className="safe-content relative z-10 flex max-w-lg flex-col items-center gap-5 py-10 text-center">
        <p className="text-sm font-semibold text-aid-teal">404</p>
        <h1 className="font-quicksand text-2xl font-bold tracking-tight">
          Page not found
        </h1>
        <p className="text-aid-ink/75">
          That link doesn’t exist. Head home for first-aid guidance — or call
          emergency services if someone is in danger.
        </p>
        <Link
          href="/"
          className="rounded-2xl bg-aid-ink px-5 py-2.5 text-sm font-bold text-white hover:bg-aid-ink/90"
        >
          Back to SnapAid
        </Link>
      </div>
    </main>
  );
}
