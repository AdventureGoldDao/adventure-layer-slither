## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- pnpm 8 or 9
- MetaMask or compatible Web3 wallet

### Installation

1. **Clone the repository**
```bash
git clone [repository-url]
cd react-demo
```

2. **build**
```shell
pnpm i && pnpm build
```

3. **deploy contracts**
```shell
cd packages/contracts
# up env
cp .env.example .env
vim foundry.toml # set eth_rpc_url

# deploy contracts
pnpm deploy:local
```

4. **run local client**
```shell
cd packages/client
# up env set chain id in (react-demo/packages/client/src/mud/supportedChains.ts)
cp .env.example .env
# run client
pnpm dev

# url: http://127.0.0.1:8508
```

5. **build to nginx**
```shell
cd packages/client
# up env set chain id is in (react-demo/packages/client/src/mud/supportedChains.ts)
cp .env.example .env
pnpm build

# set nginx conf
# root ***/react-demo/packages/client/dist;
# index index.html;
```

6. **start listen**
```shell
cd packages/contracts
# Game ends and rewards tokens based on scores
# Start listen (react-demo/packages/contracts/scripts/listen.js)
# contracts is (react-demo/packages/contracts/src/systems/GameStateSystem.sol:18)
pnpm listen
```
