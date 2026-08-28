import { NextRequest, NextResponse } from "next/server";
import { getStos } from "@/lib/brickken";

export async function GET(request: NextRequest) {
  const tokenSymbol = request.nextUrl.searchParams.get("tokenSymbol");
  const chainId = request.nextUrl.searchParams.get("chainId") ?? "aa36a7";

  if (!tokenSymbol) {
    return NextResponse.json({ error: "tokenSymbol query param is required." }, { status: 400 });
  }

  try {
    const result = await getStos(chainId, tokenSymbol);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
