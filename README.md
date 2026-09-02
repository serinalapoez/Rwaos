# RWAOS

Real World Asset Operating System. An agentic financial operating system for tokenized Real World Assets, built with Brickken for the Build with Brickken campaign.

Tokenize Real World Assets. Fund them. Operate them onchain.

## What this is

RWAOS lets an asset owner tokenize an asset, launch an offering, whitelist investors, take investment, close the offering, and let investors claim their tokens, all against Brickken's sandbox. Four demo assets ship with the app: Origin Farms (Rivers State), Five Star Hotel (Lagos), MV Bonny Trader, and Sabi Sounds Royalty Fund. Two agents, an Issuer Agent and an Investor Agent, operate under RAMS-style permission limits that are checked server side before any call reaches Brickken.

Every step of the lifecycle, tokenize, launch, whitelist, invest, close, and claim, has been run to completion and confirmed onchain. The four demo assets each have a live offering with a multi-week window, so tokenize, launch, whitelist, and invest are proven directly on them. Close and claim were proven on a short-window test issuance created for that purpose, since the demo assets' offerings run past the campaign deadline. The full transaction log below covers both.

## Brickken integration

### Dapp API (REST)

- **Surface used:** REST (`/prepare-transactions`, `/send-transactions`, `/get-transaction-status`, `/get-whitelist-status`, `/get-stos`, `/get-token-info`, `/get-investor-info`).
- **Network:** Ethereum Sepolia, chainId `aa36a7` (`11155111`).
- **Methods called:** `newTokenization`, `newSto`, `whitelist`, `newInvest`, `claimTokens`, `closeOffer`.
- **Pattern used:** prepare an unsigned transaction, sign it with the project's signer or investor wallet, send it, then poll until it confirms. Implemented in `lib/brickken.ts`.

### Agentic API (CLI, x402)

- **Surface used:** CLI (`brickken-cli`), covering the Agentic Challenge track.
- **Network:** Ethereum Sepolia, chainId `11155111`.
- **What it demonstrates:** an agent paying for its own API call. `brickken-cli faucet bkn` was run twice, once authenticated with an API key and no payment, and once authenticated with only a private key, which triggered an x402 handshake. The agent paid 0.01 USDC on Ethereum Sepolia to Brickken's facilitator address and received 100 BKN in return.

### Investor onboarding notes

Whitelisting a wallet onchain and creating an investor profile in Brickken's system are two separate things. An investor also needs KYC clearance before `newInvest` will succeed, and each offering's escrow needs its own USDT approval from the investor's wallet, approving one escrow does not approve another. These were worked out with help from Brickken's team in their Discord `#tech-chat` channel over the course of building this.

## Transaction log

Every transaction below is confirmed on Ethereum Sepolia (chainId `11155111`), produced by this build against Brickken's sandbox. No amount here has any monetary value.

| Action | Method / command | Wallet | Transaction hash |
|---|---|---|---|
| Origin Farms (ORGN) offering launch | `newSto` | Issuer signer | `0x6a2a295da762c8b402d65b20a421645987989a0532602275070ebde6a3fe96b3` |
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
| Origin Farms (ORGN) investment | `newInvest` (wallet connect) | Investor wallet | `0x9ca27a4b7a48701cde0fbf61fc12934bf2e4a7ae810efd47a2ebfc1dfec61fc1` |
| Five Star Hotel (FSHL) investment (200 USDT) | `newInvest` (wallet connect) | Investor wallet | `0xe9a586ed00aa7ffe21e3b9a42e981b65ec030b3cc65bf131cd92c4b8ca8e954a` |
| MV Bonny Trader (BNTR) investment (300 USDT) | `newInvest` (wallet connect) | Investor wallet | `0x86e2da4c7885c555448a2809cf32aafeb598180b610839359d50afc449463e07` |
| Test issuance (TEST2) tokenization | `newTokenization` | Issuer signer | `0x04913d304261da478e5d34a6441ae255c46fc392f6a65a642d618ed1858a8283` |
| Test issuance (TEST2) offering launch | `newSto` | Issuer signer | `0x944e95c19846393653969aa56bdc4dedd45f614bef04c23b4ed22b4df0fc0f94` |
| Test issuance (TEST2) whitelist | `whitelist` | Issuer signer | `0xefd5b1216785f373f5827b2ddb1e940f37d1907d95074a6f762ad3738053076f` |
| Test issuance (TEST2) investment (50 USDT) | `newInvest` (wallet connect) | Investor wallet | `0x71a18b7447dc519df0d47cb30d639f3e474f2bfec539e9ae9db374d537bb17b4` |
| Test issuance (TEST2) offering close | `closeOffer` | Issuer signer | `0x86d51a94625b5154f649d68d419863a055969a4e278f292a57110510ec3c0bc3` |
| Test issuance (TEST2) token claim | `claimTokens` (wallet connect) | Investor wallet | `0xd69dc6ed1f70b7ad80a0a8ad7c0cce940977d0976a212401f464360a06fff917` |
| Test issuance (TEST2) dividend distribution | `dividendDistribution` | Issuer signer | `0x9a66880e167a71473ce626ebda5d6b2597643345ccb5c5a6438dcc488e9a5322` |

