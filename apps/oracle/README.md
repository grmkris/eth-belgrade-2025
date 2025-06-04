# ChatBot Oracle for Sapphire (ROFL Deployment)

This application acts as an oracle that listens for `PromptSubmitted` events from a smart contract, queries an Ollama language model with the accumulated prompts, and submits the answer back to the smart contract using ROFL for transaction submission.

This oracle runs inside a Trusted Execution Environment (TEE) using Oasis ROFL (Runtime OFfload Layer), ensuring secure and confidential execution.

## Prerequisites

- [Bun](https://bun.sh/) installed (for local development)
- [Docker](https://docker.com/) installed
- [Oasis CLI](https://github.com/oasisprotocol/cli/releases) installed
- Access to a Sapphire network (Testnet recommended for development)
- An Ollama instance accessible from the internet (for ROFL to connect to)
- A deployed `ChatBot` smart contract
- Oasis Sapphire Testnet account with ~110 TEST tokens

## Local Development Setup

1. **Install Dependencies:**
   ```bash
   cd apps/oracle
   bun install
   ```

2. **Configure Environment:**
   Copy `env.example` to `.env` and fill in your values:
   ```bash
   cp env.example .env
   ```

3. **Update ABI:**
   Replace the placeholder ABI in `oracleAbi.js` with your actual ChatBot contract ABI.

4. **Test Locally:**
   ```bash
   bun run oracle.ts
   ```

## Docker Setup

1. **Build the Docker Image:**
   ```bash
   docker compose build
   ```

2. **Test Locally with Docker:**
   ```bash
   docker compose up
   ```

3. **Push to Registry (Required for ROFL):**
   
   First, update the `image:` field in `compose.yaml` to point to your registry:
   ```yaml
   image: "ghcr.io/your_username/chatbot-oracle"
   # or
   image: "docker.io/your_username/chatbot-oracle"
   ```

   Then build and push:
   ```bash
   docker compose build
   docker compose push
   ```

## ROFL Deployment

### Step 1: Setup Oasis CLI and Account

1. **Create or Import Account:**
   ```bash
   # Create new account
   oasis wallet create

   # Or import existing account
   oasis wallet import
   ```

2. **Fund Account:**
   - Visit the [Oasis Testnet Faucet](https://faucet.testnet.oasis.io/)
   - Request ~110 TEST tokens (100 for escrow + 10 for gas fees)
   - Or reach out on [Discord #dev-central](https://discord.gg/oasisprotocol)

### Step 2: Initialize ROFL App

```bash
# Generate rofl.yaml manifest and register new ROFL app
oasis rofl init
oasis rofl create
```

### Step 3: Build ROFL Bundle

```bash
# Build the .orc bundle for TEE execution
oasis rofl build
```

### Step 4: Store Secrets Securely

Store your sensitive environment variables encrypted on-chain:

```bash
# Store private key securely
echo -n "0xYourPrivateKeyHere" | oasis rofl secret set PRIVATE_KEY -

# Store contract address
echo -n "0xYourContractAddress" | oasis rofl secret set CONTRACT_ADDRESS -

# Store Ollama API endpoint (if using external service)
echo -n "https://your-ollama-endpoint.com" | oasis rofl secret set OLLAMA_ADDRESS -

# Optional: Store custom network or ROFL URL
echo -n "sapphire-testnet" | oasis rofl secret set NETWORK_NAME -
```

### Step 5: Update and Deploy

```bash
# Submit secrets and signatures on-chain
oasis rofl update

# Deploy to ROFL provider's TEE node
oasis rofl deploy
```

## Environment Variables

### Required (Store as ROFL secrets)
- `CONTRACT_ADDRESS`: Your deployed ChatBot contract address
- `PRIVATE_KEY`: Oracle account private key (must have funds for gas)

### Optional (with defaults)
- `NETWORK_NAME`: `sapphire-testnet` (or `sapphire`, `sapphire-localnet`)
- `OLLAMA_ADDRESS`: `http://localhost:11434` (update for external Ollama service)
- `ROFL_URL`: Empty (uses default ROFL socket)

## How It Works in ROFL

1. **Secure Execution:** The oracle runs inside a TEE, ensuring code integrity and confidentiality
2. **Secret Management:** Sensitive data (private keys, API tokens) are encrypted and stored on-chain
3. **Network Access:** The TEE can make outbound HTTP requests to Ollama APIs
4. **Blockchain Interaction:** ROFL provides secure transaction signing and submission
5. **Event Monitoring:** Continuously monitors for `PromptSubmitted` events
6. **AI Integration:** Queries Ollama with conversation history and submits responses

## Monitoring Your ROFL App

After deployment, you can:

1. **Check Status:**
   ```bash
   oasis rofl show
   ```

2. **View Logs:**
   ```bash
   oasis rofl logs
   ```

3. **Monitor on Explorer:**
   Visit [Oasis Explorer](https://explorer.oasis.io/testnet/sapphire) and search for your ROFL app address

## Important Notes

- **Chain Configuration:** Update the chain configuration in `oracle.ts` if not using Sapphire Testnet
- **ABI Updates:** Replace the placeholder ABI in `oracleAbi.js` with your actual contract ABI
- **Ollama Access:** Ensure your Ollama instance is accessible from the internet for ROFL to connect
- **Model Availability:** Verify the `deepseek-r1:1.5b` model is available in your Ollama instance
- **Gas Management:** The oracle account needs sufficient funds for transaction fees
- **Security:** Never expose private keys in code or logs - always use ROFL secrets

## Troubleshooting

1. **Build Failures:** Ensure all dependencies are properly installed and ABI is valid
2. **Secret Issues:** Verify secrets are properly set with `oasis rofl secret list`
3. **Network Errors:** Check Ollama endpoint accessibility and network configuration
4. **Transaction Failures:** Ensure oracle account has sufficient funds and proper permissions

## Example: Complete Deployment

```bash
# 1. Setup
oasis wallet create
# Fund account with TEST tokens

# 2. Initialize ROFL
oasis rofl init
oasis rofl create

# 3. Build
docker compose build
docker compose push
oasis rofl build

# 4. Store secrets
echo -n "0xYourPrivateKey" | oasis rofl secret set PRIVATE_KEY -
echo -n "0xYourContractAddress" | oasis rofl secret set CONTRACT_ADDRESS -
echo -n "https://your-ollama.com" | oasis rofl secret set OLLAMA_ADDRESS -

# 5. Deploy
oasis rofl update
oasis rofl deploy

# 6. Monitor
oasis rofl show
oasis rofl logs
```

Congratulations! Your ChatBot Oracle is now running securely in a Trusted Execution Environment! 🎉

## Resources

- [Oasis ROFL Documentation](https://docs.oasis.io/dapp/sapphire/rofl)
- [Oasis CLI Documentation](https://docs.oasis.io/general/manage-tokens/cli)
- [Sapphire Network Information](https://docs.oasis.io/dapp/sapphire/network)
- [Oasis Discord Community](https://discord.gg/oasisprotocol) 