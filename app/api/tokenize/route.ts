import { NextRequest, NextResponse } from "next/server";
import { prepareTransactions, signAndSend, pollTransactionStatus, BrickkenApiError } from "@/lib/brickken";
import { checkAgentPermission, addAgentLogEntry } from "@/lib/rams";
import { isAuthorizedOperator } from "@/lib/auth";

const CHAIN_ID = process.env.BRICKKEN_CHAIN_ID ?? "aa36a7";
const SIGNER_ADDRESS = process.env.BRICKKEN_SIGNER_ADDRESS ?? "";
const SIGNER_PRIVATE_KEY = process.env.BRICKKEN_SIGNER_PRIVATE_KEY ?? "";

export async function POST(request: NextRequest) {
  if (!isAuthorizedOperator(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { tokenizerEmail, name, tokenSymbol, tokenType, supplyCap, url } =
      await request.json();

    if (!tokenizerEmail || !name || !tokenSymbol) {
      return NextResponse.json(
        { error: "tokenizerEmail, name, and tokenSymbol are required." },
        { status: 400 }
      );
    }

    const permission = checkAgentPermission("issuer-agent", "newTokenization", {
      tokenSymbol,
    });

    addAgentLogEntry({
      agentId: "issuer-agent",
      action: "newTokenization",
      outcome: permission.allowed ? "approved" : "rejected",
      reason: permission.reason,
    });

    if (!permission.allowed) {
      return NextResponse.json({ error: permission.reason }, { status: 403 });
    }

    if (!SIGNER_ADDRESS || !SIGNER_PRIVATE_KEY) {
      return NextResponse.json(
        {
          error:
            "BRICKKEN_SIGNER_ADDRESS and BRICKKEN_SIGNER_PRIVATE_KEY must be set in .env.local.",
        },
        { status: 500 }
      );
    }

    const prepared = await prepareTransactions({
      method: "newTokenization",
      signerAddress: SIGNER_ADDRESS,
      chainId: CHAIN_ID,
      tokenizerEmail,
      name,
      tokenSymbol,
      tokenType: tokenType || "RWA_TOKEN",
      supplyCap: supplyCap || "1000000",
      url: url || "",
    });

    const sent = await signAndSend(prepared, SIGNER_PRIVATE_KEY);
    const finalStatus = await pollTransactionStatus(sent.txId, {
      intervalMs: 3000,
      timeoutMs: 45000,
    });

    addAgentLogEntry({
      agentId: "issuer-agent",
      action: "newTokenization",
      outcome: "executed",
      reason: `Transaction ${sent.txId} reached status ${finalStatus.status}.`,
    });

    return NextResponse.json({ txId: sent.txId, status: finalStatus });
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
