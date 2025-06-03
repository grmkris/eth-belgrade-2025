"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircleIcon, HeartIcon, EyeIcon, HomeIcon } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import Landing from "@/components/Landing";
import Chat from "@/components/Chat";
import Donate from "@/components/Donate";
import Ledger from "@/components/Ledger";
import ConnectButton from "@/components/ConnectButton";

const navItems = [
  { id: "home", label: "Home", icon: HomeIcon },
  { id: "chat", label: "Chat", icon: MessageCircleIcon },
  { id: "donate", label: "Donate", icon: HeartIcon },
  { id: "transparency", label: "Transparency", icon: EyeIcon },
];

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: -20 },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
};

export default function Page() {
  const [activeTab, setActiveTab] = useState("home");

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <Landing />;
      case "chat":
        return <Chat />;
      case "donate":
        return <Donate />;
      case "transparency":
        return <Ledger />;
      default:
        return <Landing />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm"
      >
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <HeartIcon className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Hope Connect
              </span>
            </div>

            {/* Navigation Tabs */}
            <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-full p-1">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab(item.id)}
                  className={`
                    rounded-full px-4 py-2 transition-all duration-200
                    ${activeTab === item.id 
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg" 
                      : "hover:bg-white/50"
                    }
                  `}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              ))}
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden flex items-center gap-2">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="bg-gray-100 border-0 rounded-full px-4 py-2 text-sm font-medium"
              >
                {navItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
              <div className="ml-2">
                <ConnectButton />
              </div>
            </div>

            {/* CTA Button */}
            <div className="hidden md:block">
              <ConnectButton />
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating Action Buttons - Only show on non-chat pages */}
      {activeTab !== "chat" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="fixed bottom-6 right-6 flex flex-col gap-3"
        >
          {activeTab !== "donate" && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => setActiveTab("donate")}
                size="lg"
                className="rounded-full shadow-xl bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
              >
                <HeartIcon className="w-5 h-5 mr-2" />
                Donate
              </Button>
            </motion.div>
          )}
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => setActiveTab("chat")}
              size="lg"
              className="rounded-full shadow-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <MessageCircleIcon className="w-5 h-5 mr-2" />
              Start Chat
            </Button>
          </motion.div>
        </motion.div>
      )}

      {/* Footer - Only show on home and transparency pages */}
      {(activeTab === "home" || activeTab === "transparency") && (
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="border-t border-gray-200 bg-white/50 backdrop-blur-sm mt-12"
        >
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <p className="text-sm text-gray-600">
                  © 2024 Hope Connect. Built with love for those who need support.
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Your privacy is our priority. All conversations are secure and confidential.
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab("transparency")}
                  className="text-sm"
                >
                  View Transparency
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab("donate")}
                  className="text-sm"
                >
                  Support Us
                </Button>
              </div>
            </div>
          </div>
        </motion.footer>
      )}
    </div>
  );
}