## Stack

- Next.js 14 (App Router) and TypeScript
- Tailwind CSS
- ethers v6, for signing transactions Brickken prepares
- Brickken sandbox Dapp API, called server side from `lib/brickken.ts`
- Brickken CLI (`brickken-cli`), for the Agentic API and x402 path
- Upstash Redis, for the agent activity log (needed because Vercel's serverless functions do not share memory between calls)

## Setup in Codespace

1. Copy `.env.example` to `.env.local`.
```

cp .env.example .env.local

```
2. Fill in `.env.local`: `BRICKKEN_API_KEY`, an issuer signer wallet, an investor wallet, `RWAOS_OPERATOR_TOKEN` (any long random string you choose), and `KV_REST_API_URL` / `KV_REST_API_TOKEN` from an Upstash Redis database. To generate a wallet without ever printing the private key to the screen, run:
```

node -e "

const { Wallet } = require('ethers');

const fs = require('fs');

const w = Wallet.createRandom();

let env = fs.readFileSync('.env.local', 'utf8');

env = env.replace(/BRICKKEN_SIGNER_ADDRESS=.*/, 'BRICKKEN_SIGNER_ADDRESS=' + w.address);

env = env.replace(/BRICKKEN_SIGNER_PRIVATE_KEY=.*/, 'BRICKKEN_SIGNER_PRIVATE_KEY=' + w.privateKey);

fs.writeFileSync('.env.local', env);

console.log('Address (safe to share):', w.address);

"

```
3. Fund both wallets with Sepolia test ETH from a faucet. The investor wallet also needs sandbox test USDT. Brickken's sandbox USDT contract has an open mint function, which this repo's `mint-test-usdt.js` script uses.

4. Install dependencies and run.
```

npm install

npm run dev

```
5. In the app, open `/onboard`, `/issuer`, or `/invest/[assetId]` and enter your `RWAOS_OPERATOR_TOKEN` once, it is stored locally on that device and sent with every write request.

## Project structure
```

app/                    Pages and API routes (App Router)

marketplace/           Browse demo assets and offerings

assets/[id]/            Asset detail and offering terms

onboard/                 Investor whitelist request, calls Brickken sandbox

issuer/                   Tokenize, launch, close, and distribute dividends

invest/[assetId]/         Invest and claim, signed by the investor's own wallet

agents/                    Agent identities, RAMS permissions, and activity log

api/                        Server routes that call Brickken sandbox

components/             Reusable UI components

lib/brickken.ts         Brickken Dapp API client: prepare, sign, send, poll

lib/rams.ts             RAMS style permission checks and the persistent activity log

lib/sandbox-data.ts     Demo assets and offerings shown in the UI

lib/auth.ts             Operator token check for write routes

lib/wallet-client.ts    Browser wallet connection for investor signed actions

types/domain.ts         Shared domain types

```
## AI tools disclosure

Portions of this codebase, scaffolding, UI components, the Brickken API client, and this README, were written with assistance from Claude (Anthropic). Every Brickken integration was checked against Brickken's own API reference, CLI output, and direct on-chain state before it was treated as working, and every transaction listed above is confirmed onchain rather than assumed.

## Status

Every Brickken method this build implements has been run and confirmed onchain: tokenize, launch, whitelist, invest, close, claim, and dividend distribution, across four demo assets and one short test issuance built specifically to prove close, claim, and dividend distribution within a single offering window. The Agentic API and x402 path are also confirmed onchain, separate from the Dapp API surface. All transaction hashes are listed above.
