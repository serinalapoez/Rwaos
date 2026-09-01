"use client";

import { useState } from "react";
import { ASSETS, OFFERINGS } from "@/lib/sandbox-data";
import { AssetCategory } from "@/types/domain";
import { getOperatorToken } from "@/lib/operator-session";
import { OperatorTokenField } from "@/components/OperatorTokenField";
import { TxHashLink } from "@/components/TxHashLink";

type CallState = "idle" | "submitting" | "confirmed" | "pending" | "failed";

const TOKEN_TYPE_BY_CATEGORY: Record<AssetCategory, string> = {
  property: "RWA_TOKEN",
  agriculture: "REVENUE_SHARE",
  maritime: "REVENUE_SHARE",
  "music-royalties": "PROFIT_SHARING",
  business: "EQUITY",
  infrastructure: "RWA_TOKEN",
  equipment: "RWA_TOKEN",
  "private-credit": "DEBT",
};

export default function IssuerPage() {
  const [assetId, setAssetId] = useState(ASSETS[0]?.id ?? "");
  const asset = ASSETS.find((a) => a.id === assetId);
  const offering = OFFERINGS.find((o) => o.assetId === assetId);

  const [tokenizerEmail, setTokenizerEmail] = useState("issuer@example.com");
  const [name, setName] = useState(asset?.name ?? "");
  const [tokenSymbol, setTokenSymbol] = useState(offering?.tokenSymbol ?? "");
  const [tokenType, setTokenType] = useState(
    asset ? TOKEN_TYPE_BY_CATEGORY[asset.category] : "RWA_TOKEN"
  );
  const [supplyCap, setSupplyCap] = useState("1000000");

  const [tokenizeState, setTokenizeState] = useState<CallState>("idle");
  const [tokenizeError, setTokenizeError] = useState<string | null>(null);
  const [tokenizeTxId, setTokenizeTxId] = useState<string | null>(null);
  const [tokenizeTxHash, setTokenizeTxHash] = useState<string | null>(null);

  const [offeringName, setOfferingName] = useState(
    asset ? `${asset.name} Offering` : ""
  );
  const [tokenAmount, setTokenAmount] = useState("1000");
  const [minRaiseUSD, setMinRaiseUSD] = useState(
    offering ? String(Math.round(offering.raiseTargetUsd / 2)) : "10000"
  );
  const [maxRaiseUSD, setMaxRaiseUSD] = useState(
    offering ? String(offering.raiseTargetUsd) : "100000"
  );
  const [minInvestment, setMinInvestment] = useState(
    offering ? String(offering.minInvestmentUsd) : "100"
  );
  const [maxInvestment, setMaxInvestment] = useState(
    offering ? String(offering.maxInvestmentUsd) : "10000"
  );
  const [startDate, setStartDate] = useState(
    offering ? `${offering.startDate}T00:00:00.000Z` : ""
  );
  const [endDate, setEndDate] = useState(
    offering ? `${offering.endDate}T23:59:59.000Z` : ""
  );

  const [stoState, setStoState] = useState<CallState>("idle");
  const [stoError, setStoError] = useState<string | null>(null);
  const [stoTxId, setStoTxId] = useState<string | null>(null);
  const [stoTxHash, setStoTxHash] = useState<string | null>(null);

  const [closeState, setCloseState] = useState<CallState>("idle");
  const [closeError, setCloseError] = useState<string | null>(null);
  const [closeTxId, setCloseTxId] = useState<string | null>(null);
  const [closeTxHash, setCloseTxHash] = useState<string | null>(null);

  const [dividendAmount, setDividendAmount] = useState("100");
  const [dividendState, setDividendState] = useState<CallState>("idle");
  const [dividendError, setDividendError] = useState<string | null>(null);
  const [dividendTxId, setDividendTxId] = useState<string | null>(null);
  const [dividendTxHash, setDividendTxHash] = useState<string | null>(null);

  function handleAssetChange(nextAssetId: string) {
    setAssetId(nextAssetId);
    const nextAsset = ASSETS.find((a) => a.id === nextAssetId);
    const nextOffering = OFFERINGS.find((o) => o.assetId === nextAssetId);
    if (!nextAsset || !nextOffering) return;

    setName(nextAsset.name);
    setTokenSymbol(nextOffering.tokenSymbol);
    setTokenType(TOKEN_TYPE_BY_CATEGORY[nextAsset.category]);
    setOfferingName(`${nextAsset.name} Offering`);
    setMinRaiseUSD(String(Math.round(nextOffering.raiseTargetUsd / 2)));
    setMaxRaiseUSD(String(nextOffering.raiseTargetUsd));
    setMinInvestment(String(nextOffering.minInvestmentUsd));
    setMaxInvestment(String(nextOffering.maxInvestmentUsd));
    const start = new Date();
    start.setUTCMinutes(start.getUTCMinutes() + 2);
    setStartDate(start.toISOString());
    const end = new Date();
    end.setUTCMinutes(end.getUTCMinutes() + 10);
    setEndDate(end.toISOString());
  }

  async function handleTokenize(event: React.FormEvent) {
    event.preventDefault();
    setTokenizeState("submitting");
    setTokenizeError(null);
    setTokenizeTxId(null);
    setTokenizeTxHash(null);

    try {
      const response = await fetch("/api/tokenize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-operator-token": getOperatorToken(),
        },
        body: JSON.stringify({
          tokenizerEmail,
          name,
          tokenSymbol,
          tokenType,
          supplyCap,
          url: asset?.documentationUrl ?? "",
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setTokenizeError(
          data.details ? `${data.error} - ${JSON.stringify(data.details)}` : data.error ?? "Tokenization failed."
        );
        setTokenizeState("failed");
        return;
      }

      setTokenizeTxId(data.txId ?? null);
      setTokenizeTxHash(data.status?.txHash ?? null);
      setTokenizeState(data.status?.status === "confirmed" ? "confirmed" : "pending");
    } catch (error) {
      setTokenizeError(error instanceof Error ? error.message : "Unexpected error.");
      setTokenizeState("failed");
    }
  }

  async function handleCreateSto(event: React.FormEvent) {
    event.preventDefault();
    setStoState("submitting");
    setStoError(null);
    setStoTxId(null);
    setStoTxHash(null);

    try {
      const response = await fetch("/api/create-sto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-operator-token": getOperatorToken(),
        },
        body: JSON.stringify({
          tokenizerEmail,
          tokenSymbol,
          tokenAmount,
          offeringName,
          startDate,
          endDate,
          acceptedCoin: "USDT",
          minRaiseUSD,
          maxRaiseUSD,
          minInvestment,
          maxInvestment,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setStoError(
          data.details ? `${data.error} - ${JSON.stringify(data.details)}` : data.error ?? "Creating the offering failed."
        );
        setStoState("failed");
        return;
      }

      setStoTxId(data.txId ?? null);
      setStoTxHash(data.status?.txHash ?? null);
      setStoState(data.status?.status === "confirmed" ? "confirmed" : "pending");
    } catch (error) {
      setStoError(error instanceof Error ? error.message : "Unexpected error.");
      setStoState("failed");
    }
  }

  async function handleCloseOffer() {
    setCloseState("submitting");
    setCloseError(null);
    setCloseTxId(null);
    setCloseTxHash(null);

    try {
      const response = await fetch("/api/close-offering", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-operator-token": getOperatorToken(),
        },
        body: JSON.stringify({ tokenizerEmail, tokenSymbol }),
      });
      const data = await response.json();

      if (!response.ok) {
        setCloseError(
          data.details ? `${data.error} - ${JSON.stringify(data.details)}` : data.error ?? "Closing the offering failed."
        );
        setCloseState("failed");
        return;
      }

      setCloseTxId(data.txId ?? null);
      setCloseTxHash(data.status?.transactionHash ?? null);
      setCloseState(data.status?.status === "success" ? "confirmed" : "pending");
    } catch (error) {
      setCloseError(error instanceof Error ? error.message : "Unexpected error.");
      setCloseState("failed");
    }
  }

  async function handleDistributeDividend() {
    setDividendState("submitting");
    setDividendError(null);
    setDividendTxId(null);
    setDividendTxHash(null);

    try {
      const response = await fetch("/api/distribute-dividend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-operator-token": getOperatorToken(),
        },
        body: JSON.stringify({ tokenSymbol, amount: dividendAmount }),
      });
      const data = await response.json();

      if (!response.ok) {
        setDividendError(
          data.details ? `${data.error} - ${JSON.stringify(data.details)}` : data.error ?? "Distributing the dividend failed."
        );
        setDividendState("failed");
        return;
      }

      setDividendTxId(data.txId ?? null);
      setDividendTxHash(data.status?.transactionHash ?? null);
      setDividendState(data.status?.status === "success" ? "confirmed" : "pending");
    } catch (error) {
      setDividendError(error instanceof Error ? error.message : "Unexpected error.");
      setDividendState("failed");
    }
  }

  const inputClass =
    "mt-1 w-full rounded-lg border border-rwaos-border bg-rwaos-panel px-3 py-2 text-rwaos-text";
  const labelClass = "block text-sm text-rwaos-muted";

  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <span className="rounded-full border border-rwaos-border px-3 py-1 text-xs uppercase tracking-widest text-rwaos-muted">
        Sandbox environment
      </span>
      <h1 className="mt-4 text-3xl font-semibold text-rwaos-text">
        Issuer: tokenize and launch
      </h1>
      <p className="mt-2 text-rwaos-muted">
        Every action here calls Brickken's sandbox directly: prepare, sign,
        send, then poll for confirmation.
      </p>

      <div className="mt-8">
        <OperatorTokenField />
        <label className={labelClass}>Start from a demo asset</label>
        <select
          value={assetId}
          onChange={(event) => handleAssetChange(event.target.value)}
          className={inputClass}
        >
          {ASSETS.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-rwaos-muted">
          Every field below is editable. This just pre-fills a starting point.
        </p>
      </div>

      <form onSubmit={handleTokenize} className="mt-6 space-y-4 rounded-xl border border-rwaos-border bg-rwaos-panel p-5">
        <h2 className="text-lg font-semibold text-rwaos-text">
          1. Tokenize the asset
        </h2>

        <div>
          <label className={labelClass}>Tokenizer email</label>
          <input
            required
            type="email"
            value={tokenizerEmail}
            onChange={(event) => setTokenizerEmail(event.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Asset name</label>
          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Token symbol (2 to 5 letters)</label>
          <input
            required
            value={tokenSymbol}
            onChange={(event) => setTokenSymbol(event.target.value.toUpperCase())}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Token type</label>
          <select
            value={tokenType}
            onChange={(event) => setTokenType(event.target.value)}
            className={inputClass}
          >
            {[
              "EQUITY",
              "DEBT",
              "BILL_FACTORING",
              "ICO",
              "STABLECOIN",
              "REVENUE_SHARE",
              "RWA_TOKEN",
              "PROFIT_SHARING",
            ].map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Supply cap</label>
          <input
            required
            value={supplyCap}
            onChange={(event) => setSupplyCap(event.target.value)}
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={tokenizeState === "submitting"}
          className="w-full rounded-lg bg-rwaos-accent2 px-4 py-2 font-medium text-rwaos-bg disabled:opacity-50"
        >
          {tokenizeState === "submitting" ? "Sending to Brickken sandbox..." : "Tokenize this asset"}
        </button>

        {tokenizeState === "confirmed" && (
          <div className="rounded-lg border border-rwaos-accent p-3 text-sm">
            <p className="text-rwaos-accent">Tokenized and confirmed onchain.</p>
            {tokenizeTxId && <p className="mt-1 text-rwaos-muted">Transaction id: {tokenizeTxId}</p>}
            {tokenizeTxHash && <p className="mt-1 text-rwaos-muted">Transaction hash: <TxHashLink txHash={tokenizeTxHash} /></p>}
          </div>
        )}
        {tokenizeState === "pending" && (
          <div className="rounded-lg border border-rwaos-warn p-3 text-sm text-rwaos-warn">
            Submitted, still confirming onchain. Transaction id: {tokenizeTxId}
          </div>
        )}
        {tokenizeState === "failed" && (
          <div className="rounded-lg border border-rwaos-danger p-3 text-sm text-rwaos-danger">
            {tokenizeError}
          </div>
        )}
      </form>

      <form onSubmit={handleCreateSto} className="mt-6 space-y-4 rounded-xl border border-rwaos-border bg-rwaos-panel p-5">
        <h2 className="text-lg font-semibold text-rwaos-text">
          2. Launch the offering
        </h2>
        <p className="text-xs text-rwaos-muted">
          Run this after the token above is confirmed on Brickken.
        </p>

        <div>
          <label className={labelClass}>Offering name</label>
          <input
            required
            value={offeringName}
            onChange={(event) => setOfferingName(event.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Token amount for this offering</label>
          <input
            required
            value={tokenAmount}
            onChange={(event) => setTokenAmount(event.target.value)}
            className={inputClass}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Minimum raise (USD)</label>
            <input
              required
              value={minRaiseUSD}
              onChange={(event) => setMinRaiseUSD(event.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Maximum raise (USD)</label>
            <input
              required
              value={maxRaiseUSD}
              onChange={(event) => setMaxRaiseUSD(event.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Minimum investment (USD)</label>
            <input
              required
              value={minInvestment}
              onChange={(event) => setMinInvestment(event.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Maximum investment (USD)</label>
            <input
              required
              value={maxInvestment}
              onChange={(event) => setMaxInvestment(event.target.value)}
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>Start date (ISO 8601)</label>
          <input
            required
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>End date (ISO 8601)</label>
          <input
            required
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={stoState === "submitting"}
          className="w-full rounded-lg bg-rwaos-accent2 px-4 py-2 font-medium text-rwaos-bg disabled:opacity-50"
        >
          {stoState === "submitting" ? "Sending to Brickken sandbox..." : "Launch this offering"}
        </button>

        {stoState === "confirmed" && (
          <div className="rounded-lg border border-rwaos-accent p-3 text-sm">
            <p className="text-rwaos-accent">Offering launched and confirmed onchain.</p>
            {stoTxId && <p className="mt-1 text-rwaos-muted">Transaction id: {stoTxId}</p>}
            {stoTxHash && <p className="mt-1 text-rwaos-muted">Transaction hash: <TxHashLink txHash={stoTxHash} /></p>}
          </div>
        )}
        {stoState === "pending" && (
          <div className="rounded-lg border border-rwaos-warn p-3 text-sm text-rwaos-warn">
            Submitted, still confirming onchain. Transaction id: {stoTxId}
          </div>
        )}
        {stoState === "failed" && (
          <div className="rounded-lg border border-rwaos-danger p-3 text-sm text-rwaos-danger">
            {stoError}
          </div>
        )}
      </form>

      <div className="mt-6 space-y-4 rounded-xl border border-rwaos-border bg-rwaos-panel p-5">
        <h2 className="text-lg font-semibold text-rwaos-text">
          3. Close the offering
        </h2>
        <p className="text-xs text-rwaos-muted">
          Ends the offering above for {tokenSymbol}. Only the tokenizer wallet can do this.
        </p>
        <button
          type="button"
          onClick={handleCloseOffer}
          disabled={closeState === "submitting"}
          className="w-full rounded-lg border border-rwaos-accent2 px-4 py-2 font-medium text-rwaos-accent2 disabled:opacity-50"
        >
          {closeState === "submitting" ? "Sending to Brickken sandbox..." : "Close this offering"}
        </button>

        {closeState === "confirmed" && (
          <div className="rounded-lg border border-rwaos-accent p-3 text-sm">
            <p className="text-rwaos-accent">Offering closed and confirmed onchain.</p>
            {closeTxId && <p className="mt-1 text-rwaos-muted">Transaction id: {closeTxId}</p>}
            {closeTxHash && <p className="mt-1 text-rwaos-muted">Transaction hash: <TxHashLink txHash={closeTxHash} /></p>}
          </div>
        )}
        {closeState === "pending" && (
          <div className="rounded-lg border border-rwaos-warn p-3 text-sm text-rwaos-warn">
            Submitted, still confirming onchain. Transaction id: {closeTxId}
          </div>
        )}
        {closeState === "failed" && (
          <div className="rounded-lg border border-rwaos-danger p-3 text-sm text-rwaos-danger">
            {closeError}
          </div>
        )}
      </div>

      <div className="mt-6 space-y-4 rounded-xl border border-rwaos-border bg-rwaos-panel p-5">
        <h2 className="text-lg font-semibold text-rwaos-text">
          4. Distribute a dividend
        </h2>
        <p className="text-xs text-rwaos-muted">
          Pays out to holders of {tokenSymbol}. Only the tokenizer wallet can do this.
        </p>
        <div>
          <label className={labelClass}>Amount</label>
          <input
            value={dividendAmount}
            onChange={(event) => setDividendAmount(event.target.value)}
            className={inputClass}
          />
        </div>
        <button
          type="button"
          onClick={handleDistributeDividend}
          disabled={dividendState === "submitting"}
          className="w-full rounded-lg border border-rwaos-accent2 px-4 py-2 font-medium text-rwaos-accent2 disabled:opacity-50"
        >
          {dividendState === "submitting" ? "Sending to Brickken sandbox..." : "Distribute dividend"}
        </button>

        {dividendState === "confirmed" && (
          <div className="rounded-lg border border-rwaos-accent p-3 text-sm">
            <p className="text-rwaos-accent">Dividend distributed and confirmed onchain.</p>
            {dividendTxId && <p className="mt-1 text-rwaos-muted">Transaction id: {dividendTxId}</p>}
            {dividendTxHash && <p className="mt-1 text-rwaos-muted">Transaction hash: <TxHashLink txHash={dividendTxHash} /></p>}
          </div>
        )}
        {dividendState === "pending" && (
          <div className="rounded-lg border border-rwaos-warn p-3 text-sm text-rwaos-warn">
            Submitted, still confirming onchain. Transaction id: {dividendTxId}
          </div>
        )}
        {dividendState === "failed" && (
          <div className="rounded-lg border border-rwaos-danger p-3 text-sm text-rwaos-danger">
            {dividendError}
          </div>
        )}
      </div>
    </main>
  );
}
