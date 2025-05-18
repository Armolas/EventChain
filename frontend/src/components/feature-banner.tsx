"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { motion } from "framer-motion"

export default function FeatureBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <motion.div
      className="relative overflow-hidden rounded-lg bg-zinc-800 border border-zinc-700"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <div className="hidden sm:flex items-center justify-center bg-zinc-700 text-teal-400 font-medium rounded-lg px-3 py-1 mr-4">
            New
          </div>

          <div className="text-white">
            <span className="font-medium">Create Your Token on Sui for just 0.01 SUI: fast & easy!</span>
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
    </motion.div>
  )
}
