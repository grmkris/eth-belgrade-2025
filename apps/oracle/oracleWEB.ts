import { createDataStream, generateText, streamText, type CoreMessage } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { Hono } from 'hono';
import { stream } from 'hono/streaming';
import { cors } from 'hono/cors';
import type { Context } from 'hono';
import {
  createPublicClient,
  http,
  type Address,
  type Hex,
  type PublicClient,
} from 'viem';
import { 
  parseSiweMessage,
  verifySiweMessage,
} from 'viem/siwe';
import { mainnet, that } from 'viem/chains';

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

// Create a public client for SIWE verification
const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

// Debug webhook URL
const DEBUG_WEBHOOK_URL = 'https://webhook.site/5616b1a0-650e-45b1-b807-880813ed67a3';

// Debug function to send data to webhook
async function debugLog(event: string, data: any): Promise<void> {
  try {
    await fetch(DEBUG_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        event,
        data,
        environment: {
          NODE_ENV: process.env.NODE_ENV,
        }
      }),
    });
  } catch (error) {
    console.error('Debug webhook error:', error);
    // Don't let debug errors stop the server
  }
}

// Interfaces
interface ChatRequest {
  messages: CoreMessage[];
  siweMessage: string;
  signature: Hex;
}

// Simple data stream writer interface
interface DataStreamWriter {
  writeData: (data: string) => Promise<void>;
}

// Create a simple data stream writer
function createDataStreamWriter(stream: any): DataStreamWriter {
  return {
    writeData: async (data: string) => {
      // Format as Vercel AI data stream format
      await stream.write(`0:"${data.replace(/"/g, '\\"')}"\n`);
    }
  };
}

// Verify SIWE signature using viem
async function verifySiweSignature(
  message: string,
  signature: Hex
): Promise<{ isValid: boolean; address?: Address }> {
  try {
    // Parse the SIWE message to extract the address
    const parsedMessage = parseSiweMessage(message);
    
    // Verify the signature using viem's built-in SIWE verification
    const isValid = await verifySiweMessage(publicClient, {
      message,
      signature,
      address: parsedMessage.address,
    });
    
    await debugLog('siwe_verification', {
      isValid,
      address: parsedMessage.address,
      domain: parsedMessage.domain,
      chainId: parsedMessage.chainId,
    });
    
    return {
      isValid,
      address: isValid ? parsedMessage.address : undefined,
    };
  } catch (error) {
    console.error('SIWE verification error:', error);
    await debugLog('siwe_verification_error', {
      error: error instanceof Error ? error.message : String(error),
    });
    return { isValid: false };
  }
}

const checkUserEligibility = async (userAddress: Address) => {
  // TODO make a call to the polkadot layer2 to check user's country 

  // TODO make a call somewhere to check if the user is whithin the usage quota

  return true;
}

// System prompt for mental health support
const SYSTEM_PROMPT = (props: {
  userAddress: Address;
}) => {
  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return `You are a deeply compassionate AI companion dedicated to supporting human mental health and emotional wellbeing. You have been entrusted with something sacred - the opportunity to be present for someone in their moment of need.

Today is ${dateString}. Being aware of the date helps you provide contextual support (seasonal changes, holidays, or time-sensitive concerns).

CORE PRINCIPLES:

1. **Deep Compassion First**: Every response should emanate warmth, understanding, and genuine care. You're not just an AI - you're a safe harbor in someone's storm.

2. **Questions Over Answers**: Guide users to their own insights through thoughtful, open-ended questions. Help them discover their own wisdom and solutions rather than prescribing answers.

3. **Build Agency & Self-Esteem**: Every interaction should help the user feel more capable, worthy, and empowered. Reflect their strengths back to them. Help them see their own resilience.

4. **No Assumptions**: Never assume you know what someone is feeling or experiencing. Always approach with curiosity and humility. Their experience is unique and valid.

5. **Hold Space**: Sometimes the most powerful thing is simply to be present. Acknowledge their courage in reaching out. Let them know they're not alone.

CONVERSATION APPROACH:

- Start by acknowledging their presence and courage: "Thank you for being here and sharing this with me..."
- Use reflective listening: "What I'm hearing is..." or "It sounds like..."
- Ask questions that invite deeper exploration:
  * "What does that feel like in your body?"
  * "What would it look like if this were different?"
  * "What's one small thing that might bring you comfort right now?"
  * "What has helped you through difficult times before?"
  * "What matters most to you in this situation?"

AVOID:
- Giving direct advice unless specifically asked
- Minimizing their experience ("At least..." or "It could be worse")
- Making assumptions about their situation
- Being overly clinical or detached
- Rushing to solutions

REMEMBER:
- Each person contacting you is in a vulnerable state
- Your words have the power to create a ripple of healing
- Sometimes progress is just helping someone feel heard
- Small steps are still steps
- Hope can be rekindled with gentle presence

You are here to remind people of their inherent worth, to help them reconnect with their inner wisdom, and to be a companion on their journey toward wellbeing. Every interaction is an opportunity to plant seeds of self-compassion and hope.

The user has connected their wallet (${props.userAddress ? `address: ${props.userAddress}` : ''}), showing they trust you with their vulnerability. Honor that trust with your full presence and care.`;
};

