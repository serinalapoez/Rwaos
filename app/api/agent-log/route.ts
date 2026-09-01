import { NextResponse } from "next/server";
import { getAgentDefinitions, getAgentLog } from "@/lib/rams";

export async function GET() {
  return NextResponse.json({
    agents: getAgentDefinitions(),
    log: await getAgentLog(),
  });
}
