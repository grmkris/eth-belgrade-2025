import { createWalletClient, http, createPublicClient } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { mainnet } from 'viem/chains';
import { createSiweMessage, generateSiweNonce } from 'viem/siwe';
import type { CoreMessage } from 'ai';

// Example usage of the ChatBot Oracle API with SIWE authentication

async function exampleChatRequest() {
  // Setup wallet (in a real app, this would come from user's wallet)
  const privateKey = '0x' + '1'.repeat(64); // Example private key - use a real one
  const account = privateKeyToAccount(privateKey as `0x${string}`);
  
  const walletClient = createWalletClient({
    account,
    chain: mainnet,
    transport: http(),
  });

  try {
    // 1. Create SIWE message
    const siweMessage = createSiweMessage({
      address: account.address,
      chainId: mainnet.id,
      domain: 'localhost:3001', // Your oracle server domain
      nonce: generateSiweNonce(),
      uri: 'http://localhost:3001/chat',
      version: '1',
      statement: 'Sign in to ChatBot Oracle',
      issuedAt: new Date(),
      expirationTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    console.log('SIWE Message:', siweMessage);

    // 2. Sign the message
    const signature = await walletClient.signMessage({
      account,
      message: siweMessage,
    });

    console.log('Signature:', signature);

    // 3. Prepare conversation messages
    const messages: CoreMessage[] = [
      {
        role: 'user',
        content: "Hello! Can you explain what blockchain oracles are?"
      }
    ];

    // 4. Send chat request to oracle
    const chatRequest = {
      messages: messages,
      siweMessage: siweMessage,
      signature: signature,
    };

    console.log('Sending chat request...');

    const response = await fetch('http://localhost:3001/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(chatRequest),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Chat request failed:', error);
      return;
    }

    // 5. Handle streaming response
    const reader = response.body?.getReader();
    if (!reader) {
      console.error('No response body');
      return;
    }

    console.log('\n--- AI Response (Streaming) ---');
    const decoder = new TextDecoder();
    let fullResponse = '';
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value, { stream: true });
      fullResponse += chunk;
      process.stdout.write(chunk); // Stream the response to console
    }
    
    console.log('\n--- End of Response ---\n');

    // Return the conversation for follow-up
    return {
      messages: [
        ...messages,
        { role: 'assistant' as const, content: fullResponse }
      ],
      siweMessage,
      signature
    };

  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

async function exampleFollowUpRequest(previousConversation: {
  messages: CoreMessage[];
  siweMessage: string;
  signature: string;
}) {
  try {
    // Add a follow-up question to the conversation
    const updatedMessages: CoreMessage[] = [
      ...previousConversation.messages,
      {
        role: 'user',
        content: "Can you give me a specific example of how oracles work in DeFi?"
      }
    ];

    const chatRequest = {
      messages: updatedMessages,
      siweMessage: previousConversation.siweMessage,
      signature: previousConversation.signature,
    };

    console.log('Sending follow-up chat request...');

    const response = await fetch('http://localhost:3001/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(chatRequest),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Follow-up chat request failed:', error);
      return;
    }

    // Handle streaming response
    const reader = response.body?.getReader();
    if (!reader) {
      console.error('No response body');
      return;
    }

    console.log('\n--- AI Follow-up Response (Streaming) ---');
    const decoder = new TextDecoder();
    let fullResponse = '';
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value, { stream: true });
      fullResponse += chunk;
      process.stdout.write(chunk);
    }
    
    console.log('\n--- End of Follow-up Response ---\n');

  } catch (error) {
    console.error('Error in follow-up request:', error);
  }
}

async function exampleMultiTurnConversation() {
  // Setup wallet
  const privateKey = '0x' + '1'.repeat(64); // Example private key - use a real one
  const account = privateKeyToAccount(privateKey as `0x${string}`);
  
  const walletClient = createWalletClient({
    account,
    chain: mainnet,
    transport: http(),
  });

  try {
    // Create SIWE message (reusable for the session)
    const siweMessage = createSiweMessage({
      address: account.address,
      chainId: mainnet.id,
      domain: 'localhost:3001',
      nonce: generateSiweNonce(),
      uri: 'http://localhost:3001/chat',
      version: '1',
      statement: 'Multi-turn conversation with ChatBot Oracle',
      issuedAt: new Date(),
      expirationTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    const signature = await walletClient.signMessage({
      account,
      message: siweMessage,
    });

    // Start with an empty conversation
    let messages: CoreMessage[] = [];

    // Helper function to send a message and get response
    const sendMessage = async (userMessage: string): Promise<string> => {
      messages.push({ role: 'user', content: userMessage });

      const response = await fetch('http://localhost:3001/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages,
          siweMessage: siweMessage,
          signature: signature,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Chat request failed: ${JSON.stringify(error)}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let fullResponse = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullResponse += decoder.decode(value, { stream: true });
      }

      messages.push({ role: 'assistant', content: fullResponse });
      return fullResponse;
    };

    console.log('\n=== Multi-turn Conversation Example ===');

    // Turn 1
    console.log('\nUser: What is Ethereum?');
    const response1 = await sendMessage('What is Ethereum?');
    console.log('\nAssistant:', response1.substring(0, 200) + '...');

    // Turn 2
    console.log('\nUser: How does it differ from Bitcoin?');
    const response2 = await sendMessage('How does it differ from Bitcoin?');
    console.log('\nAssistant:', response2.substring(0, 200) + '...');

    // Turn 3
    console.log('\nUser: Can you summarize our conversation?');
    const response3 = await sendMessage('Can you summarize our conversation?');
    console.log('\nAssistant:', response3.substring(0, 200) + '...');

    console.log(`\n=== Conversation completed with ${messages.length} messages ===`);

  } catch (error) {
    console.error('Error in multi-turn conversation:', error);
  }
}

// Run examples
async function main() {
  console.log('=== ChatBot Oracle API Example ===\n');
  
  // Test health endpoint first
  try {
    const healthResponse = await fetch('http://localhost:3001/health');
    const health = await healthResponse.json();
    console.log('Health check:', health);
  } catch (error) {
    console.error('Oracle server is not running. Please start it first with: bun run oracleWEB.ts');
    return;
  }

  console.log('\n1. Testing single chat request...');
  const conversation = await exampleChatRequest();

  if (conversation) {
    console.log('\n2. Testing follow-up request...');
    await exampleFollowUpRequest(conversation);
  }

  console.log('\n3. Testing multi-turn conversation...');
  await exampleMultiTurnConversation();
}

// Only run if this file is executed directly
if (import.meta.main) {
  main().catch(console.error);
}

export { exampleChatRequest, exampleFollowUpRequest, exampleMultiTurnConversation }; 