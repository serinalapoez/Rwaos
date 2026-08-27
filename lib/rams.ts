/**
 * A minimal RAMS-style permission layer. Each agent has a defined set of
 * actions it may take and, where relevant, a bound on how far it can act
 * without a human raising the limit. This is enforced in the API routes
 * before any Brickken call is made, so a rejected action never reaches
 * the sandbox.
 *
 * The activity log is in-memory and resets when the dev server restarts.
 * That is fine for a demo; a production deployment would persist this.
 */

export type AgentId = "issuer-agent" | "investor-agent";

export type AgentPermission = {
  action: string;
  allowed: boolean;
  maxAmountUsd?: number;
  allowedTokenSymbols?: string[];
};

export type AgentDefinition = {
  id: AgentId;
  role: "issuer" | "investor";
  erc8004Identity: string;
  walletAddress: string;
  permissions: AgentPermission[];
};

const ALLOWED_TOKEN_SYMBOLS = ["ORGN", "FSHL", "BNTR", "SABI"];

export function getAgentDefinitions(): AgentDefinition[] {
  return [
    {
      id: "issuer-agent",
      role: "issuer",
      erc8004Identity: "did:erc8004:sepolia:rwaos-issuer-agent",
      walletAddress: process.env.BRICKKEN_SIGNER_ADDRESS ?? "not set",
      permissions: [
        {
          action: "newTokenization",
          allowed: true,
          allowedTokenSymbols: ALLOWED_TOKEN_SYMBOLS,
        },
        {
          action: "newSto",
          allowed: true,
          allowedTokenSymbols: ALLOWED_TOKEN_SYMBOLS,
        },
      ],
    },
    {
      id: "investor-agent",
      role: "investor",
      erc8004Identity: "did:erc8004:sepolia:rwaos-investor-agent",
      walletAddress: process.env.BRICKKEN_INVESTOR_ADDRESS ?? "not set",
      permissions: [
        {
          action: "newInvest",
          allowed: true,
          maxAmountUsd: 500,
        },
        {
          action: "claimTokens",
          allowed: true,
        },
      ],
    },
  ];
}

export type PermissionCheckResult = {
  allowed: boolean;
  reason: string;
};

export function checkAgentPermission(
  agentId: AgentId,
  action: string,
  context: { amountUsd?: number; tokenSymbol?: string } = {}
): PermissionCheckResult {
  const agent = getAgentDefinitions().find((a) => a.id === agentId);
  if (!agent) {
    return { allowed: false, reason: `Unknown agent: ${agentId}.` };
  }

  const permission = agent.permissions.find((p) => p.action === action);
  if (!permission || !permission.allowed) {
    return {
      allowed: false,
      reason: `${agentId} has no permission for ${action} under its current RAMS mandate.`,
    };
  }

  if (
    permission.allowedTokenSymbols &&
    context.tokenSymbol &&
    !permission.allowedTokenSymbols.includes(context.tokenSymbol)
  ) {
    return {
      allowed: false,
      reason: `${context.tokenSymbol} is not in ${agentId}'s approved symbol list.`,
    };
  }

  if (
    permission.maxAmountUsd !== undefined &&
    context.amountUsd !== undefined &&
    context.amountUsd > permission.maxAmountUsd
  ) {
    return {
      allowed: false,
      reason: `Amount ${context.amountUsd} exceeds ${agentId}'s autonomous limit of ${permission.maxAmountUsd} for ${action}.`,
    };
  }

  return { allowed: true, reason: "Within RAMS mandate." };
}

export type AgentLogEntry = {
  id: string;
  timestamp: string;
  agentId: AgentId;
  action: string;
  outcome: "approved" | "rejected" | "executed";
  reason: string;
};

const activityLog: AgentLogEntry[] = [];

export function addAgentLogEntry(entry: Omit<AgentLogEntry, "id" | "timestamp">) {
  activityLog.unshift({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
    ...entry,
  });
  if (activityLog.length > 50) activityLog.length = 50;
}

export function getAgentLog(): AgentLogEntry[] {
  return activityLog;
}
