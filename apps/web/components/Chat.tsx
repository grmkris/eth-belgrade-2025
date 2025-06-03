"use client";

import { motion, AnimatePresence } from "motion/react";
import { SendIcon, BotIcon, UserIcon } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";

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

export const Chat = () => {
  const messages = [
    {
      id: 1,
      type: "assistant",
      content: "Hello! I'm here to listen and support you. How are you feeling today?",
      timestamp: "2:30 PM",
    },
    {
      id: 2,
      type: "user",
      content: "Hi... I've been having a really tough week. Work has been overwhelming and I'm feeling pretty anxious.",
      timestamp: "2:31 PM",
    },
    {
      id: 3,
      type: "assistant",
      content: "I'm sorry to hear you're going through a difficult time. It sounds like work stress is really affecting you. Would you like to talk about what specifically at work is making you feel overwhelmed?",
      timestamp: "2:31 PM",
    },
    {
      id: 4,
      type: "user",
      content: "It's just so much pressure. My manager keeps giving me more projects and I feel like I can't keep up. I'm worried I'm going to mess something up.",
      timestamp: "2:33 PM",
    },
    {
      id: 5,
      type: "assistant",
      content: "That pressure sounds really intense, and it's completely understandable that you'd feel anxious about it. Feeling like you can't keep up when responsibilities keep piling on is exhausting. Have you been able to communicate with your manager about your current workload?",
      timestamp: "2:34 PM",
    },
  ];

  const isTyping = true;

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm p-4 shadow-sm">
        <div className="container mx-auto flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <BotIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-800">AI Support Companion</h1>
            <p className="text-sm text-gray-600">Always here to listen</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-4 space-y-4 container mx-auto max-w-4xl">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                custom={index}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    message.type === "user" 
                      ? "bg-gradient-to-r from-purple-500 to-blue-600" 
                      : "bg-gradient-to-r from-blue-500 to-purple-600"
                  }`}>
                    {message.type === "user" ? (
                      <UserIcon className="w-4 h-4 text-white" />
                    ) : (
                      <BotIcon className="w-4 h-4 text-white" />
                    )}
                  </div>

                  {/* Message */}
                  <div className={`flex flex-col ${message.type === "user" ? "items-end" : "items-start"}`}>
                    <Card className={`shadow-md border-0 ${
                      message.type === "user" 
                        ? "bg-gradient-to-r from-purple-500 to-blue-600 text-white" 
                        : "bg-white"
                    }`}>
                      <CardContent className="p-4">
                        <p className={`text-sm leading-relaxed ${
                          message.type === "user" ? "text-white" : "text-gray-700"
                        }`}>
                          {message.content}
                        </p>
                      </CardContent>
                    </Card>
                    <span className="text-xs text-gray-500 mt-1 px-2">
                      {message.timestamp}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                variants={typingVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="flex justify-start"
              >
                <div className="flex gap-3 max-w-[80%]">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shrink-0">
                    <BotIcon className="w-4 h-4 text-white" />
                  </div>
                  <Card className="shadow-md border-0 bg-white">
                    <CardContent className="p-4">
                      <div className="flex space-x-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            variants={dotVariants}
                            animate="animate"
                            style={{ animationDelay: `${i * 0.2}s` }}
                            className="w-2 h-2 bg-gray-400 rounded-full"
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t bg-white/80 backdrop-blur-sm p-4 shadow-lg">
        <div className="container mx-auto max-w-4xl">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Input
                placeholder="Share what's on your mind..."
                className="resize-none border-2 border-gray-200 focus:border-blue-400 rounded-2xl px-4 py-3 text-base"
              />
            </div>
            <Button
              size="lg"
              className="rounded-2xl px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
            >
              <SendIcon className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Your conversations are private and secure. Press Enter or click send to share.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat; 