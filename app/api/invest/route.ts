import { NextRequest, NextResponse } from "next/server";
import { prepareTransactions, signAndSend, pollTransactionStatus } from "@/lib/brickken";

const CHAIN_ID = process.env.BRICKKEN_CHAIN_ID ?? "aa36a7";
const INVESTOR_ADDRESS = process.env.BRICKKEN_INVESTOR_ADDRESS ?? "";
const INVESTOR_PRIVATE_KEY = process.env.BRICKKEN_INVESTOR_PRIVATE_KEY ?? "";

export async function POST(request: NextRequest) {
  try {
    const { investorEmail, tokenSymbol, investmentAmount } = await request.json();

    if (!investorEmail || !tokenSymbol || !investmentAmount) {
      return NextResponse.json(
        { error: "investorEmail, tokenSymbol, and investmentAmount are required." },
        { status: 400 }
      );
    }

    if (!INVESTOR_ADDRESS || !INVESTOR_PRIVATE_KEY) {
      return NextResponse.json(
        {
          error:
            "BRICKKEN_INVESTOR_ADDRESS and BRICKKEN_INVESTOR_PRIVATE_KEY must be set in .env.local.",
        },
        { status: 500 }
      );
    }

    const prepared = await prepareTransactions({
      method: "newInvest",
      chainId: CHAIN_ID,
      tokenSymbol,
      investorEmail,
      investorAddress: INVESTOR_ADDRESS,
      investmentAmount,
      paymentTokenSymbol: "USDT",
    });

    const sent = await signAndSend(prepared, INVESTOR_PRIVATE_KEY);
    const finalStatus = await pollTransactionStatus(sent.txId, {
      intervalMs: 3000,
      timeoutMs: 45000,
    });

    return NextResponse.json({ txId: sent.txId, status: finalStatus });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
