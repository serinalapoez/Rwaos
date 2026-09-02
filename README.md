# RWAOS

Real World Asset Operating System. An agentic financial operating system for tokenized Real World Assets, built with Brickken for the Build with Brickken campaign.

Tokenize Real World Assets. Fund them. Operate them onchain.

## What this is

RWAOS lets an asset owner tokenize an asset, launch an offering (STO), and whitelist investors, all against Brickken's sandbox. Investors can browse a marketplace of demo assets, get whitelisted, invest, and claim tokens. Four demo assets ship with the app: Origin Farms (Rivers State), Five Star Hotel (Lagos), MV Bonny Trader, and Sabi Sounds Royalty Fund. Two agents (an Issuer Agent and an Investor Agent) operate under RAMS-style permission limits, enforced server-side before any Brickken call is made.

## Brickken integration

### Dapp API (REST)

- **Surface used:** REST (`/prepare-transactions`, `/send-transactions`, `/get-transaction-status`, `/get-whitelist-status`, `/get-stos`).
- **Network:** Ethereum Sepolia, chainId `aa36a7` (`11155111`).
- **Methods called:** `newTokenization`, `newSto`, `whitelist`, `newInvest`, `claimTokens`.
- **Pattern used:** prepare an unsigned transaction, sign it server-side with the project's signer or investor wallet, send it, then poll `get-transaction-status` until it confirms. Implemented in `lib/brickken.ts`.

### Agentic API (CLI, x402)

- **Surface used:** CLI (`brickken-cli`), covering the Agentic Challenge track.
- **Network:** Ethereum Sepolia, chainId `11155111`.
- **What it demonstrates:** an agent paying for its own API call. `brickken-cli faucet bkn` was run twice: once authenticated with an API key (no payment), and once authenticated with only a private key, which triggered a genuine x402 handshake, the agent paid 0.01 USDC on Ethereum Sepolia to Brickken's facilitator address, and received 100 BKN in return.

## Transaction log

All transactions below are genuine, confirmed on Ethereum Sepolia (chainId `11155111`), produced by this build against Brickken's sandbox. No amount here represents live currency.

| Action | Method / command | Wallet | Transaction hash |
|---|---|---|---|
| Launch offering for Origin Farms (ORGN) | `newSto` | Issuer signer | `0x6a2a295da762c8b402d65b20a421645987989a0532602275070ebde6a3fe96b3` |
| BKN faucet claim, API key path | `brickken-cli faucet bkn` | Investor wallet | `0x58e12e96ff3f64cb43174908dfad64d2a2523775c92df524c282d03a37c72cca` |
| BKN faucet claim, x402 path (agent paid 0.01 USDC) | `brickken-cli faucet bkn` (x402) | Issuer signer | `0x03b68012f29e155a190baccd08f5bc05d32f7739675cb5ea0f1f37f339fee301` |
| USDC settlement for the x402 payment above | x402 settlement | Issuer signer | `0xa22dc67887d52276d14ed471038a9e90ed05dafb01cb72598fe5896b1864ec58` |
| Five Star Hotel (FSHL) tokenization | `newTokenization` | Issuer signer | `0xa908ca1a557215f3dd6e8f5f3b91058b2c33d9dba965b2b6ca12346ef8e60130` |
| Five Star Hotel (FSHL) offering launch | `newSto` | Issuer signer | `0xe79c8bf98a00c13da2d62b038f4b7dd5a4d1dca810ff916468e8df8b2bc73eb6` |
| MV Bonny Trader (BNTR) tokenization | `newTokenization` | Issuer signer | `0x8505d07cdd15e708147ba916ba61f0eabdefbd3ccd10e492da1dd12cc3982b36` |
| MV Bonny Trader (BNTR) offering launch | `newSto` | Issuer signer | `0x63d5d648e47fe62057b7fdd08bb9a2bc590750d4fd284d67d7357beeadd52c40` |
| Sabi Sounds (SABI) tokenization | `newTokenization` | Issuer signer | `0x6ffc1016ccf1cd2ff4202c2e5fb7f1f940ba3986ed09b2229ceee2f75d0c3c1a` |
| Sabi Sounds (SABI) offering launch | `newSto` | Issuer signer | `0x614a2edf61064da3bda9e1bc1cd11dd4591af578d3ad488d784cc27eb95dddcb` |
| SABI investment (200 USDT) | `newInvest` (wallet connect) | Investor wallet | `0x859d410b779f9892838ab69519637f9ca1c90f160eeb586758c8f6f8549b6a3f` |
| ORGN investment | `newInvest` (wallet connect) | Investor wallet | `0x9ca27a4b7a48701cde0fbf61fc12934bf2e4a7ae810efd47a2ebfc1dfec61fc1` |
| FSHL investment (200 USDT) | `newInvest` (wallet connect) | Investor wallet | `0xe9a586ed00aa7ffe21e3b9a42e981b65ec030b3cc65bf131cd92c4b8ca8e954a` |
| BNTR investment (300 USDT) | `newInvest` (wallet connect) | Investor wallet | `0x86e2da4c7885c555448a2809cf32aafeb598180b610839359d50afc449463e07` |
| Test issuance (TEST2) offering launch, used to validate close and claim | `newSto` | Issuer signer | `0x944e95c19846393653969aa56bdc4dedd45f614bef04c23b4ed22b4df0fc0f94` |
| Test issuance (TEST2) investment (50 USDT) | `newInvest` (wallet connect) | Investor wallet | `0x71a18b7447dc519df0d47cb30d639f3e474f2bfec539e9ae9db374d537bb17b4` |

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- ethers v6, for signing transactions Brickken prepares
- Brickken sandbox Dapp API (server-side only, called from `lib/brickken.ts`)
- Brickken CLI (`brickken-cli`), for the Agentic API / x402 path

