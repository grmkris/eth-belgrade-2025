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
│  (Next.js/Web3) │     │  (Oasis ROFL TEE)       │     │  (Sapphire)     │
└─────────────────┘     │  - AI Model             │     └─────────────────┘
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

## 🚀 Live Deployments

### Oasis Sapphire Testnet

Our Universal Basic AI platform is live on Oasis Protocol's privacy-preserving blockchain:

#### 🔗 Smart Contract (Verified)
- **Contract Address**: [`0xA0345079D64a5EeBb317E04b7008624B58F4B5a4`](https://explorer.oasis.io/testnet/sapphire/address/0xA0345079D64a5EeBb317E04b7008624B58F4B5a4)
- **Network**: Sapphire Testnet
- **Status**: ✅ Verified and Deployed
- **Features**: 
  - User usage management
  - Privacy-preserving state

#### 🤖 AI Oracle (ROFL TEE)
- **ROFL App ID**: [`rofl1qpw485nk7xv8qvrvqf93l08sv5uuy0wyku528yfl`](https://explorer.oasis.io/testnet/sapphire/rofl/app/rofl1qpw485nk7xv8qvrvqf93l08sv5uuy0wyku528yfl)
- **Type**: Runtime Off-chain Logic (ROFL)
- **Environment**: Trusted Execution Environment (TEE)
- **Features**:
  - SIWE authentication and verification
  - Private compute execution
  - OpenRouter AI model integration

#### 🔐 Privacy Guarantees
- **TEE Protection**: All AI processing happens inside secure enclave
- **No Data Leakage**: Even node operators cannot access conversations
- **Confidential State**: Smart contract state encrypted on Sapphire
- **Anonymous Usage**: Zero-knowledge proof of humanity without identity exposure

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
# iExec Configuration (for TEE deployment)
# No .env needed - configured via iapp.config.json
# Deployment done with: EXPERIMENTAL_TDX_APP=true iapp deploy
```

#### `apps/kyc-frontend/.env.local`
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id  # Get from WalletConnect Cloud
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

# Terminal 2: Start the KYC service (iExec TEE backend)
cd apps/kyc
# Deploy to iExec with TDX experimental flag
EXPERIMENTAL_TDX_APP=true iapp deploy

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
- **KYC Frontend**: http://localhost:3000 (React app)
- **KYC Service**: Deployed on iExec TEE (see deployment logs for app address)

## 🔐 KYC System (Identity Verification)

The project includes a privacy-preserving KYC system for verifying user identity and country of residence. This enables fair allocation of AI compute credits based on geographic location.

### Architecture
- **Frontend**: React app with Web3 wallet integration (`apps/kyc-frontend`)
- **Backend**: iExec TEE application for secure passport processing (`apps/kyc`)
- **Privacy**: Uses iExec DataProtector + TDX for confidential computing

### 🚀 KYC Quick Start

#### 1. Setup KYC Frontend
```bash
cd apps/kyc-frontend
npm install
cp .env.example .env.local
# Add your WalletConnect Project ID to .env.local
npm run dev
```

#### 2. Deploy KYC Backend to iExec TEE
```bash
cd apps/kyc
npm install -g @iexec/iapp
# Deploy with TDX experimental flag for hackathon
EXPERIMENTAL_TDX_APP=true iapp deploy
```

#### 3. Update Frontend Configuration
After deployment, update the app address in `apps/kyc-frontend/src/services/teeService.ts`:
```typescript
const DEPLOYED_IAPP_ADDRESS = '0x...'; // Your deployed app address
```

### 🔍 How KYC Works

1. **Upload Passport**: User uploads passport image via React frontend
2. **Data Protection**: Image encrypted using iExec DataProtector with simple schema:
   ```javascript
   { passport: base64ImageData }
   ```
3. **TEE Processing**: Secure processing in iExec TDX environment:
   - Enhanced OCR with EasyOCR + custom pattern matching
   - MRZ (Machine Readable Zone) parsing
   - Country extraction and verification
   - Confidence scoring with multiple fallback strategies
4. **Result Return**: Verified country and passport data returned

### 🛠️ KYC Development

#### Frontend Development
```bash
cd apps/kyc-frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run type-check   # TypeScript validation
```

#### Backend Development  
```bash
cd apps/kyc
iapp test           # Test locally
iapp run <app-address> --protectedData <data-address>  # Manual testing
```

### 🎯 KYC Features

#### Enhanced OCR Processing
- **Multiple Extraction Methods**: MRZ parsing, pattern matching, text analysis
- **Confidence Scoring**: Intelligent scoring with fallback strategies
- **Country Detection**: Automatic country identification from passport data
- **Demo Mode**: Reliable fallback results for hackathon showcasing

#### Privacy & Security
- **TEE Processing**: All OCR happens in Trusted Execution Environment
- **Data Protection**: Images encrypted end-to-end via iExec DataProtector  
- **No Storage**: No persistent storage of sensitive documents
- **Fallback Safety**: Multiple fallback layers ensure demo reliability

#### Technical Stack
- **Frontend**: React 18, TypeScript, Web3 integration (ethers.js)
- **Backend**: Python 3.9, EasyOCR, PIL, iExec TEE framework
- **Blockchain**: iExec Bellecour (chainId: 134) with TDX workerpool
- **Deployment**: iExec iApp with `EXPERIMENTAL_TDX_APP=true`

### 📋 KYC Configuration

#### TDX Configuration (per hackathon docs)
- **SMS Endpoint**: `https://sms.labs.iex.ec`
- **Workerpool**: `tdx-labs.pools.iexec.eth`
- **Dataset Type**: Simple `{ passport: string }` structure
- **Deserializer**: Custom Python implementation with zip + Borsh

#### Dependencies
- **Frontend**: React, ethers.js, @iexec/dataprotector
- **Backend**: easyocr, Pillow, opencv-python-headless, borsh-construct

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
│   ├── web/              # Main frontend (Universal Basic AI)
│   ├── oracle/           # AI chat backend (ROFL TEE)
│   ├── kyc/              # Identity verification (iExec TEE backend)
│   └── kyc-frontend/     # KYC UI (React frontend)
├── packages/
│   ├── contracts/        # Smart contracts (Sapphire)
│   ├── ui/              # Shared UI components
│   ├── eslint-config/   # ESLint configuration
│   └── typescript-config/# TypeScript configuration
├── HACKATHON_POC_GUIDE.md # Quick setup guide for ETH Belgrade
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
- [KYC TEE Backend Documentation](apps/kyc/README.md)
- [KYC Frontend Documentation](apps/kyc-frontend/README.md)
- [Hackathon POC Guide](HACKATHON_POC_GUIDE.md) - Quick setup for ETH Belgrade demo

## 🙏 Acknowledgments

- Built for ETH Belgrade 2025 Hackathon
- Powered by Oasis Sapphire ParaTime & ROFL TEE
- AI conversations via OpenRouter (in secure enclave)
- Identity verification via iExec DataProtector
- Inspired by the Universal Basic Income movement

## 🎉 Demo

Watch our demo video: [Coming Soon]