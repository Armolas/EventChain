"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

interface TokenFormProps {
  network: string
}

export default function TokenForm({ network }: TokenFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tokenName, setTokenName] = useState("")
  const [tokenSymbol, setTokenSymbol] = useState("")
  const [tokenSupply, setTokenSupply] = useState("")
  const [tokenDecimals, setTokenDecimals] = useState("9")
  const [description, setDescription] = useState("")
  const [isMintable, setIsMintable] = useState(false)
  const [isBurnable, setIsBurnable] = useState(false)
  const [isPausable, setIsPausable] = useState(false)
  const [hasBlacklist, setHasBlacklist] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const getNetworkName = () => {
    switch (network) {
      case "sui":
        return "Sui"
      case "solana":
        return "Solana"
      case "aptos":
        return "Aptos"
      default:
        return network.charAt(0).toUpperCase() + network.slice(1)
    }
  }

  const getNetworkColor = () => {
    switch (network) {
      case "sui":
        return "text-blue-500"
      case "solana":
        return "text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500"
      case "aptos":
        return "text-blue-600"
      default:
        return "text-white"
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
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

    setIsSubmitting(true)

    // Simulate token creation process
    try {
      // This would be an API call in a real application
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Token created successfully!",
        description: `Your ${tokenName} token has been deployed to the ${getNetworkName()} blockchain.`,
        variant: "default",
      })

      // Redirect to success page or dashboard
      router.push("/")
    } catch (error) {
      toast({
        title: "Error creating token",
        description: "There was an error creating your token. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6 text-zinc-400 hover:text-white"
          onClick={() => router.push("/generate")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to networks
        </Button>

        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Create token on <span className={getNetworkColor()}>{getNetworkName()}</span>
          </h1>
          <p className="text-zinc-400">
            Fill in the details below to create your custom token on the {getNetworkName()} blockchain.
          </p>
        </div>

        <motion.div
          className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 md:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="tokenName" className="text-zinc-300">
                  Token Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="tokenName"
                  value={tokenName}
                  onChange={(e) => setTokenName(e.target.value)}
                  placeholder={`e.g. My ${getNetworkName()} Token`}
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-teal-500 mt-1"
                />
              </div>

              <div>
                <Label htmlFor="tokenSymbol" className="text-zinc-300">
                  Token Symbol <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="tokenSymbol"
                  value={tokenSymbol}
                  onChange={(e) => setTokenSymbol(e.target.value)}
                  placeholder="e.g. MTK"
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-teal-500 mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tokenSupply" className="text-zinc-300">
                    Token Supply <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="tokenSupply"
                    type="number"
                    value={tokenSupply}
                    onChange={(e) => setTokenSupply(e.target.value)}
                    placeholder="e.g. 1000000"
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-teal-500 mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="tokenDecimals" className="text-zinc-300">
                    Decimals
                  </Label>
                  <Input
                    id="tokenDecimals"
                    type="number"
                    value={tokenDecimals}
                    onChange={(e) => setTokenDecimals(e.target.value)}
                    placeholder="e.g. 9"
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-teal-500 mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-zinc-300">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your token (optional)"
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-teal-500 min-h-[80px] mt-1"
                />
              </div>
            </div>

            <div className="border-t border-zinc-800 pt-6">
              <h3 className="text-lg font-medium text-white mb-4">Token Features</h3>

              <div className="space-y-4">
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

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="pausable" className="text-zinc-300">
                      Pausable
                    </Label>
                    <p className="text-zinc-500 text-sm">Allow pausing token transfers</p>
                  </div>
                  <Switch
                    id="pausable"
                    checked={isPausable}
                    onCheckedChange={setIsPausable}
                    className="data-[state=checked]:bg-teal-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="blacklist" className="text-zinc-300">
                      Blacklist
                    </Label>
                    <p className="text-zinc-500 text-sm">Allow blocking specific addresses</p>
                  </div>
                  <Switch
                    id="blacklist"
                    checked={hasBlacklist}
                    onCheckedChange={setHasBlacklist}
                    className="data-[state=checked]:bg-teal-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full bg-teal-500 hover:bg-teal-600 text-white py-6 h-auto text-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Creating Token...
                  </>
                ) : (
                  "Create Token"
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
