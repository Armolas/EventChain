"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface BlogPost {
  id: string
  title: string
  date: string
  image: string
  tags: string[]
  url: string
}

const blogPosts: BlogPost[] = [
  {
    id: "post-1",
    title: "How to Mint Tokens on Sui Network in 3 steps",
    date: "15.05.2025",
    image: "/placeholder.svg?height=200&width=350",
    tags: ["Guide", "Sui"],
    url: "#",
  },
  {
    id: "post-2",
    title: "How to Create a Custom Sui Token Address with a Prefix or Suffix",
    date: "12.05.2025",
    image: "/placeholder.svg?height=200&width=350",
    tags: ["Guide", "Sui", "Memes"],
    url: "#",
  },
  {
    id: "post-3",
    title: "Top 5 Sui Token Projects to Watch in 2025",
    date: "08.05.2025",
    image: "/placeholder.svg?height=200&width=350",
    tags: ["Insights", "Sui", "Projects"],
    url: "#",
  },
  {
    id: "post-4",
    title: "Understanding Token Standards on Sui Blockchain",
    date: "01.05.2025",
    image: "/placeholder.svg?height=200&width=350",
    tags: ["Education", "Standards"],
    url: "#",
  },
]

export default function BlogSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const maxIndex = blogPosts.length - (window.innerWidth >= 768 ? 2 : 1)

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex))
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-white">Blog</h2>
        <div className="mt-2 w-16 h-1 bg-purple-500 mx-auto rounded-full"></div>
      </div>

      <div className="relative max-w-6xl mx-auto">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-zinc-800 rounded-full p-2 text-white disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="overflow-hidden">
          <motion.div
            className="flex gap-6"
            initial={false}
            animate={{ x: `-${currentIndex * (100 / (window.innerWidth >= 768 ? 2 : 1))}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ width: `${blogPosts.length * (100 / (window.innerWidth >= 768 ? 2 : 1))}%` }}
          >
            {blogPosts.map((post) => (
              <div key={post.id} className="w-full md:w-1/2 px-3">
                <motion.div
                  className="bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700 h-full"
                  whileHover={{ y: -5 }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <div
                      className="absolute inset-0 bg-center bg-cover"
                      style={{ backgroundImage: `url(${post.image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent opacity-70" />
                    <div className="absolute bottom-0 left-0 p-4">
                      <h3 className="text-xl font-bold text-white">{post.title}</h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-zinc-400 text-sm">
                        <Calendar size={14} className="mr-1" />
                        {post.date}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="bg-zinc-700/50 text-zinc-300 border-zinc-600 text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button variant="link" className="text-teal-400 hover:text-teal-300 p-0 h-auto" asChild>
                      <a href={post.url}>Read more</a>
                    </Button>
                  </div>
                </motion.div>
              </div>
            ))}
          </motion.div>
        </div>

        <button
          onClick={handleNext}
          disabled={currentIndex >= maxIndex}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-zinc-800 rounded-full p-2 text-white disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  )
}
