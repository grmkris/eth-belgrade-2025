# Universal Basic AI - ETH Belgrade 2025

![image.png](./image.png)

A revolutionary platform implementing Universal Basic AI (UBAI) - ensuring every human has access to AI compute power as a fundamental right. Built on Oasis Protocol for complete privacy and anonymity

## 🌍 The Vision: Universal Basic AI

In a future where AI becomes essential for education, work, and daily life, we risk creating a world where only the wealthy have access to advanced AI capabilities. **Universal Basic AI** prevents this dystopia by guaranteeing every person a fair allocation of AI compute power based on their country of origin.

### Core Principles

1. **AI as a Human Right**: Every person deserves access to AI assistance, regardless of their economic status
2. **Fair Distribution**: Compute allocation based on country of residence, ensuring global equity
3. **Complete Privacy**: AI runs in Oasis ROFL TEE (Trusted Execution Environment) - your conversations remain completely anonymous
4. **Community Funded**: Those who can afford more can donate to fund AI access for others
5. **Transparent & Accountable**: All funding is tracked on-chain while user privacy is preserved

## 🎯 How It Works

1. **One-Time Verification**: Users verify their identity and country once (privacy-preserving KYC)
2. **Compute Allocation**: Based on your country's GDP per capita, you receive monthly AI credits
3. **Anonymous Usage**: Chat with AI in complete privacy - even we can't see your conversations
4. **Community Support**: When your credits run low, the community donation pool keeps you connected
5. **Pay It Forward**: Those with means can donate to expand access for others

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────────────┐     ┌─────────────────┐
│   Web Frontend  │────▶│       AI Oracle         │────▶│  Blockchain     │
│  (Next.js/Web3) │     │  (Oasis ROFL TEE)      │     │  (Sapphire)     │
└─────────────────┘     │  - AI Model            │     └─────────────────┘
         │              │  - SIWE Auth            │              │
         │              │  - Private Compute      │              │
         │              └─────────────────────────┘              │
         │                                                       │
         └──────────────────┐                    ┌───────────────┘
                            ▼                    ▼
                   ┌─────────────────────────────┐
                   │   Identity Verification     │
                   │   (iExec DataProtector)     │
                   │   - Country verification    │
                   │   - One-time process        │
                   └─────────────────────────────┘
```

### Privacy Architecture

- **ROFL TEE**: AI runs inside Oasis Runtime Off-chain Logic, ensuring conversations are encrypted end-to-end
- **No Data Leakage**: Even node operators cannot access chat contents
- **Verified Anonymity**: Prove you're human and your country without revealing who you are
- **On-chain Privacy**: Sapphire's confidential smart contracts hide user balances and usage

## 🌟 Key Features

### For Users
- **Universal Access**: Everyone gets base AI credits monthly
- **Complete Anonymity**: Your chats are encrypted in TEE - nobody can read them
- **Mental Health Focus**: Specialized in emotional support and wellbeing
- **24/7 Availability**: AI companion always there when you need it
- **No Surveillance**: Unlike big tech, we can't mine your data

### For Society
- **Reduces Inequality**: Prevents AI from becoming a luxury good
- **Global Impact**: Country-based allocation ensures worldwide access
- **Community Driven**: Donations directly fund more conversations
- **Transparent Funding**: See exactly how donations create access

### Technical Innovation
- **ROFL TEE Integration**: First mental health AI running in secure enclave
- **SIWE + TEE**: Combines wallet auth with confidential compute
- **Privacy-First KYC**: Verify once, stay anonymous forever
- **Hybrid On/Off Chain**: Best of both worlds for privacy and transparency

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/your-username/eth-belgrade-2025.git
cd eth-belgrade-2025

# Install dependencies
pnpm install
```

### 2. Environment Setup

Create `.env` files in each app directory:

#### `apps/oracle/.env`
```env
# Required
CONTRACT_ADDRESS=0x...                    # Your deployed oracle contract
PRIVATE_KEY=0x...                        # Private key for oracle operations
OPENROUTER_API_KEY=your_api_key         # Get from https://openrouter.ai
ROFL_ENDPOINT=https://...               # Oasis ROFL TEE endpoint

# Optional
NETWORK_NAME=sapphire-testnet
PORT=3001
```

#### `apps/web/.env.local`
```env
NEXT_PUBLIC_APPKIT_PROJECT_ID=your_project_id  # Get from WalletConnect
NEXT_PUBLIC_ORACLE_URL=http://localhost:3001
NEXT_PUBLIC_KYC_URL=http://localhost:3002
```

