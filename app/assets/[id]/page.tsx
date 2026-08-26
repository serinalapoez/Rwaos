import Link from "next/link";
import { notFound } from "next/navigation";
import { getAssetWithOffering, CATEGORY_LABELS } from "@/lib/sandbox-data";

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function AssetDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const result = getAssetWithOffering(params.id);
  if (!result) return notFound();

  const { asset, offering } = result;
  const progress = Math.min(
    100,
    Math.round((offering.raisedUsd / offering.raiseTargetUsd) * 100)
  );

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/marketplace" className="text-sm text-rwaos-accent2">
        Back to marketplace
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <span className="rounded-full bg-rwaos-panel px-3 py-1 text-xs uppercase tracking-wide text-rwaos-muted">
          {CATEGORY_LABELS[asset.category]}
        </span>
        <span className="text-xs uppercase tracking-wide text-rwaos-accent">
          {offering.status}
        </span>
      </div>

      <h1 className="mt-4 text-3xl font-semibold text-rwaos-text">
        {asset.name}
      </h1>
      {asset.location && (
        <p className="mt-1 text-sm text-rwaos-muted">{asset.location}</p>
      )}
      <p className="mt-4 text-rwaos-text">{asset.description}</p>

      <div className="mt-8 rounded-xl border border-rwaos-border bg-rwaos-panel p-6">
        <h2 className="text-lg font-semibold text-rwaos-text">
          Offering terms
        </h2>

        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-rwaos-bg">
          <div
            className="h-full rounded-full bg-rwaos-accent"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-rwaos-muted">
          {formatUsd(offering.raisedUsd)} raised of{" "}
          {formatUsd(offering.raiseTargetUsd)} target ({progress}%)
        </p>

        <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-rwaos-muted">Token symbol</dt>
            <dd className="text-rwaos-text">{offering.tokenSymbol}</dd>
          </div>
          <div>
            <dt className="text-rwaos-muted">Payment token</dt>
            <dd className="text-rwaos-text">{offering.paymentToken}</dd>
          </div>
          <div>
            <dt className="text-rwaos-muted">Minimum investment</dt>
            <dd className="text-rwaos-text">
              {formatUsd(offering.minInvestmentUsd)}
            </dd>
          </div>
          <div>
            <dt className="text-rwaos-muted">Maximum investment</dt>
            <dd className="text-rwaos-text">
              {formatUsd(offering.maxInvestmentUsd)}
            </dd>
          </div>
          <div>
            <dt className="text-rwaos-muted">Offering opens</dt>
            <dd className="text-rwaos-text">{offering.startDate}</dd>
          </div>
          <div>
            <dt className="text-rwaos-muted">Offering closes</dt>
            <dd className="text-rwaos-text">{offering.endDate}</dd>
          </div>
        </dl>

        <Link
          href={`/invest/${asset.id}`}
          className="mt-6 block rounded-lg bg-rwaos-accent2 px-4 py-2 text-center font-medium text-rwaos-bg"
        >
          Invest in this offering
        </Link>
        <p className="mt-3 text-xs text-rwaos-muted">
          This is a sandbox demo. No live funds or live tokens are involved.
        </p>
      </div>
    </main>
  );
}
