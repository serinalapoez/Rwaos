"use client";

import { useState } from "react";
import { OFFERINGS, ASSETS } from "@/lib/sandbox-data";
import { setInvestorSession } from "@/lib/investor-session";

type SubmitState = "idle" | "submitting" | "confirmed" | "failed" | "pending";

export default function OnboardPage() {
  const [tokenSymbol, setTokenSymbol] = useState(OFFERINGS[0]?.tokenSymbol ?? "");
  const [investorAddress, setInvestorAddress] = useState("");
  const [investorEmail, setInvestorEmail] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const [txId, setTxId] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setState("submitting");
    setErrorMessage(null);
    setTxId(null);
    setTxHash(null);

    try {
      const response = await fetch("/api/whitelist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ investorAddress, investorEmail, tokenSymbol }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error ?? "Whitelist request failed.");
        setState("failed");
        return;
      }

      setTxId(data.txId ?? null);
      setTxHash(data.status?.txHash ?? null);
      const nextState = data.status?.status === "confirmed" ? "confirmed" : "pending";
      setState(nextState);
      if (nextState === "confirmed") {
        setInvestorSession({ walletAddress: investorAddress, email: investorEmail, tokenSymbol });
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unexpected error."
      );
      setState("failed");
    }
  }

  const selectedAsset = ASSETS.find(
    (asset) =>
      OFFERINGS.find((o) => o.tokenSymbol === tokenSymbol)?.assetId === asset.id
  );

  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <span className="rounded-full border border-rwaos-border px-3 py-1 text-xs uppercase tracking-widest text-rwaos-muted">
        Sandbox environment
      </span>
      <h1 className="mt-4 text-3xl font-semibold text-rwaos-text">
        Investor onboarding
      </h1>
      <p className="mt-2 text-rwaos-muted">
        Whitelisting is checked and executed directly against Brickken's
        sandbox. There is no separate identity provider in this build; a
        wallet becomes eligible to invest once Brickken confirms it is
        whitelisted for the chosen offering.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label className="block text-sm text-rwaos-muted">Offering</label>
          <select
            value={tokenSymbol}
            onChange={(event) => setTokenSymbol(event.target.value)}
            className="mt-1 w-full rounded-lg border border-rwaos-border bg-rwaos-panel px-3 py-2 text-rwaos-text"
          >
            {OFFERINGS.map((offering) => (
              <option key={offering.id} value={offering.tokenSymbol}>
                {offering.tokenSymbol}
              </option>
            ))}
          </select>
          {selectedAsset && (
            <p className="mt-1 text-xs text-rwaos-muted">{selectedAsset.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-rwaos-muted">
            Wallet address
          </label>
          <input
            required
            value={investorAddress}
            onChange={(event) => setInvestorAddress(event.target.value)}
            placeholder="0x..."
            className="mt-1 w-full rounded-lg border border-rwaos-border bg-rwaos-panel px-3 py-2 text-rwaos-text"
          />
        </div>

        <div>
          <label className="block text-sm text-rwaos-muted">Email</label>
          <input
            required
            type="email"
            value={investorEmail}
            onChange={(event) => setInvestorEmail(event.target.value)}
            placeholder="investor@example.com"
            className="mt-1 w-full rounded-lg border border-rwaos-border bg-rwaos-panel px-3 py-2 text-rwaos-text"
          />
        </div>

        <button
          type="submit"
          disabled={state === "submitting"}
          className="w-full rounded-lg bg-rwaos-accent2 px-4 py-2 font-medium text-rwaos-bg disabled:opacity-50"
        >
          {state === "submitting" ? "Submitting to Brickken sandbox..." : "Request whitelist"}
        </button>
      </form>

      {state === "confirmed" && (
        <div className="mt-6 rounded-lg border border-rwaos-accent bg-rwaos-panel p-4 text-sm">
          <p className="text-rwaos-accent">Whitelisted and confirmed onchain.</p>
          {txId && <p className="mt-1 text-rwaos-muted">Transaction id: {txId}</p>}
          {txHash && <p className="mt-1 text-rwaos-muted">Transaction hash: {txHash}</p>}
          {selectedAsset && (
            
              href={`/invest/${selectedAsset.id}`}
              className="mt-3 inline-block text-rwaos-accent2"
            >
              Continue to invest
            </a>
          )}
        </div>
      )}

      {state === "pending" && (
        <div className="mt-6 rounded-lg border border-rwaos-warn bg-rwaos-panel p-4 text-sm">
          <p className="text-rwaos-warn">
            Submitted. Still confirming onchain, check back shortly.
          </p>
          {txId && <p className="mt-1 text-rwaos-muted">Transaction id: {txId}</p>}
        </div>
      )}

      {state === "failed" && (
        <div className="mt-6 rounded-lg border border-rwaos-danger bg-rwaos-panel p-4 text-sm text-rwaos-danger">
          {errorMessage}
        </div>
      )}
    </main>
  );
}
