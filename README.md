# RWAOS

Real World Asset Operating System. An agentic financial operating system for tokenized Real World Assets, built with Brickken for the Build with Brickken campaign.

Tokenize Real World Assets. Fund them. Operate them onchain.

## What this is

RWAOS lets an asset owner tokenize an asset, launch an offering (STO), and whitelist investors, all against Brickken's sandbox. Investors can browse a marketplace of demo assets, get whitelisted, and (in progress) invest and claim tokens. Four demo assets ship with the app: Green Valley Farm, Lagos Commercial Property, MV Atlantic, and Afrobeats Royalty Fund.

## Brickken integration

- **Surface used:** REST (`/prepare-transactions`, `/send-transactions`, `/get-transaction-status`, `/get-whitelist-status`).
- **Network:** Ethereum Sepolia, chainId `aa36a7` (`11155111`).
- **Methods called so far:** `newTokenization`, `newSto`, `whitelist`.
- **Pattern used:** prepare an unsigned transaction, sign it server-side with the project's signer wallet, send it, then poll `get-transaction-status` until it confirms. Implemented in `lib/brickken.ts`.
- **Transaction hashes:** to be added here once confirmed onchain runs are complete, ahead of submission.
- **Signer wallet:** kept only in `.env.local`, never committed. Set your own before running.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- ethers v6, for signing transactions Brickken prepares
- Brickken sandbox API (server-side only, called from `lib/brickken.ts`)

## Setup in Codespace

1. Copy `.env.example` to `.env.local`.cp .env.example .env.local


2. Fill in `.env.local`: `BRICKKEN_API_KEY` (from Brickken), and a signer wallet. To generate a fresh signer wallet without ever displaying the private key, run:

node -e "
const { Wallet } = require('ethers');
const fs = require('fs');
const w = Wallet.createRandom();
let env = fs.readFileSync('.env.local', 'utf8');
env = env.replace(/BRICKKEN_SIGNER_ADDRESS=./, 'BRICKKEN_SIGNER_ADDRESS=' + w.address);
env = env.replace(/BRICKKEN_SIGNER_PRIVATE_KEY=./, 'BRICKKEN_SIGNER_PRIVATE_KEY=' + w.privateKey);
fs.writeFileSync('.env.local', env);
console.log('Address (safe to share):', w.address);
"


3. Fund that address with Sepolia test ETH from a faucet.

4. Install dependencies and run.

npm install
npm run dev


## Project structure

app/ Pages and API routes (App Router)
marketplace/ Browse demo assets and offerings
assets/[id]/ Asset detail and offering terms
onboard/ Investor whitelist request (calls Brickken sandbox)
issuer/ Tokenize an asset, then launch its offering (calls Brickken sandbox)
api/ Server routes that call Brickken sandbox
components/ Reusable UI components
lib/brickken.ts Brickken sandbox client: prepare, sign, send, poll
lib/sandbox-data.ts Demo assets and offerings shown in the UI
types/domain.ts Shared domain types


## AI tools disclosure

Portions of this codebase (scaffolding, UI components, the Brickken API client, and this README) were written with assistance from Claude (Anthropic). All Brickken integration logic was reviewed against Brickken's official API reference and guides before use, and every endpoint call is tested against the live sandbox rather than mocked.

## Status

Marketplace, investor onboarding (whitelist), and issuer flow (tokenize plus launch offering) are built and call Brickken's sandbox directly. Investment, claiming, closing offerings, dividend distribution, and the agent panel (ERC-8004 identity, RAMS permissions) are in progress.
