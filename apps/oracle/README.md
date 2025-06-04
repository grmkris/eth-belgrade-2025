# ChatBot Oracle for Sapphire (TypeScript / Bun / Viem)

This application acts as an oracle that listens for `PromptSubmitted` events from a smart contract, queries an Ollama language model with the accumulated prompts, and submits the answer back to the smart contract using ROFL for transaction submission.

## Prerequisites

- [Bun](https://bun.sh/) installed
- Access to a Sapphire network (Testnet, Mainnet, or Localnet)
- An Ollama instance running and accessible (e.g., `http://localhost:11434`)
- A ROFL (Runtime Offload Function Layer) service running and accessible (either via HTTP or Unix Domain Socket).
- A deployed `ChatBot` smart contract whose ABI is available in `../../contracts/out/ChatBot.sol/ChatBot.json` relative to `apps/oracle/oracle.ts`.

## Setup

1.  **Install Dependencies:**
    Navigate to the `apps/oracle` directory and run:
    ```bash
    bun install
    ```

2.  **Environment Variables:**
    Create a `.env` file in the `apps/oracle` directory or set the following environment variables:

    ```env
    # Required
    CONTRACT_ADDRESS="0xYourChatBotContractAddress"
    PRIVATE_KEY="0xYourOraclePrivateKeyForSigningTransactions"

    # Optional (Defaults are shown)
    NETWORK_NAME="sapphire-testnet" # or "sapphire", "sapphire-localnet", or a custom RPC URL
    OLLAMA_ADDRESS="http://localhost:11434"
    ROFL_URL="" # Defaults to Unix socket /run/rofl-appd.sock. Can be http://host:port or path to UDS.
    ```

    -   `CONTRACT_ADDRESS`: The address of your deployed `ChatBot` smart contract.
    -   `PRIVATE_KEY`: The private key of the account that the oracle will use to submit transactions. This account must have funds to pay for gas.
    -   `NETWORK_NAME`: Specifies the Sapphire network. Can be `sapphire`, `sapphire-testnet`, `sapphire-localnet`, or a full HTTP/WebSocket RPC URL.
    -   `OLLAMA_ADDRESS`: The base URL for your Ollama API.
    -   `ROFL_URL`: The URL for the ROFL service. 
        -   If empty or not set, it defaults to the Unix Domain Socket at `/run/rofl-appd.sock`.
        -   For HTTP, use `http://localhost:7635` (or your ROFL port).
        -   For a custom Unix Domain Socket path, provide the absolute path (e.g., `/tmp/rofl.sock`).

## Running the Oracle

Once the dependencies are installed and environment variables are set, you can run the oracle:

```bash
bun start
```

Or for development with live reloading (if you set it up):

```bash
bun dev
```

The oracle will start, attempt to set itself as the oracle address in the smart contract (if not already set), and then begin listening for `PromptSubmitted` events.

## How it Works

1.  **Initialization:** 
    -   Connects to the specified Sapphire network using `viem`.
    -   Loads the `ChatBot` contract ABI.
    -   Sets up a wallet client with the provided private key.
    -   Initializes the `RoflUtility` for communicating with the ROFL service.
2.  **Set Oracle Address:** 
    -   Checks if the oracle's address is registered in the smart contract. 
    -   If not, it submits a transaction (via ROFL) to call the `setOracle` function on the contract.
3.  **Event Loop (`logLoop`):**
    -   Periodically polls for new `PromptSubmitted` events from the smart contract.
    -   For each new prompt:
        -   Retrieves all prompts submitted by the sender from the contract.
        -   Retrieves all existing answers for that sender.
        -   If the latest prompt hasn't been answered, it constructs a message history.
        -   Sends the message history to the Ollama API (`deepseek-r1:1.5b` model by default).
        -   Submits the AI-generated answer back to the `ChatBot` contract's `submitAnswer` function using ROFL.

## Code Structure

-   `oracle.ts`: Main application file containing the `ChatBotOracle`, `ContractUtility`, and `RoflUtility` classes.
-   `package.json`: Project dependencies and scripts.
-   `tsconfig.json`: TypeScript configuration.

### `ContractUtility`

-   Handles `viem` client setup (public and wallet clients).
-   Provides a static method `getContract` to load contract ABI and bytecode from JSON output files.

### `RoflUtility`

-   Manages communication with the ROFL service.
-   `fetchKey`: (Not directly used by the oracle loop but available) Generates/retrieves a key via ROFL.
-   `submitTx`: Sends a transaction signing request to ROFL, which then submits it to the network.
-   Supports communication with ROFL via HTTP/HTTPS or Unix Domain Sockets (using Bun's native `fetch` capabilities).

### `ChatBotOracle`

-   Orchestrates the oracle's logic.
-   `setOracleAddress()`: Ensures the oracle is the designated address on the contract.
-   `logLoop()`: The main event listening and processing loop.
-   `retrievePrompts()`, `retrieveAnswers()`: Fetches data from the smart contract.
-   `askChatBot()`: Interacts with the Ollama API.
-   `submitAnswer()`: Sends the answer to the smart contract via ROFL.

## Important Notes

-   **Chain Configuration:** The `viem` clients in `ContractUtility` are initialized with `mainnet` as a placeholder chain. You **must** replace this with the correct chain definition for your Sapphire network (e.g., if Sapphire provides a `viem` chain object or if you need to define a custom one).
-   **ROFL URL Format for UDS with Path:** When using Bun's `fetch` with a Unix Domain Socket that also requires a path (like ROFL's `/rofl/v1/...`), the URL is constructed as `unix:/path/to/socket.sock:/actual/http/path`. The `RoflUtility` handles this concatenation.
-   **Sapphire Viem Wrapping:** The original Python code used `sapphire.wrap(w3, account)`. This TypeScript version uses a standard `viem` client. If specific Sapphire functionalities (like automatic request/response encryption/decryption at the RPC level) are needed with `viem`, a custom `viem` transport or middleware provided by the Sapphire team would be required. This implementation assumes direct RPC interaction is sufficient or that ROFL handles any necessary wrapping for its submissions.
-   **Error Handling:** Basic error handling is in place. Robust production systems might require more sophisticated error management and retry mechanisms.
-   **Gas Estimation:** Gas for transactions is generally estimated by `viem`'s `simulateContract` or handled by ROFL. The explicit gas calculation from the Python version (`max(3000000, 1500*len(answer))`) has been removed in favor of `viem`'s simulation providing gas estimates for ROFL. 