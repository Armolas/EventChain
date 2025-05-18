"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, HelpCircle, Flame, Shield, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"
import { Coins } from "@/components/ui/icons"

interface TokenFormEssentialProps {
  network: string
  onBack: () => void
  onSwitchTemplate: (templateId: string) => void
}

export default function TokenFormEssential({ network, onBack, onSwitchTemplate }: TokenFormEssentialProps) {
  const [tokenName, setTokenName] = useState("")
  const [tokenSymbol, setTokenSymbol] = useState("")
  const [customDecimals, setCustomDecimals] = useState(false)
  const [decimals, setDecimals] = useState("9")
  const [initialSupply, setInitialSupply] = useState("")
  const [maxSupply, setMaxSupply] = useState("")
  const [burnable, setBurnable] = useState(true)
  const [mintable, setMintable] = useState(true)
  const [pausable, setPausable] = useState(true)
  const [blacklist, setBlacklist] = useState(true)
  const { toast } = useToast()

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!tokenName || !tokenSymbol || !initialSupply) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Submit form logic would go here
    toast({
      title: "Token creation initiated",
      description: "Your token is being created. Please wait...",
    })
  }

  return (
    <motion.div
      className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-bold text-white">Create token on {getNetworkName()}</h2>
        </div>
        <div className="flex items-center">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 mr-2">
            <span className="text-xl">😎</span>
          </div>
          <div>
            <div className="text-white font-medium">Essential token</div>
            <div className="text-teal-400 text-sm">0.02 SUI</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <p className="text-zinc-400 mb-6">
          Launch your own token on {getNetworkName()} network. With our intuitive tool you can easily generate your own
          Sui token with advanced features.
        </p>

        <div className="bg-zinc-800 rounded-lg p-6 mb-6">
          <h3 className="text-white font-medium mb-4">Token information</h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tokenName" className="text-zinc-300 flex items-center">
                    Token Name*
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-3.5 w-3.5 text-zinc-500 ml-1" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-[200px] text-xs">The name of your token (e.g., "My Awesome Token")</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Input
                    id="tokenName"
                    value={tokenName}
                    onChange={(e) => setTokenName(e.target.value)}
                    placeholder="My awesome token"
                    className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-teal-500 mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="tokenSymbol" className="text-zinc-300 flex items-center">
                    Token Symbol*
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-3.5 w-3.5 text-zinc-500 ml-1" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-[200px] text-xs">
                            The symbol of your token (e.g., "AWE"). Usually 3-5 characters.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Input
                    id="tokenSymbol"
                    value={tokenSymbol}
                    onChange={(e) => setTokenSymbol(e.target.value)}
                    placeholder="AWESOME"
                    className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-teal-500 mt-1"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center mb-2">
                  <Switch
                    id="customDecimals"
                    checked={customDecimals}
                    onCheckedChange={setCustomDecimals}
                    className="data-[state=checked]:bg-teal-500"
                  />
                  <Label htmlFor="customDecimals" className="ml-2 text-zinc-300">
                    Custom Decimals
                  </Label>
                </div>
                <p className="text-zinc-500 text-xs mb-2">
                  Change the number of decimals for your token. Default: 9.
                </p>
                {customDecimals && (
                  <Input
                    id="decimals"
                    type="number"
                    value={decimals}
                    onChange={(e) => setDecimals(e.target.value)}
                    placeholder="9"
                    className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-teal-500 w-24"
                  />
                )}
              </div>

              <div>
                <Label htmlFor="initialSupply" className="text-zinc-300 flex items-center">
                  Initial supply*
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3.5 w-3.5 text-zinc-500 ml-1" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-[200px] text-xs">
                          The initial number of available tokens that will be created in your wallet
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Input
                  id="initialSupply"
                  value={initialSupply}
                  onChange={(e) => setInitialSupply(e.target.value)}
                  placeholder="1 000 000 000"
                  className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-teal-500 mt-1"
                />
                <p className="text-zinc-500 text-xs mt-1">
                  The initial number of available tokens that will be created in your wallet
                </p>
              </div>

              <div>
                <Label htmlFor="maxSupply" className="text-zinc-300 flex items-center">
                  Max supply*
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3.5 w-3.5 text-zinc-500 ml-1" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-[200px] text-xs">The maximum number of tokens available</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Input
                  id="maxSupply"
                  value={maxSupply}
                  onChange={(e) => setMaxSupply(e.target.value)}
                  placeholder="1 000 000 000"
                  className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-teal-500 mt-1"
                />
                <p className="text-zinc-500 text-xs mt-1">The maximum number of tokens available</p>
              </div>

              <div className="border-t border-zinc-700 pt-4">
                <h4 className="text-white font-medium mb-3">Token Features</h4>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <Flame className="h-4 w-4 text-orange-400 mr-2" />
                        <Label htmlFor="burnable" className="text-zinc-300 cursor-pointer">
                          Burnable
                        </Label>
                      </div>
                      <p className="text-zinc-500 text-xs mt-1 ml-6">
                        This token can be manually burned to reduce circulating supply
                      </p>
                    </div>
                    <Switch
                      id="burnable"
                      checked={burnable}
                      onCheckedChange={setBurnable}
                      className="data-[state=checked]:bg-teal-500"
                    />
                  </div>

                  <div className="flex items-center">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <Coins className="h-4 w-4 text-yellow-400 mr-2" />
                        <Label htmlFor="mintable" className="text-zinc-300 cursor-pointer">
                          Mintable
                        </Label>
                      </div>
                      <p className="text-zinc-500 text-xs mt-1 ml-6">
                        Allows creating new tokens after the initial deployment
                      </p>
                    </div>
                    <Switch
                      id="mintable"
                      checked={mintable}
                      onCheckedChange={setMintable}
                      className="data-[state=checked]:bg-teal-500"
                    />
                  </div>

                  <div className="flex items-center">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <Pause className="h-4 w-4 text-blue-400 mr-2" />
                        <Label htmlFor="pausable" className="text-zinc-300 cursor-pointer">
                          Pausable
                        </Label>
                      </div>
                      <p className="text-zinc-500 text-xs mt-1 ml-6">
                        Allows pausing all token transfers in case of emergency
                      </p>
                    </div>
                    <Switch
                      id="pausable"
                      checked={pausable}
                      onCheckedChange={setPausable}
                      className="data-[state=checked]:bg-teal-500"
                    />
                  </div>

                  <div className="flex items-center">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 text-red-400 mr-2" />
                        <Label htmlFor="blacklist" className="text-zinc-300 cursor-pointer">
                          Blacklist
                        </Label>
                      </div>
                      <p className="text-zinc-500 text-xs mt-1 ml-6">
                        Allows blocking specific addresses from transferring tokens
                      </p>
                    </div>
                    <Switch
                      id="blacklist"
                      checked={blacklist}
                      onCheckedChange={setBlacklist}
                      className="data-[state=checked]:bg-teal-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                Create token
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
              >
                Create on testnet for FREE
              </Button>
            </div>

            <div className="flex items-center justify-between text-sm pt-2">
              <div className="text-zinc-400">
                Price: <span className="text-teal-400">0.02 SUI</span>
              </div>
              <Button variant="link" className="text-purple-400 p-0 h-auto">
                Activate promocode
              </Button>
            </div>
          </form>
        </div>

        <div className="mt-8">
          <h3 className="text-white font-medium mb-4 text-center">Other templates</h3>
          <div className="grid grid-cols-2 gap-4">
            <div 
              className="bg-zinc-800 rounded-lg p-4 border border-zinc-700 cursor-pointer hover:border-teal-500 transition-colors"
              onClick={() => onSwitchTemplate("standard")}
            >
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-indigo-900/50 flex items-center justify-center mr-2">
                  <span className="text-lg">😊</span>
                </div>
                <div>
                  <div className="text-white text-sm font-medium">Standard token</div>
                  <div className="text-teal-400 text-xs">Price: 0.01 SUI</div>
                </div>
              </div>
              <div className="text-purple-400 text-xs hover:text-purple-300">
                Switch to this template
              </div>
            </div>
            <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-emerald-900/50 flex items-center justify-center mr-2">
                  <span className="text-lg">🚀</span>
                </div>
                <div>
                  <div className="text-white text-sm font-medium">Premium token</div>
                  <div className="text-teal-400 text-xs">Price: 0.05 SUI</div>
                </div>
              </div>
              <div className="text-zinc-500 text-xs">Coming soon</div>
            </div>
          </div>
        </div>
      </div>
  </motion.div>
  )
}
