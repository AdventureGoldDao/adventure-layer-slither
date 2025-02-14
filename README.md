# Blockchain Snake Game

A decentralized Snake game built with React and MUD framework, featuring on-chain interactions and real-time gameplay. This project demonstrates the integration of classic gaming mechanics with blockchain technology.

![Game Screenshot](path_to_screenshot.png)

## 🎮 Game Features

- **Classic Snake Gameplay**
  - Direction-based movement control
  - Food collection mechanics
  - Score tracking
  - Collision detection

- **Blockchain Integration**
  - On-chain state management
  - Token rewards system
  - Decentralized leaderboard
  - Wallet integration (MetaMask)

## 🏗️ Technical Architecture

### Core Components
- **MUD Framework**: Handles game state and blockchain interactions
- **React Frontend**: User interface and game rendering
- **Smart Contracts**: Game logic and state management
- **Adventure Engine**: Simplifies on-chain interactions
- **Shard Extensions**: Enhanced blockchain functionality

### Project Structure
```
packages/
├── client/                 # Frontend application
│   ├── src/
│   │   ├── game/          # Game components
│   │   ├── gameCode/      # Contract ABIs
│   │   ├── home/          # Home page components
│   │   ├── leaderboard/   # Leaderboard components
│   │   └── mud/           # MUD framework integration
│   ├── .env               # Environment configuration
│   └── package.json
│
├── contracts/             # Smart contracts
│   ├── deploys/          # Deployment records
│   ├── scripts/          # Utility scripts
│   │   ├── listen.js     # Reward distribution
│   │   └── heartbeat.js  # Periodic updates
│   ├── src/              # Contract source code
│   ├── foundry.toml      # Foundry configuration
│   ├── mud.config.ts     # MUD configuration
│   └── .env              # Contract environment setup
│
└── dev-tools/            # Development utilities
```

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- pnpm 8 or 9
- MetaMask or compatible Web3 wallet

### Installation

1. **Clone the repository**
```bash
git clone [repository-url]
cd blockchain-snake-game
```

2. **Set up contracts**
```bash
cd contracts
pnpm install
cp .env.example .env

# Configure .env with:
PRIVATE_KEY=your_wallet_private_key
RPC_URL=your_RPC_node_URL
```

3. **Deploy contracts**
```bash
pnpm deploy:local

# Start event listener for rewards
# Update WORLD_ADDRESS in .env with deployed contract address
pnpm run listen

# Start heartbeat service
pnpm run heartbeat
```

4. **Set up development tools**
```bash
cd ../dev-tools
pnpm install
pnpm build
```

5. **Configure and start the client**
```bash
cd ../client
pnpm install
cp .env.example .env

# Configure .env with appropriate chain ID
pnpm run dev
```

## 🎯 Game Controls
- Mouse movement for snake direction
- Click to start/pause game
- Connect wallet to save scores and earn rewards

## 🔧 Development

### Available Scripts
```bash
# Client
pnpm run dev          # Start development server
pnpm run build       # Build for production
pnpm run test        # Run tests

# Contracts
pnpm deploy:local    # Deploy to local network
pnpm deploy:testnet  # Deploy to testnet
pnpm run listen      # Start reward listener
pnpm run heartbeat   # Start heartbeat service
```

### Smart Contract Architecture
- **GameSystem**: Core game logic and state management
- **RewardSystem**: Token distribution and scoring
- **LeaderboardSystem**: Player rankings and statistics

## 🔐 Security

- Audited smart contracts
- Secure random number generation
- Anti-cheat mechanisms
- Rate limiting for on-chain actions

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- Documentation: [Link to Docs]
- Discord: [Your Discord Server]
- Issues: GitHub Issues Page

## 🙏 Acknowledgments

- MUD Framework team
- Adventure Engine contributors
- OpenZeppelin for smart contract libraries
- Community contributors
