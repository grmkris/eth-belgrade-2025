"use client";

import { motion, AnimatePresence } from "motion/react";
import { SendIcon, BotIcon, UserIcon, StopCircleIcon, RefreshCwIcon, SparklesIcon, HeartIcon, BrainIcon, UsersIcon, TrendingUpIcon, TargetIcon, ShieldCheckIcon, GlobeIcon, CheckCircleIcon } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { useSignMessage, useAccount } from "wagmi";
import { useChat } from "@ai-sdk/react";
import { createSiweMessage, generateSiweNonce } from "viem/siwe";
import { useState, useCallback, useEffect, useRef } from "react";
import { sapphireTestnet } from "viem/chains";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Wrapper component to fix React 19 compatibility
const MarkdownWrapper = ({ children }: { children: string }) => {
  // Type assertion to fix React 19 compatibility issue
  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>;
};

const messageVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
};

const typingVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
};

const dotVariants = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const examplePrompts = [
  {
    icon: HeartIcon,
    category: "Emotional Support",
    prompts: [
      "I'm feeling overwhelmed and don't know how to cope",
      "I'm struggling with anxiety about my future"
    ]
  },
  {
    icon: BrainIcon,
    category: "Mental Health",
    prompts: [
      "My negative thoughts are controlling my life",
      "I'm having trouble sleeping due to stress"
    ]
  },
  {
    icon: UsersIcon,
    category: "Relationships",
    prompts: [
      "I'm having difficulties in my relationship",
      "I don't know how to set healthy boundaries"
    ]
  }
];

