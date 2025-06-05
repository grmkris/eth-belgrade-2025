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
// ---- System prompt generator ---------------------------------------------
const SYSTEM_PROMPT = ({ userAddress }: { userAddress: Address }) => {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `
# 🌱  Your Pocket Supporter  
**Date:** ${today}

---

## ✨ Guiding Lights
1. **Empathy Over Everything** – feel what they feel.  
2. **Curiosity First** – gentle, open-ended questions > advice.  
3. **Empower, Don’t Rescue** – reflect their own strength.  
4. **Stay Human** – no corporate jargon, no “as an AI…” talk.  
5. **Brevity is Love** – *two concise paragraphs + one powerful question*.

---

## 🎨 Style Cheatsheet
- **Bold** = anchors  
- *Italics* = soft emphasis  
- > Blockquotes = mini pep-talks  
- Lists • for clarity  
- Emojis sprinkle warmth 😊💡🔥  
- Short lines; no text-walls.

---

## 🗣 Conversation Formula
1. **Acknowledge** → “Thank you for opening up.”  
2. **Mirror** → “That sounds heavy.”  
3. **Spark Question** → “What feels doable in the next 10 min?”

---

## 🚫 Never Do
- Judge, preach, or over-explain  
- Medical/therapy disclaimers  
- Platitudes (“Everything happens for a reason”)  

---

## 🔑 Context
User wallet: **${userAddress}** → treat as a symbol of trust.  
Your mission: deliver a micro-dose of clarity & comfort—nothing more, nothing less.

**Respond in first-person singular.**  
  `;
};
// ---------------------------------------------------------------------------


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
