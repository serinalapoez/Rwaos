import Link from "next/link";
import { ASSETS, OFFERINGS, CATEGORY_LABELS } from "@/lib/sandbox-data";
import { CategoryStamp } from "@/components/CategoryStamp";

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function HomePage() {
  const totalRaised = OFFERINGS.reduce((sum, o) => sum + o.raisedUsd, 0);
  const openOfferings = OFFERINGS.filter((o) => o.status === "funding").length;

  return (
    <main>
      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="font-mono text-xs uppercase tracking-widest text-rwaos-accent">
          Build with Brickken - sandbox environment
        </p>
        <h1 className="mt-4 max-w-2xl font-serif text-5xl leading-tight text-rwaos-text">
          Real World Assets, tokenized and funded onchain.
        </h1>
        <p className="mt-5 max-w-xl text-rwaos-muted">
          Farms, hotels, cargo vessels, and royalty catalogues, tokenized
          directly through Brickken's sandbox. Every offering below is funded
          with Brickken sandbox test USDT through genuine prepare, sign, and
          send transactions, not simulated numbers.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/marketplace"
            className="rounded-lg bg-rwaos-accent2 px-5 py-2.5 font-medium text-rwaos-bg"
          >
            Browse the marketplace
          </Link>
          <Link
            href="/issuer"
            className="rounded-lg border border-rwaos-border px-5 py-2.5 font-medium text-rwaos-text"
          >
            Tokenize an asset
          </Link>
        </div>

        <dl className="mt-14 grid grid-cols-3 gap-6 border-t border-rwaos-border pt-8 font-mono">
          <div>
            <dt className="text-xs uppercase tracking-widest text-rwaos-muted">
              Assets tokenized
            </dt>
            <dd className="mt-1 text-2xl text-rwaos-text">{ASSETS.length}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-widest text-rwaos-muted">
              Sandbox USDT raised
            </dt>
            <dd className="mt-1 text-2xl text-rwaos-text">
              {formatUsd(totalRaised)}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-widest text-rwaos-muted">
              Open offerings
            </dt>
            <dd className="mt-1 text-2xl text-rwaos-text">{openOfferings}</dd>
          </div>
        </dl>
        <p className="mt-3 font-mono text-xs text-rwaos-muted">
          All amounts are Brickken sandbox test USDT, with no monetary value.
        </p>
      </section>

      <section className="border-t border-rwaos-border bg-rwaos-panel">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <h2 className="font-serif text-2xl text-rwaos-text">
            Assets in this sandbox
          </h2>
          <p className="mt-2 text-sm text-rwaos-muted">
            Four assets, each tokenized and offered directly through
            Brickken's Dapp API.
          </p>

          <div className="mt-8 divide-y divide-rwaos-border border-y border-rwaos-border">
            {ASSETS.map((asset) => {
              const offering = OFFERINGS.find((o) => o.assetId === asset.id);
              return (
                <Link
                  key={asset.id}
                  href={`/assets/${asset.id}`}
                  className="flex items-center gap-4 py-4 hover:bg-rwaos-bg/40"
                >
                  <CategoryStamp category={asset.category} />
                  <div className="flex-1">
                    <p className="text-rwaos-text">{asset.name}</p>
                    <p className="font-mono text-xs text-rwaos-muted">
                      {CATEGORY_LABELS[asset.category]}
                      {offering ? ` - ${offering.tokenSymbol}` : ""}
                    </p>
                  </div>
                  {offering && (
                    <p className="font-mono text-sm text-rwaos-muted">
                      {formatUsd(offering.raisedUsd)} raised
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
