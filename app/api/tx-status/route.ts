import { NextRequest, NextResponse } from "next/server";
import { getTransactionStatus } from "@/lib/brickken";

export async function GET(request: NextRequest) {
  const txId = request.nextUrl.searchParams.get("txId");
  if (!txId) {
    return NextResponse.json({ error: "txId query param is required." }, { status: 400 });
  }

  try {
    const status = await getTransactionStatus(txId);
    return NextResponse.json(status);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
