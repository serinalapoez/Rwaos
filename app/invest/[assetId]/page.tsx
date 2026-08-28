"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAssetWithOffering } from "@/lib/sandbox-data";
import { getInvestorSession, InvestorSession } from "@/lib/investor-session";
import { getOperatorToken } from "@/lib/operator-session";
import { OperatorTokenField } from "@/components/OperatorTokenField";

type CallState = "idle" | "submitting" | "confirmed" | "pending" | "failed";

export default function InvestPage({ params }: { params: { assetId: string } }) {
  const result = getAssetWithOffering(params.assetId);
  const [session, setSession] = useState<InvestorSession | null>(null);
  const [sessionChecked, setSessionChecked] = useState(false);

  const [amount, setAmount] = useState(
    result ? String(result.offering.minInvestmentUsd) : "0"
  );
  const [investState, setInvestState] = useState<CallState>("idle");
  const [investError, setInvestError] = useState<string | null>(null);
  const [investTxId, setInvestTxId] = useState<string | null>(null);
  const [investTxHash, setInvestTxHash] = useState<string | null>(null);

  const [claimState, setClaimState] = useState<CallState>("idle");
  const [claimError, setClaimError] = useState<string | null>(null);
  const [claimTxId, setClaimTxId] = useState<string | null>(null);
  const [claimTxHash, setClaimTxHash] = useState<string | null>(null);

  useEffect(() => {
    setSession(getInvestorSession());
    setSessionChecked(true);
  }, []);

  if (!result) {
    return (
      <main className="mx-auto max-w-xl px-6 py-12">
        <p className="text-rwaos-muted">Asset not found.</p>
      </main>
    );
  }

  const { asset, offering } = result;

  async function handleInvest(event: React.FormEvent) {
    event.preventDefault();
    if (!session) return;
    setInvestState("submitting");
    setInvestError(null);
    setInvestTxId(null);
    setInvestTxHash(null);

    try {
      const response = await fetch("/api/invest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-operator-token": getOperatorToken(),
        },
        body: JSON.stringify({
          investorEmail: session.email,
          tokenSymbol: offering.tokenSymbol,
          investmentAmount: amount,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setInvestError(data.error ?? "Investment failed.");
        setInvestState("failed");
        return;
      }

      setInvestTxId(data.txId ?? null);
      setInvestTxHash(data.status?.txHash ?? null);
      setInvestState(data.status?.status === "success" ? "confirmed" : "pending");
    } catch (error) {
      setInvestError(error instanceof Error ? error.message : "Unexpected error.");
      setInvestState("failed");
    }
  }

  async function handleClaim() {
    if (!session) return;
    setClaimState("submitting");
    setClaimError(null);
    setClaimTxId(null);
    setClaimTxHash(null);

    try {
      const response = await fetch("/api/claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-operator-token": getOperatorToken(),
        },
        body: JSON.stringify({
          investorEmail: session.email,
          tokenSymbol: offering.tokenSymbol,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setClaimError(data.error ?? "Claim failed.");
        setClaimState("failed");
        return;
      }

      setClaimTxId(data.txId ?? null);
      setClaimTxHash(data.status?.txHash ?? null);
      setClaimState(data.status?.status === "success" ? "confirmed" : "pending");
    } catch (error) {
      setClaimError(error instanceof Error ? error.message : "Unexpected error.");
      setClaimState("failed");
    }
  }

  if (sessionChecked && !session) {
    return (
      <main className="mx-auto max-w-xl px-6 py-12">
        <span className="rounded-full border border-rwaos-border px-3 py-1 text-xs uppercase tracking-widest text-rwaos-muted">
          Sandbox environment
        </span>
        <h1 className="mt-4 font-serif text-3xl text-rwaos-text">
          Connect first
        </h1>
        <p className="mt-2 text-rwaos-muted">
          You need a whitelisted wallet before investing in {asset.name}.
        </p>
        <Link
          href="/onboard"
          className="mt-6 inline-block rounded-lg bg-rwaos-accent2 px-4 py-2 font-medium text-rwaos-bg"
        >
          Connect a wallet
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <span className="rounded-full border border-rwaos-border px-3 py-1 text-xs uppercase tracking-widest text-rwaos-muted">
        Sandbox environment
      </span>
      <h1 className="mt-4 font-serif text-3xl text-rwaos-text">
        Invest in {asset.name}
      </h1>
      {session && (
        <p className="mt-2 font-mono text-xs text-rwaos-muted">
          Connected as {session.walletAddress}
        </p>
      )}

      <OperatorTokenField />

      <form onSubmit={handleInvest} className="mt-8 space-y-4 rounded-xl border border-rwaos-border bg-rwaos-panel p-5">
        <h2 className="text-lg font-semibold text-rwaos-text">1. Invest</h2>
        <div>
          <label className="block text-sm text-rwaos-muted">
            Amount (Sandbox USDT, min {offering.minInvestmentUsd}, max {offering.maxInvestmentUsd})
          </label>
          <input
            required
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="mt-1 w-full rounded-lg border border-rwaos-border bg-rwaos-bg px-3 py-2 text-rwaos-text"
          />
        </div>
        <button
          type="submit"
          disabled={investState === "submitting"}
          className="w-full rounded-lg bg-rwaos-accent2 px-4 py-2 font-medium text-rwaos-bg disabled:opacity-50"
        >
          {investState === "submitting" ? "Sending to Brickken sandbox..." : "Invest"}
        </button>

        {investState === "confirmed" && (
          <div className="rounded-lg border border-rwaos-accent p-3 text-sm">
            <p className="text-rwaos-accent">Investment confirmed onchain.</p>
            {investTxId && <p className="mt-1 text-rwaos-muted">Transaction id: {investTxId}</p>}
            {investTxHash && <p className="mt-1 text-rwaos-muted">Transaction hash: {investTxHash}</p>}
          </div>
        )}
        {investState === "pending" && (
          <div className="rounded-lg border border-rwaos-warn p-3 text-sm text-rwaos-warn">
            Submitted, still confirming onchain. Transaction id: {investTxId}
          </div>
        )}
        {investState === "failed" && (
          <div className="rounded-lg border border-rwaos-danger p-3 text-sm text-rwaos-danger">
            {investError}
          </div>
        )}
      </form>

      <div className="mt-6 space-y-4 rounded-xl border border-rwaos-border bg-rwaos-panel p-5">
        <h2 className="text-lg font-semibold text-rwaos-text">2. Claim tokens</h2>
        <p className="text-xs text-rwaos-muted">
          Run this after your investment above is confirmed.
        </p>
        <button
          onClick={handleClaim}
          disabled={claimState === "submitting"}
          className="w-full rounded-lg border border-rwaos-accent2 px-4 py-2 font-medium text-rwaos-accent2 disabled:opacity-50"
        >
          {claimState === "submitting" ? "Sending to Brickken sandbox..." : "Claim tokens"}
        </button>

        {claimState === "confirmed" && (
          <div className="rounded-lg border border-rwaos-accent p-3 text-sm">
            <p className="text-rwaos-accent">Tokens claimed and confirmed onchain.</p>
            {claimTxId && <p className="mt-1 text-rwaos-muted">Transaction id: {claimTxId}</p>}
            {claimTxHash && <p className="mt-1 text-rwaos-muted">Transaction hash: {claimTxHash}</p>}
          </div>
        )}
        {claimState === "pending" && (
          <div className="rounded-lg border border-rwaos-warn p-3 text-sm text-rwaos-warn">
            Submitted, still confirming onchain. Transaction id: {claimTxId}
          </div>
        )}
        {claimState === "failed" && (
          <div className="rounded-lg border border-rwaos-danger p-3 text-sm text-rwaos-danger">
            {claimError}
          </div>
        )}
      </div>
    </main>
  );
}
