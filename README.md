# Blockchain Snake Game Demo
A blockchain-based Snake game built with React, designed to simplify on-chain interactions using adventure-engine and Shard extensions.

## Features

### Client-Side Features
#### 🕹️ Game Mechanics
- Snake movement control (mouse direction control)
- Food position loading
- Real-time score display
- Game over detection
#### ⛓️ Blockchain Interactions
- Wallet connection (MetaMask)
- On-chain token exchange for game currency
- Game data verification and storage on-chain
- Retrieval of user scores and food positions
#### Smart Contract Features
- Player data storage (scores)
- Real-time token rewards based on scores
- Periodic food refresh via heartbeat
- Game score validation and rule enforcement
### File Structure
```angular2html
packages/
├── client/ # Frontend client
│ ├── src/
│ │ ├── game/ # React components
│ │ ├── gameCode/ # Contract ABIs
│ │ ├── home/ # Utility functions
│ │ ├── leaderboard/ # Utility functions
│ │ └── mud/ # Main entry point
│ ├── .env Configuration file
│ └── package.json
│
├── contracts/ # Smart contracts
│  ├── deploys/ # Historical contract addresses and block positions
│  ├── scripts/ # Deployment scripts
│  │ ├── listen.js # Token reward distribution script
│  │ ├── sendheartbeat.js # Heartbeat activation/deactivation script
│  ├── src/ # Core contract code
│  ├── foundry.toml # Contract domain configurations
│  ├── mud.config.ts # Main contract data generation
│  ├── .env Configuration file
└── dev-tools/ # Shared libraries
```

## System Requirements
Node.js v18
pnpm 8 | 9

## Quick Start
```bash
# Install contract dependencies
cd contracts && pnpm install
cp .env.example .env

# Configure `.env` file:
PRIVATE_KEY=your_wallet_private_key
RPC_URL=your_RPC_node_URL

# Deploy contracts
pnpm deploy:local

# Start event listener (for reward distribution).
# After deployment, set WORLD_ADDRESS in `.env` to the contract address.
pnpm run listen

# Start heartbeat to periodically trigger the `adventureHeatbeat` contract function.
pnpm run heartbeat

# Compile and start the client
cd dev-tools && pnpm install && pnpm build
cd client && pnpm install

# Configure `.env` file
cp .env.example .env

#VITE_CHAIN_ID= Set to a public chain or an ID included in `client/src/mud/supportedChains.ts`
# Run or build the client
pnpm run dev || pnpm run build
```
