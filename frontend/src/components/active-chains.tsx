"use client"

import { motion } from "framer-motion"
import Link from "next/link"

interface Chain {
  id: string
  name: string
  logo: string
  color: string
}

const chains: Chain[] = [
  {
    id: "sui",
    name: "Sui",
    logo: "S",
    color: "bg-blue-500",
  },
  {
    id: "aptos",
    name: "Aptos",
    logo: "A",
    color: "bg-purple-500",
  },
  {
    id: "solana",
    name: "Solana",
    logo: "S",
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
  },
  {
    id: "near",
    name: "NEAR",
    logo: "N",
    color: "bg-black",
  },
  {
    id: "polygon",
    name: "Polygon",
    logo: "P",
    color: "bg-purple-600",
  },
  {
    id: "avalanche",
    name: "Avalanche",
    logo: "A",
    color: "bg-red-500",
  },
  {
    id: "ethereum",
    name: "Ethereum",
    logo: "Ξ",
    color: "bg-blue-600",
  },
  {
    id: "binance",
    name: "BNB Chain",
    logo: "B",
    color: "bg-yellow-500",
  },
]

export default function ActiveChains() {
  return (
    <div className="container mx-auto px-4 py-12 bg-zinc-900/30">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-white">Active chains</h2>
        <div className="mt-2 w-32 h-1 bg-purple-500 mx-auto rounded-full"></div>
      </div>

      <div className="max-w-3xl mx-auto text-center">
        <p className="text-xl text-white mb-8">Our goal is to provide extensive support for various chains</p>
        <p className="text-zinc-400 mb-10">20+ supported networks</p>

        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
        >
          {chains.map((chain, index) => (
            <motion.div
              key={chain.id}
              className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl cursor-pointer ${chain.color} ${chain.id === "sui" ? "ring-2 ring-teal-400 ring-offset-2 ring-offset-zinc-900" : ""}`}
              whileHover={{ y: -5, scale: 1.1 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              title={chain.name}
            >
              {chain.logo}
            </motion.div>
          ))}
        </motion.div>

        <p className="text-zinc-400 text-sm">
          Don't see your network?{" "}
          <Link href="#" className="text-teal-400 hover:underline">
            Contact us
          </Link>
        </p>
      </div>
    </div>
  )
}
