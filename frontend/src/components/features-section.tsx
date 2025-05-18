"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Diamond, FlaskRoundIcon as Flask, Flame, Code, Shield, CreditCard } from "lucide-react"

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
}

const features: Feature[] = [
  {
    icon: <Shield className="w-8 h-8 text-purple-400" />,
    title: "Sui Standard Compliance",
    description:
      "All tokens created through our platform adhere to the Sui token standards, ensuring compatibility with Sui wallets across various devices.",
  },
  {
    icon: <Flask className="w-8 h-8 text-purple-400" />,
    title: "Mintable & Burnable",
    description:
      "Create mintable and burnable SUI tokens effortlessly through your web browser. Token owners can generate additional tokens by minting them or reduce circulating supply by burning them.",
  },
  {
    icon: <Code className="w-8 h-8 text-purple-400" />,
    title: "No coding required",
    description:
      "To create your own token you do not need technical knowledge of the Move language. The publishing process will take only a minutes. CoinFactory will do 100% of the work for you.",
  },
  {
    icon: <Shield className="w-8 h-8 text-purple-400" />,
    title: "Advanced Access Management",
    description:
      "Implement advanced access control mechanisms using Capability and Role-Based features, allowing your team members to manage token minting.",
  },
  {
    icon: <Flame className="w-8 h-8 text-purple-400" />,
    title: "Verified Source Code",
    description:
      "Rest assured with verified and audited code for top-tier security, featuring verification status for complete transparency.",
  },
  {
    icon: <CreditCard className="w-8 h-8 text-purple-400" />,
    title: "Low Cost Deployment",
    description:
      "Unlike most other platforms, we minimize the total gas cost to deploy a contract on Sui to less than 0.01 SUI.",
  },
]

export default function FeaturesSection() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <Diamond className="w-12 h-12 text-teal-400 mx-auto mb-4" />
        <h2 className="text-2xl md:text-3xl font-bold text-white">Features</h2>
        <p className="mt-4 max-w-2xl mx-auto text-zinc-400">
          Discover a suite of essential features for creating and managing your tokens with ease. Explore our
          comprehensive set of capabilities, including standard compliance, minting, burning, access control, code
          verification, token recovery support, and supply management. Your token journey starts here.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          >
            <div className="w-14 h-14 rounded-lg bg-zinc-700/50 flex items-center justify-center mb-4">
              {feature.icon}
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
            <p className="text-zinc-400 text-sm">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
