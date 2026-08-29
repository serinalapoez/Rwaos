import { NextRequest, NextResponse } from "next/server";
import { prepareTransactions, BrickkenApiError } from "@/lib/brickken";

const CHAIN_ID = process.env.BRICKKEN_CHAIN_ID ?? "aa36a7";

export async function POST(request: NextRequest) {
  try {
    const { investorEmail, investorAddress, tokenSymbol } = await request.json();

    if (!investorEmail || !investorAddress || !tokenSymbol) {
      return NextResponse.json(
        { error: "investorEmail, investorAddress, and tokenSymbol are required." },
        { status: 400 }
      );
    }

    const prepared = await prepareTransactions({
      method: "claimTokens",
      chainId: CHAIN_ID,
      tokenSymbol,
      investorEmail,
      investorAddress,
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
