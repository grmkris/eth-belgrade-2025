import {
  createPublicClient,
  createWalletClient,
  http,
  type Abi,
  type Address,
  type Hex,
  type PublicClient,
  type WalletClient,
  webSocket,
  parseAbiItem,
  encodeFunctionData,
} from 'viem';
import { privateKeyToAccount, type PrivateKeyAccount } from 'viem/accounts';
import { mainnet } from 'viem/chains'; // Or your specific chain
import { readFileSync } from 'fs';
import { join, resolve } from 'path';
import { oracleAbi } from './oracleAbi.js';

// Interfaces
interface ChatMessage {
  role: string;
  content: string;
}

interface OllamaResponse {
  message: {
    content: string;
  };
}

interface ContractData {
  abi: Abi;
  bytecode: {
    object: Hex;
  };
}

interface RoflKeyResponse {
  key: string;
}

interface RoflTxPayload {
  tx: {
    kind: string;
    data: {
      gas_limit?: bigint | number | string;
      to?: string;
      value?: bigint | number | string;
      data?: string;
    };
  };
  encrypted: boolean;
}

interface ContractUtility {
  publicClient: PublicClient;
  walletClient: WalletClient;
  account: PrivateKeyAccount;
}

interface RoflUtility {
  baseUrl: string;
}

interface ChatBotOracle {
  contractAddress: Address;
  publicClient: PublicClient;
  walletClient: WalletClient;
  account: PrivateKeyAccount;
  roflUtility: RoflUtility;
  ollamaAddress: string;
}

// ContractUtility functions
function createContractUtility(networkName: string, secret: Hex): ContractUtility {
  const networks: Record<string, string> = {
    "sapphire": "https://sapphire.oasis.io",
    "sapphire-testnet": "https://testnet.sapphire.oasis.io",
    "sapphire-localnet": "http://localhost:8545",
  };
  
  const networkUrl = networks[networkName] || networkName;
  const account = privateKeyToAccount(secret);
  
  const transport = networkUrl.startsWith("ws") 
    ? webSocket(networkUrl) 
    : http(networkUrl);

  const publicClient = createPublicClient({
    chain: mainnet, // Replace with your actual chain definition if not mainnet compatible
    transport,
  });

  const walletClient = createWalletClient({
    account: account,
    chain: mainnet, // Replace with your actual chain
    transport,
  });
  
  return {
    publicClient,
    walletClient,
    account,
  };
}

// RoflUtility functions
function createRoflUtility(url: string = ''): RoflUtility {
  const ROFL_SOCKET_URL_PREFIX = "unix:"; // For Bun's fetch with UDS
  const ROFL_DEFAULT_SOCKET_PATH = "/run/rofl-appd.sock";
  
  let baseUrl: string;
  
  if (url && !url.startsWith('http') && !url.startsWith(ROFL_SOCKET_URL_PREFIX)) {
    // Assuming it's a file path for a UDS if not http/https and not already prefixed
    baseUrl = ROFL_SOCKET_URL_PREFIX + url;
    console.log(`Using Unix domain socket via fetch: ${baseUrl}`);
  } else if (!url) {
    baseUrl = ROFL_SOCKET_URL_PREFIX + ROFL_DEFAULT_SOCKET_PATH;
    console.log(`Using default Unix domain socket via fetch: ${baseUrl}`);
  } else {
    // Assumes http or https if prefixed accordingly, or already a full UDS URL
    baseUrl = url;
    if (baseUrl.startsWith(ROFL_SOCKET_URL_PREFIX)) {
      console.log(`Using Unix domain socket via fetch: ${baseUrl}`);
    } else {
      console.log(`Using HTTP socket: ${baseUrl}`);
    }
  }
  
  return { baseUrl };
}

async function roflPost(roflUtility: RoflUtility, path: string, payload: any): Promise<any> {
  const ROFL_SOCKET_URL_PREFIX = "unix:";
  const fullUrl = roflUtility.baseUrl.startsWith(ROFL_SOCKET_URL_PREFIX) 
      ? `${roflUtility.baseUrl}:${path}` // Special format for Bun's fetch with UDS and path
      : `${roflUtility.baseUrl}${path}`;

  const options: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  };
  
  console.log(`  Posting ${JSON.stringify(payload)} to ${fullUrl}`);
  
  const response = await fetch(fullUrl, options);
  
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
  }
  
  return response.json();
}

async function fetchKey(roflUtility: RoflUtility, id: string): Promise<string> {
  const payload = {
    key_id: id,
    kind: "secp256k1"
  };

  const path = '/rofl/v1/keys/generate';
  const response = await roflPost(roflUtility, path, payload) as RoflKeyResponse;
  return response.key;
}