## Setup in Codespace

1. Copy `.env.example` to `.env.local`.
cp .env.example .env.local

2. Fill in `.env.local`: `BRICKKEN_API_KEY` (from Brickken), an issuer signer wallet, an investor wallet, and `RWAOS_OPERATOR_TOKEN` (any long random string you choose). To generate a wallet without ever displaying the private key on screen, run:
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

3. Fund both wallets with Sepolia test ETH from a faucet, and the investor wallet with sandbox test USDT for investing.

4. Install dependencies and run.
npm install
npm run dev

5. In the app, open `/onboard`, `/issuer`, or `/invest/[assetId]` and enter your `RWAOS_OPERATOR_TOKEN` once (stored locally on that device) before triggering any write action.

## Project structure
app/ Pages and API routes (App Router)
marketplace/ Browse demo assets and offerings
assets/[id]/ Asset detail and offering terms
onboard/ Investor whitelist request (calls Brickken sandbox)
issuer/ Tokenize an asset, then launch its offering (calls Brickken sandbox)
invest/[assetId]/ Invest, then claim tokens (calls Brickken sandbox)
agents/ Agent identities, RAMS permissions, and activity log
api/ Server routes that call Brickken sandbox
components/ Reusable UI components
lib/brickken.ts Brickken Dapp API client: prepare, sign, send, poll
lib/rams.ts RAMS-style permission checks and activity log
lib/sandbox-data.ts Demo assets and offerings shown in the UI
lib/auth.ts Operator token check for write routes
types/domain.ts Shared domain types

## AI tools disclosure

Portions of this codebase (scaffolding, UI components, the Brickken API client, and this README) were written with assistance from Claude (Anthropic). All Brickken integration logic was reviewed against Brickken's official API reference and CLI output before use, and every endpoint call is tested against the live sandbox rather than mocked.

## Status

Marketplace, investor onboarding (whitelist), issuer flow (tokenize plus launch offering), invest, claim, and RAMS-gated agent permissions are built and confirmed working against Brickken's sandbox for at least one asset (Origin Farms). Remaining work before submission: repeat the full lifecycle for the other three demo assets, close an offering, and run a dividend distribution.