"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import Link from "next/link"

interface Network {
  id: string
  name: string
  description: string
  color: string
  status: "stable" | "testing" | "development"
}

const networks: Network[] = [
  {
    id: "mainnet",
    name: "Sui Mainnet",
    description: "Production network with permanent data persistence. Use for live deployment.",
    color: "bg-teal-500",
    status: "stable",
  },
  {
    id: "testnet",
    name: "Sui Testnet",
    description: "Pre-production testing network with semi-permanent data. Use for final testing.",
    color: "bg-purple-500",
    status: "testing",
  },
  {
    id: "devnet",
    name: "Sui Devnet",
    description: "Development network that is regularly wiped. Use for early development and experimentation.",
    color: "bg-blue-500",
    status: "development",
  },
]

export default function TokenGenerator() {
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null)

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-teal-600 rounded-xl flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Sui Token Creator</h1>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            A simple, user-friendly token generator for the Sui blockchain lets you effortlessly create and manage your
            own tokens, saving time and effort with its intuitive interface
          </p>
        </div>

        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-white">Select network</h2>
            <div className="mt-2 w-36 h-1 bg-purple-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid gap-6">
            {networks.map((network) => (
              <motion.div
                key={network.id}
                className={`bg-zinc-900 border ${
                  selectedNetwork === network.id ? "border-teal-500" : "border-zinc-800"
                } rounded-xl overflow-hidden cursor-pointer relative`}
                whileHover={{ y: -5, borderColor: "#14b8a6" }}
                onClick={() => setSelectedNetwork(network.id)}
              >
                <div className="p-6 flex items-center gap-6">
                  <div
                    className={`w-16 h-16 rounded-full ${network.color} flex items-center justify-center text-white shrink-0`}
                  >
                    <span className="text-2xl font-bold">S</span>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-white">{network.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeColor(network.status)}`}>
                        {getStatusLabel(network.status)}
                      </span>
                    </div>
                    <p className="text-zinc-400 text-sm mt-1">{network.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {selectedNetwork && (
          <div className="text-center">
            <Link
              href={`/generator/${selectedNetwork}`}
              className="inline-block bg-teal-500 hover:bg-teal-600 text-white font-medium px-8 py-3 rounded-lg transition-colors"
            >
              Continue
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

function getStatusBadgeColor(status: string): string {
  switch (status) {
    case "stable":
      return "bg-green-500/20 text-green-400"
    case "testing":
      return "bg-yellow-500/20 text-yellow-400"
    case "development":
      return "bg-blue-500/20 text-blue-400"
    default:
      return "bg-zinc-500/20 text-zinc-400"
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case "stable":
      return "Stable"
    case "testing":
      return "Testing"
    case "development":
      return "Development"
    default:
      return status
  }
}