async function submitTx(roflUtility: RoflUtility, tx: {
    gas?: bigint | number | string;
    to?: Address;
    value?: bigint | number | string;
    data?: Hex;
}): Promise<Hex> {
  const payload: RoflTxPayload = {
    tx: {
      kind: "eth",
      data: {
        gas_limit: tx.gas,
        to: tx.to?.startsWith('0x') ? tx.to.substring(2) : tx.to,
        value: tx.value,
        data: tx.data?.startsWith('0x') ? tx.data.substring(2) : tx.data,
      },
    },
    encrypted: false,
  };

  const path = '/rofl/v1/tx/sign-submit';
  // The response from ROFL for submit_tx is expected to be a transaction hash (string/Hex)
  const response = await roflPost(roflUtility, path, payload);
  // Assuming the response itself is the transaction hash string
  if (typeof response === 'string' && response.startsWith('0x')) {
      return response as Hex;
  } else if (response && typeof response.tx_hash === 'string' && response.tx_hash.startsWith('0x')) { // Or if it's nested
      return response.tx_hash as Hex;
  }
  throw new Error("Invalid transaction hash format received from ROFL");
}

// ChatBotOracle functions
function createChatBotOracle(
  contractAddress: Address,
  networkName: string,
  ollamaAddress: string,
  roflUtility: RoflUtility,
  secret: Hex
): ChatBotOracle {
  const contractUtility = createContractUtility(networkName, secret);
  
  return {
    contractAddress,
    publicClient: contractUtility.publicClient,
    walletClient: contractUtility.walletClient,
    account: contractUtility.account,
    roflUtility,
    ollamaAddress,
  };
}

async function setOracleAddress(oracle: ChatBotOracle): Promise<void> {
  const contractAddr = await oracle.publicClient.readContract({
    address: oracle.contractAddress,
    abi: oracleAbi,
    functionName: 'oracle',
  }) as Address;
  
  const ourAddress = oracle.account.address;
  
  if (contractAddr.toLowerCase() !== ourAddress.toLowerCase()) {
    console.log(`Contract oracle ${contractAddr} does not match our address ${ourAddress}, updating...`);
    
    const { request } = await oracle.publicClient.simulateContract({
      account: oracle.account,
      address: oracle.contractAddress,
      abi: oracleAbi,
      functionName: 'setOracle',
      args: [ourAddress],
    });
    
    // ROFL submit
    const txHash = await submitTx(oracle.roflUtility, {
        to: request.address,
        data: encodeFunctionData({
          abi: oracleAbi,
          functionName: 'setOracle',
          args: [ourAddress],
        }),
        gas: request.gas,
        value: request.value
    });

    console.log(`ROFL submitTx hash: ${txHash}`);
    const txReceipt = await oracle.publicClient.waitForTransactionReceipt({ hash: txHash });
    console.log(`Updated. Transaction hash: ${txReceipt.transactionHash}`);
  } else {
    console.log(`Contract oracle ${contractAddr} matches our address ${ourAddress}`);
  }
}

async function logLoop(oracle: ChatBotOracle, pollInterval: number): Promise<void> {
  console.log("Listening for prompts...");
  let lastCheckedBlock = await oracle.publicClient.getBlockNumber() - 1n; // Start from one block behind initially

  // Define the event ABI item for type-safe event parsing
  const promptSubmittedEvent = parseAbiItem('event PromptSubmitted(address indexed sender, uint256 promptId, string prompt)');

  while (true) {
    try {
      const currentBlock = await oracle.publicClient.getBlockNumber();
      if (currentBlock > lastCheckedBlock) {
        const logs = await oracle.publicClient.getLogs({
          address: oracle.contractAddress,
          event: promptSubmittedEvent,
          fromBlock: lastCheckedBlock + 1n,
          toBlock: currentBlock
        });

        for (const log of logs) {
          // Types will be inferred from promptSubmittedEvent
          const submitter = log.args.sender;
          const promptId = log.args.promptId; 
          // const promptContent = log.args.prompt; // The actual prompt string from event if needed

          if (!submitter) {
              console.warn("Log with undefined sender, skipping:", log);
              continue;
          }
          console.log(`New prompt submitted by ${submitter} (ID: ${promptId})`);
          
          const prompts = await retrievePrompts(oracle, submitter);
          console.log(`Got ${prompts.length} prompts from ${submitter}`);
          
          const answers = await retrieveAnswers(oracle, submitter);
          console.log(`Got ${answers.length} answers from ${submitter}`);
          
          // Check if the latest promptId from the event has been answered
          // Assuming answers are (promptId, answerString)
          const lastAnswer = answers.length > 0 ? answers[answers.length - 1] : undefined;
          if (lastAnswer && lastAnswer[0] === prompts.length - 1) {
            console.log(`Last prompt (ID: ${prompts.length -1}) already answered, skipping response for this event if it matches.`);
            // This check might need refinement based on how promptIds from event and array indices align
            if (promptId === BigInt(prompts.length -1)) {
                continue;
            }
          }
          
          console.log("Asking chat bot for all prompts...");
          const answerText = await askChatBot(oracle, prompts);
          
          const currentPromptIdToAnswer = prompts.length - 1;
          console.log(`Storing chat bot answer for prompt ID ${currentPromptIdToAnswer} for ${submitter}`);
          await submitAnswer(oracle, answerText, currentPromptIdToAnswer, submitter);
        }
        lastCheckedBlock = currentBlock;
      }
    } catch (error) {
      console.error("Error in log loop:", error);
    }
    
    await new Promise(resolve => setTimeout(resolve, pollInterval * 1000));
  }
}

