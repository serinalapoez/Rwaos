"use client";

import { useEffect, useState } from "react";
import { getOperatorToken, setOperatorToken } from "@/lib/operator-session";

export function OperatorTokenField() {
  const [token, setToken] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const existing = getOperatorToken();
    if (existing) {
      setToken(existing);
      setSaved(true);
    }
  }, []);

  return (
    <div className="mb-6 rounded-lg border border-rwaos-border bg-rwaos-panel p-4">
      <label className="block text-sm text-rwaos-muted">
        Operator token (this device only, not sent to anyone but this app)
      </label>
      <div className="mt-2 flex gap-2">
        <input
          type="password"
          value={token}
          onChange={(event) => {
            setToken(event.target.value);
            setSaved(false);
          }}
          className="flex-1 rounded-lg border border-rwaos-border bg-rwaos-bg px-3 py-2 text-rwaos-text"
        />
        <button
          type="button"
          onClick={() => {
            setOperatorToken(token);
            setSaved(true);
          }}
          className="rounded-lg border border-rwaos-accent2 px-4 py-2 text-sm text-rwaos-accent2"
        >
          Save
        </button>
      </div>
      {saved && (
        <p className="mt-2 font-mono text-xs text-rwaos-accent">Saved on this device.</p>
      )}
    </div>
  );
}
