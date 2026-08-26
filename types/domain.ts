export type AssetCategory =
  | "property"
  | "agriculture"
  | "maritime"
  | "music-royalties"
  | "business"
  | "infrastructure"
  | "equipment"
  | "private-credit";

export type OfferingStatus = "draft" | "funding" | "active" | "closed";

export interface Asset {
  id: string;
  name: string;
  category: AssetCategory;
  description: string;
  valuationUsd: number;
  location?: string;
  documentationUrl?: string;
}

export interface Offering {
  id: string;
  assetId: string;
  tokenSymbol: string;
  raiseTargetUsd: number;
  raisedUsd: number;
  minInvestmentUsd: number;
  maxInvestmentUsd: number;
  paymentToken: string;
  startDate: string;
  endDate: string;
  status: OfferingStatus;
}

export type KycStatus = "not_started" | "pending" | "verified" | "rejected";
export type WhitelistStatus = "not_whitelisted" | "whitelisted";

export interface Investor {
  id: string;
  walletAddress: string | null;
  kycStatus: KycStatus;
  whitelistStatus: WhitelistStatus;
}

export interface Investment {
  id: string;
  offeringId: string;
  investorId: string;
  amountUsd: number;
  tokenAmount: number;
  status: "pending" | "confirmed" | "failed";
  transactionHash?: string;
}

export type AgentRole = "marketplace" | "investor" | "issuer" | "asset";
export type AgentStatus = "active" | "frozen" | "revoked";

export interface RamsPermission {
  action: string;
  allowed: boolean;
  maxAmountUsd?: number;
}

export interface Agent {
  id: string;
  role: AgentRole;
  erc8004Identity: string;
  walletAddress: string;
  status: AgentStatus;
  permissions: RamsPermission[];
}

export interface AgentActivityLogEntry {
  id: string;
  agentId: string;
  timestamp: string;
  action: string;
  outcome: "approved" | "rejected" | "executed";
  reason?: string;
}
