"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { motion } from "framer-motion"

export default function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-500/80 to-purple-500/80 p-1"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute inset-0 bg-zinc-900/10 backdrop-blur-sm" />

      <div className="relative flex items-center justify-between p-4 rounded-xl bg-zinc-900/40">
        <div className="flex items-center">
          <div className="hidden sm:flex items-center justify-center bg-teal-500/20 text-teal-300 font-medium rounded-lg px-3 py-1 mr-4">
            Best price 🔥
          </div>

          <div className="text-white">
            <span className="font-medium">Create Your Token on</span>{" "}
            <span className="inline-flex items-center bg-purple-500/20 text-purple-300 rounded-lg px-2 py-0.5 mx-1">
              <span className="mr-1">◎</span> Solana
            </span>{" "}
            <span className="font-medium">for just 0.05 SOL: fast & easy!</span>
          </div>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="ml-4 text-zinc-400 hover:text-white transition-colors"
          aria-label="Close banner"
        >
          <X size={18} />
        </button>
      </div>

      <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 flex space-x-2">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-purple-500 opacity-70"
            style={{
              transform: `scale(${0.8 - i * 0.15})`,
              marginRight: `-${i * 4}px`,
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}
