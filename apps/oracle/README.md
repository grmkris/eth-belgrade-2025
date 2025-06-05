# ChatBot Oracle Web API

A refactored version of the ChatBot Oracle that provides a REST API with SIWE (Sign-In with Ethereum) authentication and streaming chat responses.

## Features

- 🔐 **SIWE Authentication**: Secure authentication using Ethereum signatures
- 🌊 **Streaming Responses**: Real-time streaming of AI responses
- 📜 **Conversation History**: Retrieve past conversations stored on-chain
- 🚀 **Built with Bun**: Fast runtime with built-in server
- 🔗 **Blockchain Integration**: Stores conversations on Sapphire testnet
- 🤖 **AI-Powered**: Uses Claude 3.5 Sonnet via OpenRouter

## Prerequisites

- Bun runtime
- OpenRouter API key
- Sapphire testnet access
- Contract deployed on Sapphire

## Environment Variables

Create a `.env` file in the oracle directory:

```bash
# Required
CONTRACT_ADDRESS=0x...                    # Your deployed oracle contract address
PRIVATE_KEY=0x...                        # Private key for oracle operations
OPENROUTER_API_KEY=your_openrouter_key   # OpenRouter API key

# Optional
NETWORK_NAME=sapphire-testnet            # Network name (default: sapphire-testnet)
ROFL_URL=                                # ROFL URL if using ROFL
PORT=3001                                # Server port (default: 3001)
```

## Installation

```bash
# Install dependencies
pnpm install

# Start the server
bun run oracleWEB.ts
```

## API Endpoints

### Health Check

```http
GET /health
```

Returns server status and timestamp.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Chat with AI

```http
POST /chat
```

Send a message to the AI with SIWE authentication. Returns a streaming response.

**Request Body:**
```json
{
  "message": "domain.com wants you to sign in...",  // SIWE message
  "signature": "0x...",                             // Ethereum signature
  "userMessage": "Hello, explain blockchain oracles" // Your message to AI
}
```

**Response:**
- Content-Type: `text/plain; charset=utf-8`
- Streaming response with AI-generated text

### Get Conversation History

```http
POST /history
```

Retrieve your conversation history stored on-chain.

**Request Body:**
```json
{
  "message": "domain.com wants you to sign in...",  // SIWE message
  "signature": "0x..."                              // Ethereum signature
}
```

**Response:**
```json
{
  "userAddress": "0x...",
  "conversation": [
    {
      "type": "user",
      "content": "Hello",
      "timestamp": 0
    },
    {
      "type": "assistant", 
      "content": "Hi there!",
      "timestamp": 0
    }
  ],
  "totalPrompts": 1,
  "totalAnswers": 1
}
```

## SIWE Authentication

The API uses [Sign-In with Ethereum (EIP-4361)](https://eips.ethereum.org/EIPS/eip-4361) for authentication. Here's how it works:

1. **Create SIWE Message**: Generate a standardized message
2. **Sign Message**: Sign with your Ethereum private key
3. **Send Request**: Include message and signature in API calls
4. **Verification**: Server verifies signature using [viem's SIWE utilities](https://viem.sh/docs/siwe/actions/verifySiweMessage)

### Example SIWE Message

```
localhost:3001 wants you to sign in with your Ethereum account:
0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

Sign in to ChatBot Oracle

URI: http://localhost:3001/chat
Version: 1
Chain ID: 23295
Nonce: K7dmvPxA3sqd9suXiPiRgxoQp
Issued At: 2024-01-01T00:00:00.000Z
Expiration Time: 2024-01-02T00:00:00.000Z
```

## Usage Example

See `example-client.ts` for a complete example. Here's a quick snippet:

```typescript
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sapphireTestnet } from 'viem/chains';
import { createSiweMessage, generateSiweNonce } from 'viem/siwe';

// Setup wallet
const account = privateKeyToAccount('0x...');
const walletClient = createWalletClient({
  account,
  chain: sapphireTestnet,
  transport: http('https://testnet.sapphire.oasis.io'),
});

// Create and sign SIWE message
const siweMessage = createSiweMessage({
  address: account.address,
  chainId: sapphireTestnet.id,
  domain: 'localhost:3001',
  nonce: generateSiweNonce(),
  uri: 'http://localhost:3001/chat',
  version: '1',
  statement: 'Sign in to ChatBot Oracle',
  issuedAt: new Date(),
  expirationTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
});

const signature = await walletClient.signMessage({
  account,
  message: siweMessage,
});

// Send chat request
const response = await fetch('http://localhost:3001/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: siweMessage,
    signature: signature,
    userMessage: "Hello! Can you explain blockchain oracles?",
  }),
});

// Handle streaming response
const reader = response.body?.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value, { stream: true });
  process.stdout.write(chunk);
}
```

## Testing

Run the example client to test the API:

```bash
# Start the oracle server
bun run oracleWEB.ts

# In another terminal, run the example client
bun run example-client.ts
```

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Oracle API    │    │   Blockchain    │
│                 │    │                 │    │                 │
│ 1. Create SIWE  │───▶│ 2. Verify SIWE  │    │                 │
│ 2. Sign message │    │ 3. Get history  │◀──▶│ Smart Contract  │
│ 3. Send request │    │ 4. Call AI      │    │                 │
│ 4. Stream resp. │◀───│ 5. Store result │───▶│                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Key Changes from Original

1. **Web API**: REST endpoints instead of event polling
2. **SIWE Auth**: Secure authentication with Ethereum signatures  
3. **Streaming**: Real-time response streaming
4. **Bun Server**: Uses Bun's built-in server instead of Node.js
5. **Modular**: Clean separation of concerns

## Error Handling

The API returns appropriate HTTP status codes:

- `200`: Success
- `400`: Bad Request (missing fields)
- `401`: Unauthorized (invalid SIWE signature)
- `500`: Internal Server Error

## CORS

CORS is configured to allow requests from:
- `http://localhost:3000`
- `http://localhost:5173`
- Your production domain (update in code)

## Security Considerations

- SIWE messages should have reasonable expiration times
- Nonces should be unique to prevent replay attacks
- Always verify signatures on the server side
- Consider rate limiting in production
- Store private keys securely

## Dependencies

- **viem**: Ethereum client with SIWE support
- **hono**: Fast web framework
- **ai**: AI SDK for streaming responses
- **@openrouter/ai-sdk-provider**: OpenRouter integration

## License

ISC 