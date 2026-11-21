import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-[1240px] flex-col items-start px-6 py-[var(--spacing-section-sm)]">
      <p className="font-mono-label text-[12px] text-flag">404</p>
      <h1 className="mt-3 font-display text-[clamp(28px,4vw,44px)] font-semibold tracking-tight">
        Nothing at this address.
      </h1>
      <Link href="/" className="link-draw mt-6 font-mono-label text-[12px] text-signal">
        ← Back home
      </Link>
    </div>
  );
}