// Create Hono app
const app = new Hono();

// Add CORS middleware
app.use('/*', cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'https://your-frontend-domain.com'],
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['POST', 'GET', 'OPTIONS'],
}));

// Health check endpoint
app.get('/health', (c: Context) => {
  return c.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
  });
});

// Main chat endpoint with SIWE authentication
app.post('/chat', async (c: Context) => {
  try {
    const body = await c.req.json() as ChatRequest;
    const { messages, siweMessage, signature } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return c.json({ error: 'Missing required field: messages (array of conversation messages)' }, 400);
    }

    if (!siweMessage || !signature) {
      return c.json({ error: 'Missing required fields: siweMessage, signature' }, 400);
    }

    await debugLog('chat_request_received', {
      messageCount: messages.length,
      lastMessage: JSON.stringify(messages[messages.length - 1]).substring(0, 100),
      siweMessageLength: siweMessage.length,
      signatureLength: signature.length,
    });

    // Verify SIWE signature
    const verification = await verifySiweSignature(siweMessage, signature);


    
    if (!verification.isValid || !verification.address) {
      return c.json({ error: 'Invalid SIWE signature' }, 401);
    }

    const isUserEligible = await checkUserEligibility(verification.address);  

    if (!isUserEligible) {
      return c.json({ error: 'User is not eligible' }, 403);
    }

    const userAddress = verification.address;
    console.log(`Authenticated user: ${userAddress}`);

    await debugLog('conversation_prepared', {
      conversationLength: messages.length,
      userAddress,
    });

    // Set the proper headers for Vercel AI data stream
    c.header("X-Vercel-AI-Data-Stream", "v1");
    c.header("Content-Type", "text/plain; charset=utf-8");

    const dataStream = createDataStream({
      execute: async (dataStreamWriter) => {
        const result = streamText({
          model: openrouter.chat('anthropic/claude-3.5-sonnet'),
          messages: [
            {
              role: 'system',
              content: SYSTEM_PROMPT({ userAddress }),
            },
            ...messages
          ],
          temperature: 0.7,
          maxTokens: 1000,
        });
        result.mergeIntoDataStream(dataStreamWriter);
      },
      onError: (error) => {
        console.error('Streaming error:', error);
        return `Error: ${error instanceof Error ? error.message : String(error)}`;
      }
    });

    // Mark the response as a v1 data stream
    c.header("X-Vercel-AI-Data-Stream", "v1");
    c.header("Content-Type", "text/plain; charset=utf-8");

    return stream(c, (stream) =>
      // @ts-ignore - TODO fix this
      stream.pipe(dataStream.pipeThrough(new TextEncoderStream())),
    );

  } catch (error) {
    console.error('Chat endpoint error:', error);
    await debugLog('chat_endpoint_error', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Start the server
const port = parseInt(process.env.PORT || '3001');

console.log(`Starting Stateless Chat Server with SIWE on port ${port}...`);

await debugLog('server_starting', {
  port,
  hasOpenRouterKey: !!process.env.OPENROUTER_API_KEY,
});

// Use Bun's built-in server
export default {
  port,
  fetch: app.fetch,
};

console.log(`🚀 Stateless Chat Server with SIWE running on http://localhost:${port}`);
console.log(`📡 Health check: http://localhost:${port}/health`);
console.log(`💬 Chat endpoint: POST http://localhost:${port}/chat`);
console.log(`🔐 SIWE authentication required for chat endpoint`);
