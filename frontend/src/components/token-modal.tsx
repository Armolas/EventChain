"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, AlertCircle, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"

interface TokenModalProps {
  isOpen: boolean
  onClose: () => void
}

type ModalState = "input" | "loading" | "error" | "success"

export default function TokenModal({ isOpen, onClose }: TokenModalProps) {
  const [state, setState] = useState<ModalState>("input")
  const [tokenName, setTokenName] = useState("")
  const [tokenSymbol, setTokenSymbol] = useState("")
  const [tokenSupply, setTokenSupply] = useState("")
  const [tokenDecimals, setTokenDecimals] = useState("9")
  const [description, setDescription] = useState("")
  const [isMintable, setIsMintable] = useState(false)
  const [isBurnable, setIsBurnable] = useState(false)
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!tokenName || !tokenSymbol || !tokenSupply) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Simulate token creation process
    setState("loading")

    setTimeout(() => {
      // Randomly succeed or fail for demo purposes
      const success = Math.random() > 0.3

      if (success) {
        setState("success")
      } else {
        setState("error")
      }
    }, 2000)
  }

  const resetForm = () => {
    setState("input")
    setTokenName("")
    setTokenSymbol("")
    setTokenSupply("")
    setTokenDecimals("9")
    setDescription("")
    setIsMintable(false)
    setIsBurnable(false)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        />

        <motion.div
          className="relative z-10 w-full max-w-md bg-zinc-900 rounded-xl border border-zinc-800 shadow-xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", damping: 20 }}
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-teal-500" />

          <div className="flex justify-between items-center p-6 border-b border-zinc-800">
            <h2 className="text-xl font-bold text-white">Create Sui Token</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              <X size={18} />
            </Button>
          </div>

          <div className="p-6">
            {state === "input" && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tokenName" className="text-zinc-300">
                    Token Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="tokenName"
                    value={tokenName}
                    onChange={(e) => setTokenName(e.target.value)}
                    placeholder="e.g. Sui Example Token"
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-teal-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tokenSymbol" className="text-zinc-300">
                    Token Symbol <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="tokenSymbol"
                    value={tokenSymbol}
                    onChange={(e) => setTokenSymbol(e.target.value)}
                    placeholder="e.g. SET"
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-teal-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tokenSupply" className="text-zinc-300">
                      Token Supply <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="tokenSupply"
                      type="number"
                      value={tokenSupply}
                      onChange={(e) => setTokenSupply(e.target.value)}
                      placeholder="e.g. 1000000"
                      className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-teal-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tokenDecimals" className="text-zinc-300">
                      Decimals
                    </Label>
                    <Input
                      id="tokenDecimals"
                      type="number"
                      value={tokenDecimals}
                      onChange={(e) => setTokenDecimals(e.target.value)}
                      placeholder="e.g. 9"
                      className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-teal-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-zinc-300">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your token (optional)"
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-teal-500 min-h-[80px]"
                  />
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="mintable" className="text-zinc-300">
                        Mintable
                      </Label>
                      <p className="text-zinc-500 text-sm">Allow creating new tokens</p>
                    </div>
                    <Switch
                      id="mintable"
                      checked={isMintable}
                      onCheckedChange={setIsMintable}
                      className="data-[state=checked]:bg-teal-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="burnable" className="text-zinc-300">
                        Burnable
                      </Label>
                      <p className="text-zinc-500 text-sm">Allow destroying tokens</p>
                    </div>
                    <Switch
                      id="burnable"
                      checked={isBurnable}
                      onCheckedChange={setIsBurnable}
                      className="data-[state=checked]:bg-teal-500"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600 text-white mt-6">
                  Create Token
                </Button>
              </form>
            )}

            {state === "loading" && (
              <div className="py-8 flex flex-col items-center justify-center">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-zinc-700 border-opacity-30"></div>
                  <div className="w-16 h-16 rounded-full border-4 border-t-teal-500 border-opacity-80 absolute top-0 left-0 animate-spin"></div>
                </div>
                <h3 className="mt-6 text-xl font-medium text-white">Creating your token</h3>
                <p className="mt-2 text-zinc-400 text-center">
                  This may take a few moments. Please don't close this window.
                </p>
              </div>
            )}

            {state === "error" && (
              <div className="py-8 flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                  <AlertCircle size={32} className="text-red-500" />
                </div>
                <h3 className="mt-6 text-xl font-medium text-white">Something went wrong</h3>
                <p className="mt-2 text-zinc-400 text-center">We couldn't create your token. Please try again.</p>
                <Button onClick={resetForm} className="mt-6 bg-zinc-800 hover:bg-zinc-700 text-white">
                  Try Again
                </Button>
              </div>
            )}

            {state === "success" && (
              <div className="py-8 flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-teal-500/10 flex items-center justify-center">
                  <Check size={32} className="text-teal-500" />
                </div>
                <h3 className="mt-6 text-xl font-medium text-white">Token Created!</h3>
                <p className="mt-2 text-zinc-400 text-center">
                  Your token has been successfully created and deployed on the Sui blockchain.
                </p>
                <div className="mt-6 w-full p-3 bg-zinc-800 rounded-lg border border-zinc-700">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Object ID</span>
                    <span className="text-teal-400 font-mono text-sm">0x1a2b...3c4d</span>
                  </div>
                </div>
                <Button onClick={handleClose} className="mt-6 bg-teal-500 hover:bg-teal-600 text-white">
                  Close
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
