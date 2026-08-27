import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-rwaos-border">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-serif text-xl text-rwaos-text">RWAOS</span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-rwaos-muted">
            sandbox
          </span>
        </Link>
        <nav className="flex gap-6 text-sm text-rwaos-muted">
          <Link href="/marketplace" className="hover:text-rwaos-text">
            Marketplace
          </Link>
          <Link href="/issuer" className="hover:text-rwaos-text">
            Issuer
          </Link>
          <Link href="/onboard" className="hover:text-rwaos-text">
            Onboard
          </Link>
        </nav>
      </div>
    </header>
  );
}
