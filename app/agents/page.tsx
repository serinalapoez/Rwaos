"use client";

import { useEffect, useState } from "react";
import { AgentDefinition, AgentLogEntry } from "@/lib/rams";

function outcomeColor(outcome: AgentLogEntry["outcome"]) {
  if (outcome === "rejected") return "text-rwaos-danger";
  if (outcome === "executed") return "text-rwaos-accent";
  return "text-rwaos-accent2";
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<AgentDefinition[]>([]);
  const [log, setLog] = useState<AgentLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const response = await fetch("/api/agent-log");
      const data = await response.json();
      setAgents(data.agents ?? []);
      setLog(data.log ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <span className="rounded-full border border-rwaos-border px-3 py-1 text-xs uppercase tracking-widest text-rwaos-muted">
        Sandbox environment
      </span>
      <h1 className="mt-4 font-serif text-3xl text-rwaos-text">Agents</h1>
      <p className="mt-2 text-rwaos-muted">
        Each agent has an ERC-8004-style identity and a RAMS mandate defining
        what it may do without a human raising the limit. Every call to
        invest or tokenize is checked against this before it reaches
        Brickken, whether it passes or fails.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="rounded-xl border border-rwaos-border bg-rwaos-panel p-5"
          >
            <p className="font-serif text-lg text-rwaos-text">{agent.id}</p>
            <p className="mt-1 font-mono text-xs text-rwaos-muted">
              {agent.erc8004Identity}
            </p>
            <p className="mt-1 break-all font-mono text-xs text-rwaos-muted">
              {agent.walletAddress}
            </p>

            <div className="mt-4 space-y-2">
              {agent.permissions.map((permission) => (
                <div
                  key={permission.action}
                  className="rounded-lg border border-rwaos-border p-3 text-sm"
                >
                  <p className="text-rwaos-text">{permission.action}</p>
                  {permission.maxAmountUsd !== undefined && (
                    <p className="mt-1 font-mono text-xs text-rwaos-muted">
                      Autonomous limit: {permission.maxAmountUsd} sandbox USDT
                    </p>
                  )}
                  {permission.allowedTokenSymbols && (
                    <p className="mt-1 font-mono text-xs text-rwaos-muted">
                      Approved symbols: {permission.allowedTokenSymbols.join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="font-serif text-2xl text-rwaos-text">Activity log</h2>
        <button
          onClick={load}
          className="rounded-lg border border-rwaos-border px-3 py-1.5 text-sm text-rwaos-muted"
        >
          Refresh
        </button>
      </div>

      {loading && <p className="mt-4 text-rwaos-muted">Loading...</p>}

      {!loading && log.length === 0 && (
        <p className="mt-4 text-rwaos-muted">
          No agent activity yet. Try investing or tokenizing an asset.
        </p>
      )}

      <div className="mt-4 divide-y divide-rwaos-border border-y border-rwaos-border">
        {log.map((entry) => (
          <div key={entry.id} className="py-3">
            <div className="flex items-center justify-between">
              <p className="font-mono text-xs text-rwaos-muted">
                {new Date(entry.timestamp).toLocaleString()}
              </p>
              <p className={`font-mono text-xs uppercase ${outcomeColor(entry.outcome)}`}>
                {entry.outcome}
              </p>
            </div>
            <p className="mt-1 text-sm text-rwaos-text">
              {entry.agentId} - {entry.action}
            </p>
            <p className="mt-1 text-xs text-rwaos-muted">{entry.reason}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
