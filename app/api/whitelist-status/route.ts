import { NextRequest, NextResponse } from "next/server";
import { getWhitelistStatus } from "@/lib/brickken";

const CHAIN_ID = process.env.BRICKKEN_CHAIN_ID ?? "aa36a7";

export async function GET(request: NextRequest) {
  const investorAddress = request.nextUrl.searchParams.get("investorAddress");
  const tokenSymbol = request.nextUrl.searchParams.get("tokenSymbol");

  if (!investorAddress || !tokenSymbol) {
    return NextResponse.json(
      { error: "investorAddress and tokenSymbol query params are required." },
      { status: 400 }
    );
  }

  try {
    const result = await getWhitelistStatus(CHAIN_ID, tokenSymbol, investorAddress);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
