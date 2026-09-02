require('dotenv').config({ path: '.env.local' });
const { ethers } = require('ethers');

const USDT_ADDRESS = '0x28d2B01854D0aBec267a3DDcad9163580E6E8604';
const TEST2_ESCROW = '0x761c6bE899bdc820978a6B4fF5b05FF56125571d';
const ABI = [
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)'
];

async function main() {
  const provider = new ethers.JsonRpcProvider('https://ethereum-sepolia-rpc.publicnode.com');
  const wallet = new ethers.Wallet(process.env.BRICKKEN_INVESTOR_PRIVATE_KEY, provider);
  const contract = new ethers.Contract(USDT_ADDRESS, ABI, wallet);

  const amount = ethers.parseUnits('100', 6);
  const tx = await contract.approve(TEST2_ESCROW, amount);
  console.log('Approve tx sent:', tx.hash);
  await tx.wait();
  console.log('Approve confirmed.');

  const allowance = await contract.allowance(wallet.address, TEST2_ESCROW);
  console.log('Allowance now:', ethers.formatUnits(allowance, 6));
}

main().catch((err) => console.error('Approve failed:', err.reason || err.message));
