"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAssetWithOffering } from "@/lib/sandbox-data";
import { getInvestorSession } from "@/lib/investor-session";
import { OperatorTokenField } from "@/components/OperatorTokenField";
import { TxHashLink } from "@/components/TxHashLink";
import {
  connectWallet,
  hasBrowserWallet,
  sendAllTransactionsViaWallet,
  WalletTransaction,
} from "@/lib/wallet-client";

type CallState = "idle" | "connecting" | "submitting" | "confirmed" | "pending" | "failed";

export default function InvestPage({ params }: { params: { assetId: string } }) {
  const result = getAssetWithOffering(params.assetId);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [email, setEmail] = useState("");

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
    const session = getInvestorSession();
    if (session?.email) setEmail(session.email);
  }, []);

  if (!result) {
    return (
      <main className="mx-auto max-w-xl px-6 py-12">
        <p className="text-rwaos-muted">Asset not found.</p>
      </main>
    );
  }

  const { asset, offering } = result;

  async function handleConnect() {
    setWalletError(null);
    try {
      const address = await connectWallet();
      setWalletAddress(address);
    } catch (error) {
      setWalletError(error instanceof Error ? error.message : "Could not connect wallet.");
    }
  }

  async function handleInvest(event: React.FormEvent) {
    event.preventDefault();
    if (!walletAddress) return;
    setInvestState("submitting");
    setInvestError(null);
    setInvestTxId(null);
    setInvestTxHash(null);

    try {
      const prepareResponse = await fetch("/api/prepare-invest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          investorEmail: email,
          investorAddress: walletAddress,
          tokenSymbol: offering.tokenSymbol,
          investmentAmount: amount,
        }),
      });
      const prepared = await prepareResponse.json();

      if (!prepareResponse.ok) {
        setInvestError(prepared.details ? `${prepared.error} - ${JSON.stringify(prepared.details)}` : prepared.error ?? "Preparing the investment failed.");
        setInvestState("failed");
        return;
      }

      const txHash = await sendAllTransactionsViaWallet(walletAddress, prepared.transactions as WalletTransaction[]);
      const confirmResponse = await fetch("/api/confirm-invest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ txId: prepared.txId, txHash }),
      });
      const confirmed = await confirmResponse.json();
      if (!confirmResponse.ok) {
        setInvestError(confirmed.error ?? "Confirming the investment failed.");
        setInvestState("failed");
        return;
      }
      setInvestTxId(confirmed.txId ?? prepared.txId);
      setInvestTxHash(confirmed.status?.transactionHash ?? txHash);
      setInvestState(confirmed.status?.status === "success" ? "confirmed" : "pending");
    } catch (error) {
      setInvestError(error instanceof Error ? error.message : "Unexpected error.");
      setInvestState("failed");
    }
  }

  async function handleClaim() {
    if (!walletAddress) return;
    setClaimState("submitting");
    setClaimError(null);
    setClaimTxId(null);
    setClaimTxHash(null);

    try {
      const prepareResponse = await fetch("/api/prepare-claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          investorEmail: email,
          investorAddress: walletAddress,
          tokenSymbol: offering.tokenSymbol,
        }),
      });
      const prepared = await prepareResponse.json();

      if (!prepareResponse.ok) {
        setClaimError(prepared.details ? `${prepared.error} - ${JSON.stringify(prepared.details)}` : prepared.error ?? "Preparing the claim failed.");
        setClaimState("failed");
        return;
      }

      const txHash = await sendAllTransactionsViaWallet(walletAddress, prepared.transactions as WalletTransaction[]);
      const confirmResponse = await fetch("/api/confirm-claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ txId: prepared.txId, txHash }),
      });
      const confirmed = await confirmResponse.json();
      if (!confirmResponse.ok) {
        setClaimError(confirmed.error ?? "Confirming the claim failed.");
        setClaimState("failed");
        return;
      }
      setClaimTxId(confirmed.txId ?? prepared.txId);
      setClaimTxHash(confirmed.status?.transactionHash ?? txHash);
      setClaimState(confirmed.status?.status === "success" ? "confirmed" : "pending");
    } catch (error) {
      setClaimError(error instanceof Error ? error.message : "Unexpected error.");
      setClaimState("failed");
    }
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <span className="rounded-full border border-rwaos-border px-3 py-1 text-xs uppercase tracking-widest text-rwaos-muted">
        Sandbox environment
      </span>
      <h1 className="mt-4 font-serif text-3xl text-rwaos-text">
        Invest in {asset.name}
      </h1>
      {walletAddress ? (
        <p className="mt-2 font-mono text-xs text-rwaos-muted">
          Connected as {walletAddress}
        </p>
      ) : hasBrowserWallet() ? (
        <button onClick={handleConnect} className="mt-4 rounded-lg bg-rwaos-accent2 px-4 py-2 font-medium text-rwaos-bg">
          Connect wallet
        </button>
      ) : (
        <p className="mt-2 text-sm text-rwaos-muted">
          No browser wallet detected. Install MetaMask or a similar wallet to invest with your own address.
        </p>
      )}
      {walletError && <p className="mt-2 text-xs text-rwaos-danger">{walletError}</p>}

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
          disabled={!walletAddress || investState === "submitting"}
          className="w-full rounded-lg bg-rwaos-accent2 px-4 py-2 font-medium text-rwaos-bg disabled:opacity-50"
        >
          {investState === "submitting" ? "Waiting for wallet..." : "Invest"}
        </button>

        {investState === "confirmed" && (
          <div className="rounded-lg border border-rwaos-accent p-3 text-sm">
            <p className="text-rwaos-accent">Investment confirmed onchain.</p>
            {investTxId && <p className="mt-1 text-rwaos-muted">Transaction id: {investTxId}</p>}
            {investTxHash && <p className="mt-1 text-rwaos-muted">Transaction hash: <TxHashLink txHash={investTxHash} /></p>}
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
          disabled={!walletAddress || claimState === "submitting"}
          className="w-full rounded-lg border border-rwaos-accent2 px-4 py-2 font-medium text-rwaos-accent2 disabled:opacity-50"
        >
          {claimState === "submitting" ? "Waiting for wallet..." : "Claim tokens"}
        </button>

        {claimState === "confirmed" && (
          <div className="rounded-lg border border-rwaos-accent p-3 text-sm">
            <p className="text-rwaos-accent">Tokens claimed and confirmed onchain.</p>
            {claimTxId && <p className="mt-1 text-rwaos-muted">Transaction id: {claimTxId}</p>}
            {claimTxHash && <p className="mt-1 text-rwaos-muted">Transaction hash: <TxHashLink txHash={claimTxHash} /></p>}
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