async function runOracle(oracle: ChatBotOracle): Promise<void> {
  await setOracleAddress(oracle);
  await logLoop(oracle, 2); // Poll interval in seconds
}

async function retrievePrompts(oracle: ChatBotOracle, address: Address): Promise<string[]> {
  try {
    // The `b''` in Python corresponds to an empty bytes string.
    // In viem, for bytes, use '0x'. If it's meant to be an empty string argument, use ''.
    // Assuming the contract expects an empty bytes string for the first arg.
    const prompts = await oracle.publicClient.readContract({
      address: oracle.contractAddress,
      abi: oracleAbi,
      functionName: 'getPrompts',
      args: ['0x', address], // Or [''] if it's an empty string
    }) as string[];
    return prompts;
  } catch (error) {
    console.error("Error retrieving prompts:", error);
    return [];
  }
}

async function retrieveAnswers(oracle: ChatBotOracle, address: Address): Promise<[number, string][]> {
  try {
    const answers = await oracle.publicClient.readContract({
      address: oracle.contractAddress,
      abi: oracleAbi,
      functionName: 'getAnswers',
      args: ['0x', address], // Or ['']
    });
    
    // Convert bigint prompt IDs to numbers for JS/TS consistency if needed in app logic
    return answers.map(({ promptId, answer }) => [Number(promptId), answer]);
  } catch (error) {
    console.error("Error retrieving answers:", error);
    return [];
  }
}

async function askChatBot(oracle: ChatBotOracle, prompts: string[]): Promise<string> {
  try {
    const messages: ChatMessage[] = prompts.map(prompt => ({
      role: 'user',
      content: prompt
    }));

    const response = await fetch(`${oracle.ollamaAddress}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-r1:1.5b', // Ensure this model is available in your Ollama instance
        messages: messages,
        stream: false // As per original Python code
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
    }

    const data = await response.json() as OllamaResponse;
    if (data && data.message && typeof data.message.content === 'string') {
      return data.message.content;
    }
    throw new Error("Invalid response structure from Ollama API");
  } catch (error) {
    console.error("Error calling Ollama API:", error);
    return "Error generating response"; // Default error message
  }
}

async function submitAnswer(oracle: ChatBotOracle, answer: string, promptId: number, recipientAddress: Address): Promise<void> {
  console.log(`Submitting answer for promptId ${promptId} to ${recipientAddress}`);
  try {
    const { request } = await oracle.publicClient.simulateContract({
      account: oracle.account,
      address: oracle.contractAddress,
      abi: oracleAbi,
      functionName: 'submitAnswer',
      args: [answer, BigInt(promptId), recipientAddress],
       // gas: BigInt(Math.max(3000000, 1500 * answer.length)), // Gas can be estimated by simulateContract
    });

    const txHashRofl = await submitTx(oracle.roflUtility, {
        to: request.address,
        data: encodeFunctionData({
          abi: oracleAbi,
          functionName: 'submitAnswer',
          args: [answer, BigInt(promptId), recipientAddress],
        }),
        gas: request.gas,
        value: request.value
    });
    console.log(`ROFL submitTx hash for answer: ${txHashRofl}`);

    const txReceipt = await oracle.publicClient.waitForTransactionReceipt({ hash: txHashRofl });
    console.log(`Submitted answer. Transaction hash: ${txReceipt.transactionHash}`);

  } catch (error) {
      console.error(`Error submitting answer for promptId ${promptId}:`, error);
      // Decide if you want to throw, or handle, or retry
  }
}

// Export functions for external use (if needed by other modules)
export { 
  createContractUtility, 
  createRoflUtility, 
  fetchKey, 
  submitTx, 
  createChatBotOracle, 
  runOracle 
};

// Main entry point for running the oracle if this script is run directly
// Check if this is the main module using import.meta.url
const isMainModule = import.meta.url === `file://${process.argv[1]}`;

if (isMainModule) {
  const contractAddress = process.env.CONTRACT_ADDRESS as Address | undefined;
  const networkName = process.env.NETWORK_NAME || 'sapphire-testnet';
  const ollamaAddress = process.env.OLLAMA_ADDRESS || 'http://localhost:11434';
  const secret = process.env.PRIVATE_KEY as Hex | undefined;
  
  if (!contractAddress || !secret) {
    console.error("Missing required environment variables: CONTRACT_ADDRESS (0x...) and PRIVATE_KEY (0x...).");
    process.exit(1);
  }
  
  const roflUrl = process.env.ROFL_URL || ''; // e.g. http://localhost:7635 or /tmp/rofl.sock
  const roflUtility = createRoflUtility(roflUrl);
  
  const oracle = createChatBotOracle(
    contractAddress,
    networkName,
    ollamaAddress,
    roflUtility,
    secret
  );
  
  console.log("Starting ChatBotOracle...");
  runOracle(oracle).catch(error => {
    console.error("Oracle stopped due to an error:", error);
    process.exit(1);
  });
}
