# AI Support Companion - Web Frontend

The main web application for the AI Support Companion platform. Built with Next.js 15, React 19, and Web3 technologies to provide a seamless interface for emotional support conversations and community donations.

## 🎨 Features

### Core Components

#### 1. **Chat Interface** (`components/Chat.tsx`)
- Real-time AI-powered conversations with Claude 3.5 Sonnet
- SIWE (Sign-In with Ethereum) authentication for secure, wallet-based access
- Streaming responses with typing indicators
- Message history with delete functionality
- Example prompts for quick conversation starters
- Mobile-responsive design with gesture support

#### 2. **Landing Page** (`components/Landing.tsx`)
- Hero section with clear value proposition
- Community support progress tracker (gas tank visualization)
- User testimonials carousel
- Call-to-action for both users and donors
- Animated components using Framer Motion

#### 3. **Donation System** (`components/Donate.tsx`)
- USDC-based donation flow
- Impact calculator ($5 = 1 hour of support)
- Optional alias for donor recognition
- Anonymous donation support
- Real-time transaction feedback

#### 4. **Transparency Ledger** (`components/Ledger.tsx`)
- Public view of all donations
- Real-time statistics (total donated, hours funded, contributors)
- Transaction history with timestamps
- Privacy-preserving donor display

#### 5. **Wallet Integration** (`components/ConnectButton.tsx`)
- WalletConnect and MetaMask support
- Balance display
- Network switching
- Disconnect functionality

## 🛠️ Technical Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + custom components
- **Animations**: Framer Motion
- **Web3**: wagmi v2 + viem
- **UI Components**: Custom design system from `@workspace/ui`
- **State Management**: React hooks + wagmi hooks
- **Authentication**: SIWE (EIP-4361)

## 📁 Project Structure

```
apps/web/
├── app/                    # Next.js app router pages
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page
│   ├── chat/              # Chat interface
│   ├── donate/            # Donation page
│   └── ledger/            # Transparency ledger
├── components/            # React components
│   ├── Chat.tsx          # Main chat interface
│   ├── Landing.tsx       # Landing page content
│   ├── Donate.tsx        # Donation flow
│   ├── Ledger.tsx        # Transaction history
│   ├── ConnectButton.tsx # Wallet connection
│   └── providers.tsx     # Context providers
├── hooks/                # Custom React hooks
│   └── useWallet.ts     # Wallet state management
├── lib/                  # Utility functions
│   ├── WalletProvider.tsx # Web3 configuration
│   └── constants.ts     # App constants
└── styles/              # Global styles
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- pnpm package manager
- WalletConnect Project ID
- Access to the Oracle API

### Environment Variables

Create `.env.local` in the `apps/web` directory:

```env
# WalletConnect
NEXT_PUBLIC_APPKIT_PROJECT_ID=your_project_id_here

# API Endpoints
NEXT_PUBLIC_ORACLE_URL=http://localhost:3001
NEXT_PUBLIC_KYC_URL=http://localhost:3002

# Optional
NEXT_PUBLIC_DONATION_CONTRACT=0x...
NEXT_PUBLIC_ORACLE_CONTRACT=0x...
```

### Installation

```bash
# From the monorepo root
pnpm install

# Navigate to web app
cd apps/web

# Run development server
pnpm dev
```

## 🔐 KYC Integration

The app integrates with the KYC service for identity verification:

1. **First-time users** are prompted to verify their identity
2. **Verification status** is stored locally and checked on-chain
3. **Privacy-preserving** through iExec DataProtector
4. **One-time process** - users only verify once per wallet

### Verification Flow

```typescript
// Check verification status
const isVerified = checkWalletVerification(address);

// Redirect to KYC if needed
if (!isVerified) {
  window.location.href = `${KYC_URL}?wallet=${address}`;
}

// Return from KYC
handleVerificationCallback();
```

## 🎯 Key User Flows

### 1. First-Time User Flow
```
Connect Wallet → KYC Verification → Start Chat → Send Message
```

### 2. Returning User Flow
```
Connect Wallet → Verification Check → Resume Chat
```

### 3. Donor Flow
```
Connect Wallet → Navigate to Donate → Select Amount → Confirm Transaction → View on Ledger
```