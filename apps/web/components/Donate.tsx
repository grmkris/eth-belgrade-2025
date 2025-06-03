"use client";

import { motion } from "motion/react";
import { HeartIcon, DollarSignIcon, ShieldIcon, CheckCircleIcon, CreditCardIcon } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { useAccount } from "wagmi";
import ConnectButton from "@/components/ConnectButton";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const formVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      delay: 0.3,
    },
  },
};

const impactVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export const Donate = () => {
  const { isConnected, address } = useAccount();
  
  const donationAmounts = [
    { value: "5", label: "$5", impact: "1 hour of support" },
    { value: "10", label: "$10", impact: "2 hours of support" },
    { value: "25", label: "$25", impact: "5 hours of support" },
    { value: "50", label: "$50", impact: "10 hours of support" },
    { value: "100", label: "$100", impact: "20 hours of support" },
  ];

  const benefits = [
    {
      icon: ShieldIcon,
      title: "Complete Privacy",
      description: "Anonymous donations with full blockchain transparency",
    },
    {
      icon: CheckCircleIcon,
      title: "Direct Impact",
      description: "100% of funds go directly to supporting conversations",
    },
    {
      icon: HeartIcon,
      title: "Community Driven",
      description: "Help build a supportive network for those in need",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 py-12 space-y-12 max-w-4xl"
      >
        {/* Header */}
        <motion.section variants={itemVariants} className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium">
            <HeartIcon className="w-4 h-4" />
            Support Someone Today
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent leading-tight">
            Fund Conversations That Matter
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Your donation directly funds AI-powered emotional support for people who need it most.
          </p>

          <motion.div 
            variants={impactVariants}
            className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm border-2 border-blue-200 rounded-2xl px-6 py-4 shadow-lg"
          >
            <DollarSignIcon className="w-8 h-8 text-blue-600" />
            <div className="text-left">
              <div className="text-2xl font-bold text-gray-800">$5 = 1 Hour</div>
              <div className="text-sm text-gray-600">of supportive conversation</div>
            </div>
          </motion.div>
        </motion.section>

        {/* Main Donation Form */}
        <motion.section variants={formVariants} className="max-w-2xl mx-auto">
          <Card className="border-2 border-blue-100 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-800">
                Make a Difference Today
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Choose your contribution amount and help fund emotional support
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Alias Input */}
              <div className="space-y-2">
                <Label htmlFor="alias" className="text-sm font-medium text-gray-700">
                  Display Name (Optional)
                </Label>
                <Input
                  id="alias"
                  placeholder="How would you like to be recognized?"
                  className="border-2 border-gray-200 focus:border-blue-400 rounded-xl px-4 py-3"
                />
                <p className="text-xs text-gray-500">
                  Leave blank to donate anonymously
                </p>
              </div>

              {/* Amount Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">
                  Donation Amount
                </Label>
                <Select>
                  <SelectTrigger className="border-2 border-gray-200 focus:border-blue-400 rounded-xl px-4 py-3 h-auto">
                    <SelectValue placeholder="Select amount" />
                  </SelectTrigger>
                  <SelectContent>
                    {donationAmounts.map((amount) => (
                      <SelectItem key={amount.value} value={amount.value}>
                        <div className="flex items-center justify-between w-full">
                          <span className="font-medium">{amount.label}</span>
                          <span className="text-sm text-gray-500 ml-4">
                            {amount.impact}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Donation Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="pt-4"
              >
                {isConnected ? (
                  <Button
                    size="lg"
                    className="w-full text-lg py-6 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
                  >
                    <CreditCardIcon className="mr-3 h-5 w-5" />
                    Donate with USDC
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-center text-sm text-gray-600">
                      Connect your wallet to donate
                    </p>
                    <ConnectButton />
                  </div>
                )}
              </motion.div>

              {/* Security & Privacy Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldIcon className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-800">Secure & Transparent</span>
                </div>
                <p className="text-sm text-blue-700 leading-relaxed">
                  All donations are processed on-chain for complete transparency. 
                  Your privacy is protected while ensuring every dollar reaches those who need support.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Benefits Section */}
        <motion.section variants={itemVariants} className="grid md:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="h-full text-center border-0 shadow-lg hover:shadow-xl transition-all">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto">
                    <benefit.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800">{benefit.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.section>

        {/* Impact Statement */}
        <motion.section 
          variants={itemVariants}
          className="text-center space-y-4 py-8"
        >
          <h3 className="text-2xl font-semibold text-gray-800">
            Every Dollar Creates Connection
          </h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join our community of supporters who believe that no one should face their 
            struggles alone. Together, we're building a world where emotional support 
            is always accessible.
          </p>
          <div className="flex justify-center pt-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full text-sm font-medium">
              2,847 hours funded this month ✨
            </div>
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
};

export default Donate; 