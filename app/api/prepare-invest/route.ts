import { NextRequest, NextResponse } from "next/server";
import { prepareTransactions, BrickkenApiError } from "@/lib/brickken";
import { checkAgentPermission, addAgentLogEntry } from "@/lib/rams";

const CHAIN_ID = process.env.BRICKKEN_CHAIN_ID ?? "aa36a7";

/**
 * This route does not sign or send anything. It only asks Brickken to
 * prepare the transaction, then hands the raw, unsigned transaction back
 * to the browser, where the investor's own connected wallet signs and
 * broadcasts it. No operator credential is required, since this never
 * spends funds this server controls.
 */
export async function POST(request: NextRequest) {
  try {
    const { investorEmail, investorAddress, tokenSymbol, investmentAmount } =
      await request.json();

    if (!investorEmail || !investorAddress || !tokenSymbol || !investmentAmount) {
      return NextResponse.json(
        {
          error:
            "investorEmail, investorAddress, tokenSymbol, and investmentAmount are required.",
        },
        { status: 400 }
      );
    }

    const permission = checkAgentPermission("investor-agent", "newInvest", {
      amountUsd: Number(investmentAmount),
      tokenSymbol,
    });

    await addAgentLogEntry({
      agentId: "investor-agent",
      action: "newInvest (wallet connect)",
      outcome: permission.allowed ? "approved" : "rejected",
      reason: permission.reason,
    });

    if (!permission.allowed) {
      return NextResponse.json({ error: permission.reason }, { status: 403 });
    }

    const prepared = await prepareTransactions({
      method: "newInvest",
      chainId: CHAIN_ID,
      tokenSymbol,
      investorEmail,
      investorAddress,
      investmentAmount,
      paymentTokenSymbol: "USDT",
      executionMode: "client-broadcast",
    });

    return NextResponse.json(prepared);
  } catch (error) {
    if (error instanceof BrickkenApiError) {
      return NextResponse.json(
        { error: error.message, details: error.details },
        { status: error.status }
      );
    }
    const message = error instanceof Error ? error.message : "Unknown error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
