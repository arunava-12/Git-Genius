"use client"
import { useMemo } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedBeamsProps {
  className?: string
  beamCount?: number
  minOpacity?: number
  maxOpacity?: number
  minSize?: number
  maxSize?: number
  minDuration?: number
  maxDuration?: number
  minDelay?: number
  maxDelay?: number
}

export function AnimatedBeams({ className }: { className?: string }) {
  // Use a fixed seed or deterministic values instead of random
  const beams = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => ({
      width: `${30 + i * 5}vw`,
      height: `${30 + i * 5}vw`,
      left: `${20 + i * 10}%`,
      top: `${20 + i * 10}%`,
      opacity: 0,
      transform: "scale(0.8)",
      background: `radial-gradient(circle, rgba(139, 92, 246, ${0.1 + i * 0.01}) 0%, rgba(139, 92, 246, 0) 70%)`,
    }))
  }, [])

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      {beams.map((beam, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            delay: i * 0.5,
          }}
          style={beam}
        />
      ))}
    </div>
  )
}
