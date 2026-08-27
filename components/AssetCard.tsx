import Link from "next/link";
import { Asset, Offering } from "@/types/domain";
import { CATEGORY_LABELS } from "@/lib/sandbox-data";
import { CategoryStamp } from "@/components/CategoryStamp";

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function AssetCard({
  asset,
  offering,
}: {
  asset: Asset;
  offering: Offering;
}) {
  const progress = Math.min(
    100,
    Math.round((offering.raisedUsd / offering.raiseTargetUsd) * 100)
  );

  return (
    <Link
      href={`/assets/${asset.id}`}
      className="block rounded-lg border border-rwaos-border bg-rwaos-panel p-5 transition hover:border-rwaos-accent2"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CategoryStamp category={asset.category} />
          <span className="font-mono text-xs uppercase tracking-wide text-rwaos-muted">
            {CATEGORY_LABELS[asset.category]}
          </span>
        </div>
        <span className="font-mono text-xs uppercase tracking-wide text-rwaos-accent">
          {offering.status}
        </span>
      </div>

      <h3 className="mt-4 font-serif text-lg text-rwaos-text">
        {asset.name}
      </h3>
      <p className="mt-1 line-clamp-2 text-sm text-rwaos-muted">
        {asset.description}
      </p>

      <div className="mt-4">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-rwaos-bg">
          <div
            className="h-full rounded-full bg-rwaos-accent"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between font-mono text-xs text-rwaos-muted">
          <span>{formatUsd(offering.raisedUsd)} raised</span>
          <span>{progress}% of {formatUsd(offering.raiseTargetUsd)}</span>
        </div>
      </div>
    </Link>
  );
}
