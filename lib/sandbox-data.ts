import { Asset, Offering } from "@/types/domain";

/**
 * Sandbox/demo data only. This is not live blockchain data. It exists so
 * the UI has something to render before Brickken endpoints are wired in.
 * The UI must always make clear this is demo data, not a live position.
 */

export const ASSETS: Asset[] = [
  {
    id: "green-valley-farm",
    name: "Green Valley Farm",
    category: "agriculture",
    description:
      "An agricultural asset raising capital to expand irrigation and crop output. Investors may receive an agreed share of farm revenue.",
    valuationUsd: 100000,
    location: "Rivers State",
    documentationUrl: "#",
  },
  {
    id: "lagos-commercial-property",
    name: "Lagos Commercial Property",
    category: "property",
    description:
      "A commercial property offering. Investors may receive rental income and/or other defined returns.",
    valuationUsd: 2000000,
    location: "Lagos",
    documentationUrl: "#",
  },
  {
    id: "mv-atlantic",
    name: "MV Atlantic",
    category: "maritime",
    description:
      "A maritime vessel asset operated by an advanced Asset Agent under a defined RAMS mandate. Investors may receive a defined participation in vessel revenue.",
    valuationUsd: 5000000,
    location: "Atlantic route",
    documentationUrl: "#",
  },
  {
    id: "afrobeats-royalty-fund",
    name: "Afrobeats Royalty Fund",
    category: "music-royalties",
    description:
      "A royalty catalogue fund. Investors may receive a defined share of royalty income.",
    valuationUsd: 200000,
    documentationUrl: "#",
  },
];

export const OFFERINGS: Offering[] = [
  {
    id: "gvf-sto",
    assetId: "green-valley-farm",
    tokenSymbol: "GVF",
    raiseTargetUsd: 40000,
    raisedUsd: 37500,
    minInvestmentUsd: 100,
    maxInvestmentUsd: 5000,
    paymentToken: "Sandbox USDT",
    startDate: "2026-08-30",
    endDate: "2026-09-30",
    status: "funding",
  },
  {
    id: "lago-sto",
    assetId: "lagos-commercial-property",
    tokenSymbol: "LAGO",
    raiseTargetUsd: 500000,
    raisedUsd: 210000,
    minInvestmentUsd: 100,
    maxInvestmentUsd: 20000,
    paymentToken: "Sandbox USDT",
    startDate: "2026-08-15",
    endDate: "2026-10-15",
    status: "funding",
  },
  {
    id: "atl-sto",
    assetId: "mv-atlantic",
    tokenSymbol: "ATL",
    raiseTargetUsd: 1000000,
    raisedUsd: 640000,
    minInvestmentUsd: 250,
    maxInvestmentUsd: 50000,
    paymentToken: "Sandbox USDT",
    startDate: "2026-08-01",
    endDate: "2026-09-15",
    status: "funding",
  },
  {
    id: "afro-sto",
    assetId: "afrobeats-royalty-fund",
    tokenSymbol: "AFRO",
    raiseTargetUsd: 200000,
    raisedUsd: 200000,
    minInvestmentUsd: 50,
    maxInvestmentUsd: 10000,
    paymentToken: "Sandbox USDT",
    startDate: "2026-07-01",
    endDate: "2026-08-01",
    status: "active",
  },
];

export function getAssetWithOffering(assetId: string) {
  const asset = ASSETS.find((a) => a.id === assetId);
  const offering = OFFERINGS.find((o) => o.assetId === assetId);
  if (!asset || !offering) return null;
  return { asset, offering };
}

export const CATEGORY_LABELS: Record<Asset["category"], string> = {
  property: "Property",
  agriculture: "Agriculture",
  maritime: "Maritime",
  "music-royalties": "Music & Royalties",
  business: "Businesses",
  infrastructure: "Infrastructure",
  equipment: "Equipment",
  "private-credit": "Private Credit",
};
