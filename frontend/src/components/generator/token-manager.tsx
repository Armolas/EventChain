"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ChevronRight, Home, Sparkles, Plus, Users, Shield, Coins, Flame, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import ContractTemplates from "@/components/contract-templates"

interface TokenManagerProps {
  network: string
}

interface Tool {
  id: string
  name: string
  icon: React.ReactNode
  isNew?: boolean
  isActive?: boolean
  comingSoon?: boolean
}

const tools: Tool[] = [
  {
    id: "token-creator",
    name: "Token Creator",
    icon: <Sparkles className="w-5 h-5" />,
    isActive: true,
  },
  {
    id: "liquidity-pool",
    name: "Create Liquidity Pool",
    icon: <Plus className="w-5 h-5" />,
    isNew: true,
    comingSoon: true,
  },
  {
    id: "multisender",
    name: "Multisender",
    icon: <Users className="w-5 h-5" />,
    comingSoon: true,
  },
  {
    id: "revoke-ownership",
    name: "Revoke Ownership",
    icon: <Shield className="w-5 h-5" />,
    comingSoon: true,
  },
  {
    id: "mint-tokens",
    name: "Mint Tokens",
    icon: <Coins className="w-5 h-5" />,
    comingSoon: true,
  },
  {
    id: "burn-tokens",
    name: "Burn Tokens",
    icon: <Flame className="w-5 h-5" />,
    comingSoon: true,
  },
  {
    id: "token-page",
    name: "Token Page",
    icon: <FileText className="w-5 h-5" />,
    comingSoon: true,
  },
]

export default function TokenManager({ network }: TokenManagerProps) {
  const [activeTool, setActiveTool] = useState("token-creator")

  const getNetworkName = () => {
    switch (network) {
      case "mainnet":
        return "Sui Mainnet"
      case "testnet":
        return "Sui Testnet"
      case "devnet":
        return "Sui Devnet"
      default:
        return "Sui"
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-zinc-400 mb-6">
        <Link href="/" className="hover:text-white flex items-center">
          <Home className="w-4 h-4 mr-1" />
        </Link>
        <ChevronRight className="w-4 h-4 mx-1" />
        <Link href="/generate" className="hover:text-white">
          {getNetworkName()}
        </Link>
        <ChevronRight className="w-4 h-4 mx-1" />
        <span className="text-white">Token Creator</span>
      </div>

      <div className="grid md:grid-cols-[300px_1fr] gap-6">
        {/* Sidebar */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
          <div className="p-4 border-b border-zinc-800">
            <h2 className="font-medium text-white flex items-center">
              List of tools <span className="ml-1 text-orange-400">🔥</span>
            </h2>
          </div>

          <div className="p-2">
            {tools.map((tool) => (
              <button
                key={tool.id}
                className={`w-full text-left px-3 py-3 rounded-lg flex items-center justify-between ${
                  tool.isActive ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                } ${tool.comingSoon ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                disabled={tool.comingSoon}
                onClick={() => !tool.comingSoon && setActiveTool(tool.id)}
              >
                <div className="flex items-center">
                  <div className="w-6 h-6 mr-2 flex items-center justify-center">{tool.icon}</div>
                  <span>{tool.name}</span>
                  {tool.isNew && (
                    <span className="ml-2 text-xs bg-yellow-500 text-black px-1.5 py-0.5 rounded font-medium">New</span>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
            ))}
          </div>

          <div className="p-4 mt-4 border-t border-zinc-800">
            <Button variant="outline" className="w-full text-zinc-400 border-zinc-700 hover:text-white">
              Need other tools? Contact us
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div>
          <motion.div
            className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid md:grid-cols-[240px_1fr] h-full">
              <div className="bg-[#0f1729] p-6 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-teal-500 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">S</span>
                </div>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-2">Sui Token Manager</h2>
                <p className="text-zinc-400 text-sm">
                  Sui Token Manager is your all-in-one tool for creating tokens, transferring to multiple addresses,
                  managing ownership, minting, burning, and interacting with token contracts effortlessly. Streamline
                  your Sui operations in one place!
                </p>
              </div>
            </div>
          </motion.div>

          {/* Contract Templates */}
          <ContractTemplates />
        </div>
      </div>
    </div>
  )
}
