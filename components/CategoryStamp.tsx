import { AssetCategory } from "@/types/domain";

const CATEGORY_MARK: Record<AssetCategory, string> = {
  property: "P",
  agriculture: "A",
  maritime: "M",
  "music-royalties": "R",
  business: "B",
  infrastructure: "I",
  equipment: "E",
  "private-credit": "C",
};

export function CategoryStamp({ category }: { category: AssetCategory }) {
  return (
    <span
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-rwaos-accent font-serif text-sm text-rwaos-accent"
      aria-hidden="true"
    >
      {CATEGORY_MARK[category]}
    </span>
  );
}
