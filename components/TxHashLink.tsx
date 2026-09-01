export function TxHashLink({ txHash }: { txHash: string }) {
  return (
    <a
      href={`https://sepolia.etherscan.io/tx/${txHash}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-rwaos-accent2 underline"
    >
      {txHash}
    </a>
  );
}
