# RWAOS

Real World Asset Operating System. An agentic financial operating system for tokenized Real World Assets, built with Brickken.

Tokenize Real World Assets. Fund them. Operate them onchain.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Brickken API (server-side only, called from `lib/brickken.ts`)

## Setup in Codespace

1. Copy `.env.example` to `.env.local` and fill in your Brickken sandbox credentials.

```
cp .env.example .env.local
```

2. Install dependencies.

```
npm install
```

3. Run the dev server.

```
npm run dev
```

4. Open the forwarded port Codespace gives you (usually port 3000) in the Ports tab.

## Project structure

```
app/                  Pages and API routes (App Router)
components/           Reusable UI components
lib/brickken.ts       Server-side Brickken API client
types/domain.ts       Shared domain types (Asset, Offering, Investor, Agent, RAMS)
```

## Writing rules for this project

1. No long dashes (em dash or en dash) in code, comments, UI text, or docs.
2. The word "real" is not used except inside the terms "RWA" and "Real World Asset(s)".

## Status

Foundational scaffold. Marketplace, issuer dashboard, investor dashboard, KYC/whitelist flow, and agent panel are built next, one piece at a time.
