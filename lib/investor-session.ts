export type InvestorSession = {
  walletAddress: string;
  email: string;
  tokenSymbol: string;
};

const STORAGE_KEY = "rwaos-investor";

export function getInvestorSession(): InvestorSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as InvestorSession) : null;
  } catch {
    return null;
  }
}

export function setInvestorSession(session: InvestorSession) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearInvestorSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
