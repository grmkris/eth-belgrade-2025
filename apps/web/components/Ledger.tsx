"use client";

import { motion } from "motion/react";
import { EyeIcon, TrendingUpIcon, ClockIcon, UserIcon, DollarSignIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const tableRowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const statsVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export const Ledger = () => {
  const donations = [
    {
      id: "tx_001",
      alias: "Sarah from Seattle",
      amount: 25,
      timesFunded: "5 hours",
      timestamp: "2 hours ago",
      isAnonymous: false,
    },
    {
      id: "tx_002",
      alias: "Anonymous",
      amount: 50,
      timesFunded: "10 hours",
      timestamp: "4 hours ago",
      isAnonymous: true,
    },
    {
      id: "tx_003",
      alias: "Michael R.",
      amount: 10,
      timesFunded: "2 hours",
      timestamp: "6 hours ago",
      isAnonymous: false,
    },
    {
      id: "tx_004",
      alias: "Anonymous",
      amount: 100,
      timesFunded: "20 hours",
      timestamp: "8 hours ago",
      isAnonymous: true,
    },
    {
      id: "tx_005",
      alias: "Jordan L.",
      amount: 15,
      timesFunded: "3 hours",
      timestamp: "12 hours ago",
      isAnonymous: false,
    },
    {
      id: "tx_006",
      alias: "Anonymous",
      amount: 5,
      timesFunded: "1 hour",
      timestamp: "1 day ago",
      isAnonymous: true,
    },
    {
      id: "tx_007",
      alias: "Alex Chen",
      amount: 30,
      timesFunded: "6 hours",
      timestamp: "1 day ago",
      isAnonymous: false,
    },
    {
      id: "tx_008",
      alias: "Anonymous",
      amount: 75,
      timesFunded: "15 hours",
      timestamp: "2 days ago",
      isAnonymous: true,
    },
  ];

  const totalDonated = donations.reduce((sum, donation) => sum + donation.amount, 0);
  const totalHours = donations.reduce((sum, donation) => sum + parseInt(donation.timesFunded), 0);
  const totalDonors = donations.length;

  const stats = [
    {
      icon: DollarSignIcon,
      label: "Total Donated",
      value: `$${totalDonated}`,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: ClockIcon,
      label: "Hours Funded",
      value: `${totalHours}h`,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: UserIcon,
      label: "Contributors",
      value: totalDonors.toString(),
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 py-12 space-y-8 max-w-6xl"
      >
        {/* Header */}
        <motion.section variants={itemVariants} className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium">
            <EyeIcon className="w-4 h-4" />
            Complete Transparency
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent leading-tight">
            Community Impact Ledger
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Every donation is recorded on-chain for complete transparency. 
            See exactly how your contributions are making a difference.
          </p>
        </motion.section>

        {/* Stats Cards */}
        <motion.section variants={statsVariants} className="grid md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.section>

        {/* Donation Ledger Table */}
        <motion.section variants={itemVariants}>
          <Card className="border-2 border-blue-100 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <TrendingUpIcon className="w-6 h-6 text-blue-600" />
                Recent Donations
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Real-time view of community contributions
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="overflow-x-auto">
                <div className="min-w-full">
                  {/* Table Header */}
                  <div className="grid grid-cols-4 gap-4 py-3 px-4 bg-gray-50 rounded-lg font-medium text-sm text-gray-700 mb-2">
                    <div>Contributor</div>
                    <div>Amount</div>
                    <div>Time Funded</div>
                    <div>When</div>
                  </div>

                  {/* Table Rows */}
                  <motion.div variants={containerVariants} className="space-y-2">
                    {donations.map((donation, index) => (
                      <motion.div
                        key={donation.id}
                        variants={tableRowVariants}
                        whileHover={{ 
                          backgroundColor: "rgba(59, 130, 246, 0.05)",
                          scale: 1.01,
                        }}
                        transition={{ duration: 0.2 }}
                        className="grid grid-cols-4 gap-4 py-4 px-4 border border-gray-100 rounded-lg hover:border-blue-200 transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            donation.isAnonymous 
                              ? "bg-gray-200" 
                              : "bg-gradient-to-r from-blue-500 to-purple-600"
                          }`}>
                            <UserIcon className={`w-4 h-4 ${
                              donation.isAnonymous ? "text-gray-500" : "text-white"
                            }`} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{donation.alias}</p>
                            <p className="text-xs text-gray-500">ID: {donation.id}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <span className="text-lg font-semibold text-green-600">
                            ${donation.amount}
                          </span>
                        </div>
                        
                        <div className="flex items-center">
                          <span className="text-gray-700 font-medium">
                            {donation.timesFunded}
                          </span>
                        </div>
                        
                        <div className="flex items-center">
                          <span className="text-gray-500 text-sm">
                            {donation.timestamp}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </div>
              
              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 text-center">
                  All transactions are verified on the blockchain. 
                  <span className="text-blue-600 hover:text-blue-700 cursor-pointer"> View on explorer →</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Privacy & Transparency Info */}
        <motion.section variants={itemVariants} className="grid md:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <EyeIcon className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-blue-800 mb-2">Full Transparency</h3>
                  <p className="text-sm text-blue-700 leading-relaxed">
                    Every donation is recorded immutably on the blockchain, ensuring complete 
                    transparency in how funds are used to support conversations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-purple-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <UserIcon className="w-6 h-6 text-purple-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-purple-800 mb-2">Privacy Protected</h3>
                  <p className="text-sm text-purple-700 leading-relaxed">
                    Contributors can choose to remain anonymous while still maintaining 
                    full accountability through cryptographic verification.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </motion.div>
    </div>
  );
};

export default Ledger; 