import { NextRequest, NextResponse } from "next/server";
import { prepareTransactions, signAndSend, pollTransactionStatus } from "@/lib/brickken";

const CHAIN_ID = process.env.BRICKKEN_CHAIN_ID ?? "aa36a7";
const SIGNER_ADDRESS = process.env.BRICKKEN_SIGNER_ADDRESS ?? "";
const SIGNER_PRIVATE_KEY = process.env.BRICKKEN_SIGNER_PRIVATE_KEY ?? "";

export async function POST(request: NextRequest) {
  try {
    const { investorAddress, investorEmail, tokenSymbol } = await request.json();

    if (!investorAddress || !investorEmail || !tokenSymbol) {
      return NextResponse.json(
        { error: "investorAddress, investorEmail, and tokenSymbol are required." },
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
      method: "whitelist",
      signerAddress: SIGNER_ADDRESS,
      chainId: CHAIN_ID,
      tokenSymbol,
      userToWhitelist: [
        {
          investorAddress,
          investorEmail,
          whitelistStatus: true,
        },
      ],
    });

    const sent = await signAndSend(prepared, SIGNER_PRIVATE_KEY);
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
