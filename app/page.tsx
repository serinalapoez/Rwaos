export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="rounded-full border border-rwaos-border px-3 py-1 text-xs uppercase tracking-widest text-rwaos-muted">
        Sandbox environment
      </span>
      <h1 className="text-4xl font-semibold text-rwaos-text">RWAOS</h1>
      <p className="max-w-xl text-rwaos-muted">
        Tokenize Real World Assets. Fund them. Operate them onchain.
      </p>
      <p className="text-sm text-rwaos-muted">
        Marketplace, issuer dashboard, investor dashboard, and agent panel
        will be scaffolded next.
      </p>
    </main>
  );
}
