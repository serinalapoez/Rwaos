import { Asset, Offering } from "@/types/domain";

/**
 * Sandbox/demo data only. Asset valuations reflect a plausible appraisal of
 * the underlying physical asset and are descriptive only. Offering amounts
 * (raiseTargetUsd, raisedUsd, min/max investment) are deliberately small,
 * because they are meant to be produced by genuine Brickken sandbox test
 * USDT transactions, not a fictional headline figure.
 */

export const ASSETS: Asset[] = [
  {
    id: "origin-farms",
    name: "Origin Farms, Rivers State",
    category: "agriculture",
    description:
      "A cassava and plantain farm raising capital to expand irrigation and processing capacity. Investors may receive an agreed share of farm revenue.",
    valuationUsd: 100000,
    location: "Rivers State",
    documentationUrl: "#",
  },
  {
    id: "five-star-hotel-lagos",
    name: "Five Star Hotel, Lagos",
    category: "property",
    description:
      "A commercial hotel property offering. Investors may receive a share of room and event revenue.",
    valuationUsd: 2000000,
    location: "Lagos",
    documentationUrl: "#",
  },
  {
    id: "mv-bonny-trader",
    name: "MV Bonny Trader",
    category: "maritime",
    description:
      "A cargo vessel operating out of Bonny Island, run by an Asset Agent under a defined RAMS mandate. Investors may receive a defined participation in freight revenue.",
    valuationUsd: 5000000,
    location: "Bonny Island",
    documentationUrl: "#",
  },
  {
    id: "sabi-sounds-royalty-fund",
    name: "Sabi Sounds Royalty Fund",
    category: "music-royalties",
    description:
      "A catalogue of streaming and licensing royalties. Investors may receive a defined share of royalty income.",
    valuationUsd: 200000,
    documentationUrl: "#",
  },
];

export const OFFERINGS: Offering[] = [
  {
    id: "orgn-sto",
    assetId: "origin-farms",
    tokenSymbol: "ORGN",
    raiseTargetUsd: 2000,
    raisedUsd: 1500,
    minInvestmentUsd: 10,
    maxInvestmentUsd: 200,
    paymentToken: "Sandbox USDT",
    startDate: "2026-08-30",
    endDate: "2026-09-30",
    status: "funding",
  },
  {
    id: "fshl-sto",
    assetId: "five-star-hotel-lagos",
    tokenSymbol: "FSHL",
    raiseTargetUsd: 5000,
    raisedUsd: 1800,
    minInvestmentUsd: 20,
    maxInvestmentUsd: 500,
    paymentToken: "Sandbox USDT",
    startDate: "2026-08-15",
    endDate: "2026-10-15",
    status: "funding",
  },
  {
    id: "bntr-sto",
    assetId: "mv-bonny-trader",
    tokenSymbol: "BNTR",
    raiseTargetUsd: 8000,
    raisedUsd: 4200,
    minInvestmentUsd: 50,
    maxInvestmentUsd: 1000,
    paymentToken: "Sandbox USDT",
    startDate: "2026-08-01",
    endDate: "2026-09-15",
    status: "funding",
  },
  {
    id: "sabi-sto",
    assetId: "sabi-sounds-royalty-fund",
    tokenSymbol: "SABI",
    raiseTargetUsd: 3000,
    raisedUsd: 3000,
    minInvestmentUsd: 10,
    maxInvestmentUsd: 300,
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
