import { NextRequest } from "next/server";

/**
 * Every route that triggers a Brickken sandbox transaction checks this
 * before doing anything else. RWAOS_OPERATOR_TOKEN is a value only the
 * demo operator knows, set once as a server environment variable and
 * entered once into the app's UI (stored locally on that device, sent
 * as a header on each write request). It is never bundled into the
 * client JavaScript, so it cannot be read off the deployed page.
 */
export function isAuthorizedOperator(request: NextRequest): boolean {
  const expected = process.env.RWAOS_OPERATOR_TOKEN ?? "";
  if (!expected) return false;
  const provided = request.headers.get("x-operator-token") ?? "";
  return provided === expected;
}
