/**
 * Minimal browser wallet connection, using whatever EIP-1193 provider the
 * browser injects (MetaMask or similar). No wallet SDK dependency.
 * This must only run in the browser.
 */

const SEPOLIA_CHAIN_ID_HEX = "0xaa36a7";

type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
};

function getProvider(): EthereumProvider | null {
  if (typeof window === "undefined") return null;
  const ethereum = (window as unknown as { ethereum?: EthereumProvider }).ethereum;
  return ethereum ?? null;
}

export function hasBrowserWallet(): boolean {
  return getProvider() !== null;
}

/**
 * Requests account access and ensures the wallet is on Ethereum Sepolia.
 * Returns the connected address, checksummed as provided by the wallet.
 */
export async function connectWallet(): Promise<string> {
  const provider = getProvider();
  if (!provider) {
    throw new Error("No browser wallet found. Install MetaMask or a similar wallet.");
  }

  const accounts = (await provider.request({ method: "eth_requestAccounts" })) as string[];
  if (!accounts || accounts.length === 0) {
    throw new Error("No account was authorized.");
  }

  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }],
    });
  } catch {
    // If the wallet does not have Sepolia added, leave it to the person to
    // switch manually. The invest/claim calls will simply fail clearly if
    // the wrong network is active.
  }

  return accounts[0];
}

export type WalletTransaction = {
  to: string;
  data: string;
  value: string;
  gasLimit: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
};

/**
 * Sends one transaction through the connected wallet and returns the
 * resulting transaction hash. The wallet handles its own nonce and prompts
 * the person to approve before anything is broadcast.
 */
export async function sendTransactionViaWallet(
  from: string,
  tx: WalletTransaction
): Promise<string> {
  const provider = getProvider();
  if (!provider) {
    throw new Error("No browser wallet found.");
  }

  const txHash = (await provider.request({
    method: "eth_sendTransaction",
    params: [
      {
        from,
        to: tx.to,
        data: tx.data,
        value: tx.value,
        gas: tx.gasLimit,
        maxFeePerGas: tx.maxFeePerGas,
        maxPriorityFeePerGas: tx.maxPriorityFeePerGas,
      },
    ],
  })) as string;

  return txHash;
}

/**
 * Sends every transaction in order (used for the approve-then-invest case).
 * Returns the hash of the last transaction, which is what the confirm step
 * is reconciled against.
 */
export async function sendAllTransactionsViaWallet(
  from: string,
  transactions: WalletTransaction[]
): Promise<string> {
  let lastHash = "";
  for (const tx of transactions) {
    lastHash = await sendTransactionViaWallet(from, tx);
  }
  return lastHash;
}