export const Chat: React.FC = () => {
  const { signMessageAsync } = useSignMessage();
  const { address, isConnected } = useAccount();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [input, setInput] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isCheckingVerification, setIsCheckingVerification] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Check verification status on mount and when address changes
  useEffect(() => {
    if (address) {
      setIsCheckingVerification(true);
      // Check if this wallet has been verified
      const verifiedWallets = JSON.parse(localStorage.getItem('verifiedWallets') || '[]');
      const verified = verifiedWallets.includes(address.toLowerCase());
      setIsVerified(verified);
      setIsCheckingVerification(false);
    } else {
      setIsVerified(false);
      setIsCheckingVerification(false);
    }
  }, [address]);

  // Handle verification redirect
  const handleVerification = useCallback(() => {
    if (address) {
      // Store wallet address before redirecting
      localStorage.setItem('pendingVerificationWallet', address);
      // Redirect to KYC service
      window.location.href = `http://localhost:3002?wallet=${address}`;
    }
  }, [address]);

  // Check if returning from verification
  useEffect(() => {
    const pendingWallet = localStorage.getItem('pendingVerificationWallet');
    if (pendingWallet && address && pendingWallet.toLowerCase() === address.toLowerCase()) {
      // Mark as verified (in real app, you'd check with backend)
      const verifiedWallets = JSON.parse(localStorage.getItem('verifiedWallets') || '[]');
      if (!verifiedWallets.includes(address.toLowerCase())) {
        verifiedWallets.push(address.toLowerCase());
        localStorage.setItem('verifiedWallets', JSON.stringify(verifiedWallets));
      }
      localStorage.removeItem('pendingVerificationWallet');
      setIsVerified(true);
    }
  }, [address]);

  // Create SIWE authentication
  const authenticateWithSiwe = useCallback(async () => {
    if (!address || !isConnected) {
      console.error("Wallet not connected");
      throw new Error("Wallet not connected");
    }

    setIsAuthenticating(true);
    try {
      const siweMessage = createSiweMessage({
        address,
        chainId: sapphireTestnet.id,
        domain: window.location.host,
        nonce: generateSiweNonce(),
        uri: window.location.origin,
        version: '1',
        statement: 'Sign in to your AI Support Buddy',
        issuedAt: new Date(),
        expirationTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      });

      const signature = await signMessageAsync({
        message: siweMessage,
      });
      return {
        message: siweMessage,
        signature,
      };
    } catch (error) {
      console.error("SIWE authentication failed:", error);
      throw new Error("SIWE authentication failed");
    } finally {
      setIsAuthenticating(false);
    }
  }, [address, isConnected, signMessageAsync]);

  const {
    messages,
    append,
    status,
    error,
    stop,
    reload,
    setMessages,
  } = useChat({
    api: 'http://localhost:3001/chat',
    headers: {
      'Content-Type': 'application/json',
    },
    onError: (error) => {
      console.error('Chat error:', error);
    },
    onFinish: (message, { usage, finishReason }) => {
      console.log('Message finished:', { message, usage, finishReason });
    },
    onResponse: (response) => {
      console.log('Response received:', response);
    },
  });

  // Auto-scroll when messages change or status changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, status, scrollToBottom]);

  const handleDelete = useCallback((id: string) => {
    setMessages(messages.filter(message => message.id !== id));
  }, [messages, setMessages]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  }, []);

  const onSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!input.trim()) {
      return;
    }

    // If not authenticated, authenticate first
    const siweData = await authenticateWithSiwe();

    const messageContent = input.trim();
    setInput(""); // Clear input immediately

    console.log("siweData", messageContent);

    await append({
      role: 'user',
      content: messageContent,
    }, {
      body: {
        siweMessage: siweData?.message,
        signature: siweData?.signature,
      },
    });
  }, [append, input, authenticateWithSiwe]);

  const handleExampleClick = useCallback(async (prompt: string) => {
    setInput(prompt);
    
    // Authenticate and submit immediately
    try {
      const siweData = await authenticateWithSiwe();
      
      // Clear input before appending
      setInput("");
      
      await append({
        role: 'user',
        content: prompt,
      }, {
        body: {
          siweMessage: siweData?.message,
          signature: siweData?.signature,
        },
      });
    } catch (error) {
      console.error("Failed to submit example prompt:", error);
      // Reset input on error
      setInput(prompt);
    }
  }, [append, authenticateWithSiwe]);

  // Show wallet connection prompt if not connected
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="p-6 sm:p-8 text-center max-w-md w-full backdrop-blur-sm bg-white/90 shadow-xl">
          <CardContent>
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <HeartIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Your Safe Space
            </h2>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">
              Connect your wallet to begin your journey with a compassionate AI companion who's here to listen and support you.
            </p>
            <div className="space-y-2 text-left mb-6 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <SparklesIcon className="w-4 h-4 text-purple-500" />
                <span>100% Private & Confidential</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <HeartIcon className="w-4 h-4 text-pink-500" />
                <span>Judgment-free support 24/7</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <BrainIcon className="w-4 h-4 text-blue-500" />
                <span>Guided self-discovery</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading while checking verification
  if (isCheckingVerification) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="p-6 sm:p-8 text-center max-w-md w-full backdrop-blur-sm bg-white/90 shadow-xl">
          <CardContent>
            <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Checking verification status...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show verification required screen
  if (!isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-6 sm:p-8 text-center max-w-md w-full backdrop-blur-sm bg-white/90 shadow-xl">
            <CardContent>
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <ShieldCheckIcon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                One-Time Verification
              </h2>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">
                To ensure the best experience and calculate your AI usage allowance, we need to verify your identity and location.
              </p>
              
              <div className="space-y-3 text-left mb-6">
                <div className="flex items-start gap-3 bg-blue-50 p-3 rounded-lg">
                  <GlobeIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">Location Verification</p>
                    <p className="text-xs text-gray-600">Helps us calculate your AI usage allowance based on your region</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-purple-50 p-3 rounded-lg">
                  <ShieldCheckIcon className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">Human Verification</p>
                    <p className="text-xs text-gray-600">Ensures you're a unique person to provide fair access</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-green-50 p-3 rounded-lg">
                  <CheckCircleIcon className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">Quick & Easy</p>
                    <p className="text-xs text-gray-600">Takes only a minute and you'll never need to do it again</p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleVerification}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <ShieldCheckIcon className="w-4 h-4 mr-2" />
                Verify My Identity
              </Button>
              
              <p className="text-xs text-gray-500 mt-4">
                Your wallet: {address?.slice(0, 6)}...{address?.slice(-4)}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex flex-col">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm p-3 sm:p-4 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between max-w-4xl px-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-md">
              <HeartIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-800 text-sm sm:text-base">Your Support Companion</h1>
              <p className="text-xs sm:text-sm text-gray-600">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </p>
            </div>
          </div>
          
          {/* Status indicator */}
          <div className="flex items-center gap-2">
            {isVerified && (
              <div className="flex items-center gap-1 text-green-600 text-xs sm:text-sm bg-green-100 px-2 py-1 rounded-full">
                <CheckCircleIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Verified</span>
              </div>
            )}
            {status === 'streaming' && (
              <div className="flex items-center gap-2 text-purple-600">
                <div className="animate-pulse w-2 h-2 bg-purple-600 rounded-full"></div>
                <span className="text-xs sm:text-sm">Listening...</span>
              </div>
            )}
            {status === 'submitted' && (
              <div className="flex items-center gap-2 text-pink-600">
                <div className="animate-spin w-3 h-3 sm:w-4 sm:h-4 border-2 border-pink-600 border-t-transparent rounded-full"></div>
                <span className="text-xs sm:text-sm">Connecting...</span>
              </div>
            )}
            {isAuthenticating && (
              <div className="flex items-center gap-2 text-purple-600">
                <div className="animate-spin w-3 h-3 sm:w-4 sm:h-4 border-2 border-purple-600 border-t-transparent rounded-full"></div>
                <span className="text-xs sm:text-sm">Securing...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Messages - Updated with ref and adjusted padding */}
      <div className="flex-1 overflow-hidden">
        <div 
          ref={scrollContainerRef}
          className="h-full overflow-y-auto p-4 space-y-4 container mx-auto max-w-4xl pb-32 scroll-smooth"
        >
          {messages.length === 0 && (
            <div className="py-4 sm:py-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-6"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-xl">
                  <HeartIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  Welcome to Your Safe Space
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm max-w-md mx-auto px-4">
                  I'm here to listen and guide you. Share what's on your mind.
                </p>
              </motion.div>

              {/* Example Prompts - Compact for mobile */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="space-y-3"
              >
                <p className="text-center text-xs sm:text-sm text-gray-500 mb-3">Quick start:</p>
                <div className="space-y-3">
                  {examplePrompts.map((category, idx) => (
                    <motion.div
                      key={category.category}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + idx * 0.1 }}
                      className="bg-white/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-md"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                          <category.icon className="w-4 h-4 text-purple-600" />
                        </div>
                        <h4 className="font-semibold text-gray-800 text-sm">{category.category}</h4>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {category.prompts.map((prompt, promptIdx) => (
                          <button
                            key={promptIdx}
                            onClick={() => handleExampleClick(prompt)}
                            disabled={status === 'streaming' || status === 'submitted' || isAuthenticating}
                            className="text-left w-full p-2.5 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all duration-200 text-xs sm:text-sm text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            "{prompt}"
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}

          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                custom={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-2 sm:gap-3 max-w-[90%] sm:max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-md ${
                    message.role === "user" 
                      ? "bg-gradient-to-r from-blue-500 to-purple-600" 
                      : "bg-gradient-to-r from-purple-500 to-pink-500"
                  }`}>
                    {message.role === "user" ? (
                      <UserIcon className="w-4 h-4 text-white" />
                    ) : (
                      <HeartIcon className="w-4 h-4 text-white" />
                    )}
                  </div>

                  {/* Message */}
                  <div className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"}`}>
                    <Card className={`shadow-lg border-0 ${
                      message.role === "user" 
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white" 
                        : "bg-white/90 backdrop-blur-sm"
                    }`}>
                      <CardContent className="p-3 sm:p-4">
                        <div className={`text-sm sm:text-base leading-relaxed ${
                          message.role === "user" ? "text-white" : "text-gray-700"
                        }`}>
                          {message.role === "assistant" ? (
                            <div className="prose prose-sm max-w-none">
                              <MarkdownWrapper>
                                {message.parts?.map((part) => {
                                  if (part.type === 'text') {
                                    return part.text;
                                  }
                                  return '';
                                }).join('') || message.content}
                              </MarkdownWrapper>
                            </div>
                          ) : (
                            message.parts?.map((part, partIndex) => {
                              if (part.type === 'text') {
                                return <span key={partIndex}>{part.text}</span>;
                              }
                              return null;
                            }) || message.content
                          )}
                        </div>
                      </CardContent>
                    </Card>
                    <div className="flex items-center gap-2 mt-1 px-2">
                      <span className="text-xs text-gray-500">
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <button
                        onClick={() => handleDelete(message.id)}
                        className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          <AnimatePresence>
            {status === 'streaming' && (
              <motion.div
                variants={typingVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="flex justify-start"
              >
                <div className="flex gap-2 sm:gap-3 max-w-[90%] sm:max-w-[80%]">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shrink-0 shadow-md">
                    <HeartIcon className="w-4 h-4 text-white" />
                  </div>
                  <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex space-x-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            variants={dotVariants}
                            animate="animate"
                            style={{ animationDelay: `${i * 0.2}s` }}
                            className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="border-t bg-red-50/80 backdrop-blur-sm p-3 sm:p-4">
          <div className="container mx-auto max-w-4xl px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-600">
                <span className="text-xs sm:text-sm">Something went wrong. Let's try again.</span>
              </div>
              <Button
                onClick={() => reload()}
                variant="outline"
                size="sm"
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                <RefreshCwIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Retry
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Input Area - Fixed at bottom with higher z-index */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-white/95 backdrop-blur-md p-3 sm:p-4 shadow-2xl z-20">
        <div className="container mx-auto max-w-4xl px-4">
          <form onSubmit={onSubmit} className="flex gap-2 sm:gap-3 items-end">
            <div className="flex-1">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Share what's on your mind..."
                className="resize-none border-2 border-purple-200 focus:border-purple-400 rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-white/90 backdrop-blur-sm"
                disabled={status === 'streaming' || status === 'submitted' || isAuthenticating}
              />
            </div>
            
            {/* Control Buttons */}
            <div className="flex gap-2">
              {(status === 'streaming' || status === 'submitted') && (
                <Button
                  type="button"
                  onClick={stop}
                  variant="outline"
                  size="icon"
                  className="rounded-full w-9 h-9 sm:w-10 sm:h-10 border-purple-300"
                >
                  <StopCircleIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              )}
              
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || status === 'streaming' || status === 'submitted' || isAuthenticating}
                className="rounded-full w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all"
              >
                {isAuthenticating ? (
                  <div className="animate-spin w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <SendIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </Button>
            </div>
          </form>
          
          <p className="text-xs text-gray-500 mt-2 text-center">
            <SparklesIcon className="w-3 h-3 inline mr-1" />
            {"Your safe space • Private & secure • Here for you 24/7"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat; 