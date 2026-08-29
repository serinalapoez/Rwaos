require('dotenv').config({ path: '.env.local' });
const { ethers } = require('ethers');

const USDT_ADDRESS = '0x28d2B01854D0aBec267a3DDcad9163580E6E8604';
const ABI = [
  'function mint(address to, uint256 amount) external',
  'function balanceOf(address) view returns (uint256)',
  'function decimals() view returns (uint8)'
];

async function main() {
  const provider = new ethers.JsonRpcProvider('https://ethereum-sepolia-rpc.publicnode.com');
  const wallet = new ethers.Wallet(process.env.BRICKKEN_SIGNER_PRIVATE_KEY, provider);
  const contract = new ethers.Contract(USDT_ADDRESS, ABI, wallet);

  const decimals = await contract.decimals();
  console.log('Decimals:', decimals);

  const amount = ethers.parseUnits('1000', decimals);
  const tx = await contract.mint(process.env.BRICKKEN_INVESTOR_ADDRESS, amount);
  console.log('Mint tx sent:', tx.hash);
  await tx.wait();
  console.log('Mint confirmed.');

  const balance = await contract.balanceOf(process.env.BRICKKEN_INVESTOR_ADDRESS);
  console.log('Investor USDT balance:', ethers.formatUnits(balance, decimals));
}

main().catch((err) => console.error('Mint failed:', err.reason || err.message));
