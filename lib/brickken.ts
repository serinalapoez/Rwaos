/**
 * Server-side Brickken sandbox API client.
 *
 * This follows Brickken's own lifecycle:
 * 1. POST /prepare-transactions with a method field. Returns unsigned
 *    transactions and a txId.
 * 2. Sign each returned transaction locally with the wallet matching
 *    signerAddress. That wallet must already be whitelisted by Brickken
 *    and funded with native gas on the target chain.
 * 3. POST /send-transactions with { txId, signedTransactions }.
 * 4. Poll GET /get-transaction-status until it confirms.
 *
 * This file must only run on the server. It never sends the private key
 * to the browser, and BRICKKEN_SIGNER_PRIVATE_KEY must never be logged,
 * committed, or transmitted to any Brickken endpoint. Only the signed
 * transaction bytes are sent.
 */

import { Wallet } from "ethers";

const BASE_URL = process.env.BRICKKEN_API_BASE_URL ?? "https://api.sandbox.brickken.com";
const API_KEY = process.env.BRICKKEN_API_KEY ?? "";

export class BrickkenApiError extends Error {
  status: number;
  details: unknown;

  constructor(message: string, status: number, details: unknown) {
    super(message);
    this.name = "BrickkenApiError";
    this.status = status;
    this.details = details;
  }
}

type PreparedTransaction = {
  from: string;
  to: string;
  value: string;
  nonce: number;
  chainId: number;
  data: string;
  type: number;
  maxPriorityFeePerGas: string;
  maxFeePerGas: string;
  gasLimit: string;
};

export type PrepareTransactionsResponse = {
  transactions: PreparedTransaction[];
  txId: string;
  info?: Record<string, unknown>;
};

export type TransactionStatusResponse = {
  txId: string;
  status: "pending" | "confirmed" | "failed" | string;
  txHash?: string;
  [key: string]: unknown;
};

async function brickkenFetch<TResponse>(
  path: string,
  init: { method?: "GET" | "POST"; body?: unknown } = {}
): Promise<TResponse> {
  if (!API_KEY) {
    throw new BrickkenApiError(
      "BRICKKEN_API_KEY is not set. Add it to .env.local.",
      500,
      null
    );
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method: init.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
    },
    body: init.body ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
  });

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    throw new BrickkenApiError(
      `Brickken request failed: ${init.method ?? "GET"} ${path}`,
      response.status,
      payload
    );
  }

  return payload as TResponse;
}

/**
 * Prepares one or more unsigned transactions for the given method.
 * body must include method and chainId at minimum, plus whatever
 * fields that method requires (see docs.brickken.com API reference).
 */
export function prepareTransactions(
  body: Record<string, unknown>
): Promise<PrepareTransactionsResponse> {
  return brickkenFetch<PrepareTransactionsResponse>("/prepare-transactions", {
    method: "POST",
    body,
  });
}

/** Submits signed transactions for broadcast. */
export function sendTransactions(
  txId: string,
  signedTransactions: string[]
): Promise<{ txId: string }> {
  return brickkenFetch("/send-transactions", {
    method: "POST",
    body: { txId, signedTransactions },
  });
}

/** Confirms a client-broadcast transaction instead of sending signed bytes. */
export function confirmClientBroadcast(
  txId: string,
  txHash: string
): Promise<{ txId: string }> {
  return brickkenFetch("/send-transactions", {
    method: "POST",
    body: { txId, txHash },
  });
}

export function getTransactionStatus(
  txId: string
): Promise<TransactionStatusResponse> {
  return brickkenFetch(`/get-transaction-status?txId=${encodeURIComponent(txId)}`);
}

export function getTokenInfo(chainId: string, tokenSymbol: string) {
  return brickkenFetch(
    `/get-token-info?chainId=${chainId}&tokenSymbol=${tokenSymbol}`
  );
}

export function getWhitelistStatus(chainId: string, tokenSymbol: string, investorAddress: string) {
  return brickkenFetch(
    `/get-whitelist-status?chainId=${chainId}&tokenSymbol=${tokenSymbol}&investorAddress=${investorAddress}`
  );
}

export function getStos(chainId: string, tokenSymbol: string) {
  return brickkenFetch(`/get-stos?chainId=${chainId}&tokenSymbol=${tokenSymbol}`);
}

export function getInvestmentsByStoId(stoId: string) {
  return brickkenFetch(`/get-investments-by-sto-id?stoId=${stoId}`);
}

export function getStoBalance(chainId: string, tokenSymbol: string) {
  return brickkenFetch(`/get-sto-balance?chainId=${chainId}&tokenSymbol=${tokenSymbol}`);
}

export function getDividendDistribution(chainId: string, tokenSymbol: string) {
  return brickkenFetch(
    `/get-dividend-distribution?chainId=${chainId}&tokenSymbol=${tokenSymbol}`
  );
}

/**
 * Signs every transaction in a prepare response with the given private key
 * and submits them to Brickken. The private key comes from an environment
 * variable and is used only in memory, in this server-side process, to
 * produce signed transaction bytes. It is never sent anywhere itself.
 */
export async function signAndSend(
  prepared: PrepareTransactionsResponse,
  privateKey: string
): Promise<{ txId: string }> {
  const wallet = new Wallet(privateKey);

  const signedTransactions = await Promise.all(
    prepared.transactions.map((tx) =>
      wallet.signTransaction({
        to: tx.to,
        nonce: tx.nonce,
        chainId: tx.chainId,
        data: tx.data,
        type: tx.type,
        value: tx.value,
        maxPriorityFeePerGas: tx.maxPriorityFeePerGas,
        maxFeePerGas: tx.maxFeePerGas,
        gasLimit: tx.gasLimit,
      })
    )
  );

  return sendTransactions(prepared.txId, signedTransactions);
}

/**
 * Polls get-transaction-status until it leaves the pending state, or the
 * timeout is reached. Used after signAndSend to report a final result
 * back to the UI instead of leaving the caller to poll manually.
 */
export async function pollTransactionStatus(
  txId: string,
  options: { intervalMs?: number; timeoutMs?: number } = {}
): Promise<TransactionStatusResponse> {
  const intervalMs = options.intervalMs ?? 3000;
  const timeoutMs = options.timeoutMs ?? 60000;
  const start = Date.now();

  while (true) {
    const status = await getTransactionStatus(txId);
    if (status.status !== "pending") return status;
    if (Date.now() - start > timeoutMs) return status;
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
}
