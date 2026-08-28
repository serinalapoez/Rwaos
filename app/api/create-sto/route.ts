import { NextRequest, NextResponse } from "next/server";
import { prepareTransactions, signAndSend, pollTransactionStatus, BrickkenApiError } from "@/lib/brickken";
import { isAuthorizedOperator } from "@/lib/auth";

const CHAIN_ID = process.env.BRICKKEN_CHAIN_ID ?? "aa36a7";
const SIGNER_ADDRESS = process.env.BRICKKEN_SIGNER_ADDRESS ?? "";
const SIGNER_PRIVATE_KEY = process.env.BRICKKEN_SIGNER_PRIVATE_KEY ?? "";

export async function POST(request: NextRequest) {
  if (!isAuthorizedOperator(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const {
      tokenizerEmail,
      tokenSymbol,
      tokenAmount,
      offeringName,
      startDate,
      endDate,
      acceptedCoin,
      minRaiseUSD,
      maxRaiseUSD,
      minInvestment,
      maxInvestment,
    } = await request.json();

    if (!tokenizerEmail || !tokenSymbol || !offeringName) {
      return NextResponse.json(
        { error: "tokenizerEmail, tokenSymbol, and offeringName are required." },
        { status: 400 }
      );
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
      method: "newSto",
      signerAddress: SIGNER_ADDRESS,
      chainId: CHAIN_ID,
      tokenizerEmail,
      tokenSymbol,
      tokenAmount,
      offeringName,
      startDate,
      endDate,
      acceptedCoin: acceptedCoin || "USDT",
      minRaiseUSD,
      maxRaiseUSD,
      minInvestment,
      maxInvestment,
    });

    const sent = await signAndSend(prepared, SIGNER_PRIVATE_KEY);
    const finalStatus = await pollTransactionStatus(sent.txId, {
      intervalMs: 3000,
      timeoutMs: 120000,
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