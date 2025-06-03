"use client";

import { motion } from "motion/react";
import { HeartIcon, MessageCircleIcon, TrendingUpIcon } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { useWallet } from "@/hooks/useWallet";
import ConnectButton from "@/components/ConnectButton";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const progressVariants = {
  hidden: { width: 0 },
  visible: {
    width: "68%",
    transition: {
      duration: 1.5,
      ease: "easeOut",
      delay: 0.8,
    },
  },
};

export const Landing = () => {
  const { isConnected } = useWallet();
  
  const testimonials = [
    {
      quote: "This AI companion helped me through my darkest moments. Having someone available 24/7 made all the difference.",
      author: "Sarah M.",
      role: "College Student",
    },
    {
      quote: "The conversations feel so natural and supportive. It's like having a therapist in your pocket.",
      author: "Michael R.",
      role: "Working Parent",
    },
    {
      quote: "I was skeptical at first, but this tool genuinely helped me process my emotions and find clarity.",
      author: "Jordan L.",
      role: "Recent Graduate",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 py-12 space-y-16"
      >
        {/* Hero Section */}
        <section className="text-center space-y-8 max-w-4xl mx-auto">
          <motion.div variants={itemVariants} className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent leading-tight">
              You're Never Alone
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              AI-powered emotional support that's always there when you need it most. 
              Safe, private, and funded by our community.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all">
              <MessageCircleIcon className="mr-2 h-5 w-5" />
              Start Conversation
            </Button>
            {isConnected ? (
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 rounded-full border-2 hover:bg-purple-50 transition-all"
              >
                <HeartIcon className="mr-2 h-5 w-5" />
                Donate Support
              </Button>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <ConnectButton />
                <span className="text-sm text-gray-500">Connect to donate</span>
              </div>
            )}
          </motion.div>
        </section>

        {/* Gas Tank Section */}
        <motion.section variants={itemVariants} className="max-w-2xl mx-auto">
          <Card className="border-2 border-blue-100 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <TrendingUpIcon className="h-6 w-6 text-blue-600" />
                Community Support Level
              </CardTitle>
              <CardDescription className="text-lg">
                68% of this month's conversations funded
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  variants={progressVariants}
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-semibold text-white mix-blend-difference">
                    2,847 hours funded
                  </span>
                </div>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>0 hours</span>
                <span>Goal: 4,200 hours</span>
              </div>
              <p className="text-center text-gray-600">
                Every donation helps keep conversations free and accessible to those who need support.
              </p>
            </CardContent>
          </Card>
        </motion.section>

        {/* Testimonials Section */}
        <section className="space-y-8">
          <motion.div variants={itemVariants} className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Stories of Hope
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Real experiences from people who found support when they needed it most.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="h-full shadow-lg hover:shadow-xl transition-all border-l-4 border-l-blue-500">
                  <CardContent className="p-6 space-y-4">
                    <blockquote className="text-gray-700 italic leading-relaxed">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="border-t pt-4">
                      <p className="font-semibold text-gray-800">{testimonial.author}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Call to Action Footer */}
        <motion.section variants={itemVariants} className="text-center space-y-6 py-8">
          <h3 className="text-2xl font-semibold text-gray-800">
            Ready to start your journey?
          </h3>
          <Button size="lg" className="text-lg px-8 py-6 rounded-full shadow-lg">
            Get Support Now
          </Button>
        </motion.section>
      </motion.div>
    </div>
  );
};

export default Landing; 