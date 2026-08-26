import Link from "next/link";
import { ASSETS, OFFERINGS, CATEGORY_LABELS } from "@/lib/sandbox-data";
import { AssetCard } from "@/components/AssetCard";
import { AssetCategory } from "@/types/domain";

export default function MarketplacePage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const activeCategory = searchParams.category as AssetCategory | undefined;

  const visibleAssets = activeCategory
    ? ASSETS.filter((asset) => asset.category === activeCategory)
    : ASSETS;

  const categories = Object.keys(CATEGORY_LABELS) as AssetCategory[];

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8">
        <span className="rounded-full border border-rwaos-border px-3 py-1 text-xs uppercase tracking-widest text-rwaos-muted">
          Sandbox environment
        </span>
        <h1 className="mt-4 text-3xl font-semibold text-rwaos-text">
          Marketplace
        </h1>
        <p className="mt-2 text-rwaos-muted">
          Browse tokenized Real World Assets available for investment.
        </p>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href="/marketplace"
          className={`rounded-full border px-3 py-1 text-sm ${
            !activeCategory
              ? "border-rwaos-accent2 text-rwaos-accent2"
              : "border-rwaos-border text-rwaos-muted"
          }`}
        >
          All
        </Link>
        {categories.map((category) => (
          <Link
            key={category}
            href={`/marketplace?category=${category}`}
            className={`rounded-full border px-3 py-1 text-sm ${
              activeCategory === category
                ? "border-rwaos-accent2 text-rwaos-accent2"
                : "border-rwaos-border text-rwaos-muted"
            }`}
          >
            {CATEGORY_LABELS[category]}
          </Link>
        ))}
      </div>

      {visibleAssets.length === 0 ? (
        <p className="text-rwaos-muted">
          No assets in this category yet.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleAssets.map((asset) => {
            const offering = OFFERINGS.find((o) => o.assetId === asset.id);
            if (!offering) return null;
            return (
              <AssetCard key={asset.id} asset={asset} offering={offering} />
            );
          })}
        </div>
      )}
    </main>
  );
}
