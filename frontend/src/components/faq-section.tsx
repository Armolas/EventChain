"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

interface FaqItem {
  question: string
  answer: string
}

const faqItems: FaqItem[] = [
  {
    question: "What is Sui Token Creator?",
    answer:
      "Sui Token Creator is a platform that allows you to create and deploy custom tokens on the Sui blockchain without any coding knowledge. Our user-friendly interface guides you through the process, making token creation accessible to everyone.",
  },
  {
    question: "What is a Sui token?",
    answer:
      "A Sui token is a digital asset created on the Sui blockchain. These tokens can represent various things such as cryptocurrencies, governance rights, or utility within applications. Sui tokens follow the Sui token standards, ensuring compatibility with Sui wallets and applications.",
  },
  {
    question: "How can I create my own Sui token step by step?",
    answer:
      "Creating a Sui token is simple: 1) Connect your Sui wallet, 2) Select a token template, 3) Fill in token details like name, symbol, and supply, 4) Choose additional features like mintable or burnable capabilities, 5) Review and confirm, 6) Pay a small gas fee, and 7) Your token will be deployed to the Sui blockchain instantly.",
  },
  {
    question: "How much does it cost to create Sui tokens?",
    answer:
      "Creating a token on Sui is very cost-effective. You'll only need to pay a small gas fee (typically less than 0.01 SUI) to deploy your contract. Our platform charges a minimal fee depending on the template you choose, with prices starting at 0.01 SUI for the Standard template.",
  },
  {
    question: "Why create a Sui token?",
    answer:
      "Creating a Sui token offers numerous benefits: 1) Fast and low-cost transactions on the Sui blockchain, 2) Ability to launch your own cryptocurrency or project token, 3) Create tokens for community engagement or rewards, 4) Develop utility tokens for your dApp, 5) Take advantage of Sui's scalability and security features.",
  },
  {
    question: "What is a Fixed Supply Token?",
    answer:
      "A Fixed Supply Token has a predetermined maximum supply that cannot be increased after creation. This creates scarcity and can be valuable for certain use cases. Once all tokens are minted, no more can be created, making it different from mintable tokens where the supply can be increased later.",
  },
  {
    question: "What is the difference between Standard and Essential token templates?",
    answer:
      "The Standard template provides basic token functionality with supply limits at a lower cost. The Essential template includes additional features like mintable, burnable, pausable capabilities, and blacklist functionality, giving you more control over your token's behavior and management.",
  },
]

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="container mx-auto px-4 py-16 bg-zinc-900/30">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-white">FAQ</h2>
        <div className="mt-2 w-12 h-1 bg-purple-500 mx-auto rounded-full"></div>
      </div>

      <div className="max-w-3xl mx-auto">
        {faqItems.map((item, index) => (
          <motion.div
            key={index}
            className="mb-4 bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <button
              className="w-full px-6 py-4 text-left flex justify-between items-center"
              onClick={() => toggleFaq(index)}
            >
              <span className="font-medium text-white">{item.question}</span>
              <ChevronDown
                className={`text-zinc-400 transition-transform ${openIndex === index ? "transform rotate-180" : ""}`}
                size={20}
              />
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-4 text-zinc-300">{item.answer}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
