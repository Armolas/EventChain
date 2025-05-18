"use client"
import { motion } from "framer-motion"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function HeroSection() {
  const router = useRouter()

  const handleCreateToken = () => {
    router.push("/generate")
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="mt-8 md:mt-12">
        <motion.div
          className="bg-zinc-900 rounded-xl border border-zinc-800 p-8 md:p-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Create Sui Token
              <br />
              in Minutes
            </h1>

            <p className="text-zinc-400 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Deploy your own custom token on the Sui blockchain with ease. Our simple, fast, and secure platform lets
              you bring your ideas to life.
            </p>

            <Button
              onClick={handleCreateToken}
              className="bg-teal-500 hover:bg-teal-600 text-white text-lg px-8 py-6 h-auto rounded-lg"
            >
              <PlusCircle className="mr-2" size={24} />
              Create token
            </Button>

            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              {[
                { name: "Fast", description: "Deploy in seconds" },
                { name: "Secure", description: "Audited contracts" },
                { name: "Low Cost", description: "Minimal gas fees" },
                { name: "Customizable", description: "Full token control" },
              ].map((feature, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center text-teal-500">
                    {getFeatureIcon(index)}
                  </div>
                  <span className="mt-2 text-white font-medium">{feature.name}</span>
                  <span className="text-zinc-500 text-sm">{feature.description}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function getFeatureIcon(index: number) {
  // Simple placeholder icons using text - in a real app, you'd use proper SVG icons
  const icons = ["⚡", "🔒", "💰", "⚙️"]
  return icons[index]
}
