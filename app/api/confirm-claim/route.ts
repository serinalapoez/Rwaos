import { NextRequest, NextResponse } from "next/server";
import { confirmClientBroadcast, pollTransactionStatus, BrickkenApiError } from "@/lib/brickken";

export async function POST(request: NextRequest) {
  try {
    const { txId, txHash } = await request.json();

    if (!txId || !txHash) {
      return NextResponse.json({ error: "txId and txHash are required." }, { status: 400 });
    }

    await confirmClientBroadcast(txId, txHash);
    const finalStatus = await pollTransactionStatus(txId, {
      intervalMs: 3000,
      timeoutMs: 120000,
    });

    return NextResponse.json({ txId, status: finalStatus });
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
