import Link from "next/link";

const LINKS = [
  { href: "/#experience", label: "Experience" },
  { href: "/#work", label: "Projects" },
  { href: "/writing", label: "Writing" },
  { href: "/#contact", label: "Contact" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-mono-label text-[13px] text-ink hover:text-signal focus-visible:text-signal"
        >
          Rudra Dave
        </Link>
        <nav className="flex gap-6">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-mono-label text-[12px] text-ink-muted transition-colors hover:text-signal focus-visible:text-signal"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