#### `apps/kyc/.env`
```env
WEB3_PRIVATE_KEY=0x...                   # Private key for KYC operations
IEXEC_APP_ENDPOINT=https://...          # iExec DataProtector endpoint
```

### 3. Deploy Smart Contracts

```bash
# Navigate to contracts
cd packages/contracts

# Deploy to Sapphire testnet
forge script script/Deploy.s.sol --rpc-url sapphire-testnet --broadcast

# Save the deployed contract address for the oracle .env
```

### 4. Start Services

In separate terminals:

```bash
# Terminal 1: Start the Oracle API
cd apps/oracle
bun run oracleWEB.ts

# Terminal 2: Start the KYC service
cd apps/kyc
npm run start

# Terminal 3: Start the KYC frontend
cd apps/kyc-frontend
npm run dev

# Terminal 4: Start the main web app
cd apps/web
npm run dev
```

### 5. Access the Application

- **Main App**: http://localhost:3000
- **Oracle API**: http://localhost:3001
- **KYC Service**: http://localhost:3002

## 🔧 Development

### Running with Turbo (Recommended)

```bash
# Run all services in development mode
pnpm dev

# Build all packages
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint
```

### Project Structure

```
eth-belgrade-2025/
├── apps/
│   ├── web/              # Main frontend
│   ├── oracle/           # AI chat backend
│   ├── kyc/              # Identity verification
│   └── kyc-frontend/     # KYC UI
├── packages/
│   ├── contracts/        # Smart contracts
│   ├── ui/              # Shared UI components
│   ├── eslint-config/   # ESLint configuration
│   └── typescript-config/# TypeScript configuration
└── turbo.json           # Turborepo configuration
```

## 🎯 Key Features

### For Users
- **Private Conversations**: End-to-end encrypted chats with AI
- **24/7 Availability**: Always-on emotional support
- **No Judgment**: Safe space for mental health discussions
- **Free Access**: Community-funded conversations

### For Donors
- **Direct Impact**: $5 funds 1 hour of support
- **Transparent Ledger**: Track all donations on-chain
- **Anonymous Options**: Donate with or without attribution
- **Tax Benefits**: Blockchain receipts for contributions

### Technical Features
- **SIWE Authentication**: Secure wallet-based login
- **Streaming Responses**: Real-time AI responses
- **Privacy Preservation**: iExec DataProtector for KYC
- **Sapphire Confidentiality**: Private smart contract state

## 🔒 Security Considerations

- **KYC Data**: Encrypted and stored via iExec DataProtector
- ** AI DATA**: E....TODO
- **Smart Contracts**: Audited for common vulnerabilities
- **API Security**: Rate limiting and SIWE authentication

## 🎯 The UBAI Model

### Compute Allocation Formula

```
Monthly AI Credits = Base Allocation × Country Multiplier

Where:
- Base Allocation = 100 credits (≈ 20 conversations)
- Country Multiplier = (Global Median GDP / Country GDP)^0.5
```

### Example Allocations
- 🇨🇭 Switzerland (High GDP): 100 credits/month
- 🇧🇷 Brazil (Medium GDP): 200 credits/month  
- 🇰🇪 Kenya (Lower GDP): 400 credits/month

This ensures those in lower-income countries get MORE access, counteracting global inequality.

### Donation Impact
- $5 = 100 credits = ~20 conversations
- $25 = 500 credits = ~100 conversations  
- $100 = 2000 credits = ~400 conversations

## 🔒 Security & Privacy

- **TEE Protection**: All AI processing happens in Oasis ROFL secure enclave
- **E2E Encryption**: Messages encrypted before leaving your browser
- **No Logs**: Conversations are never stored or logged
- **KYC Data**: Encrypted and stored via iExec DataProtector
- **Smart Contracts**: Audited for common vulnerabilities
- **SIWE Authentication**: Secure wallet-based access without passwords

## 🎯 Documentation

- [Web Frontend Documentation](apps/web/readme.md)
- [Oracle API Documentation](apps/oracle/README.md)
- [Smart Contract Documentation](packages/contracts/README.md)
- [KYC Frontend Documentation](apps/kyc/README.md)

## 🙏 Acknowledgments

- Built for ETH Belgrade 2025 Hackathon
- Powered by Oasis Sapphire ParaTime & ROFL TEE
- AI conversations via OpenRouter (in secure enclave)
- Identity verification via iExec DataProtector
- Inspired by the Universal Basic Income movement

## 🎉 Demo

Watch our demo video: [Coming Soon]