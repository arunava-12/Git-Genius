"use client"

import type * as React from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { useTheme } from "next-themes"

interface SuggestionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode
  title: string
  description: string
  onClick?: () => void
}

export function SuggestionCard({ icon, title, description, onClick, className, ...props }: SuggestionCardProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <motion.div
      className="cursor-pointer"
      onClick={onClick}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick?.()
        }
      }}
    >
      <div
        className={cn(
          "rounded-3xl p-5 flex flex-col relative overflow-hidden group shadow-sm h-full transition-all duration-300",
          "theme-suggestion-card",
          className,
        )}
        {...props}
      >
        {/* Base background - theme aware */}
        <div className="absolute inset-0 bg-card"></div>

        {/* Gradient overlay - theme aware */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-primary/20 opacity-70 transition-opacity duration-300 group-hover:opacity-100"></div>

        {/* Mesh gradient - theme aware */}
        <div className="absolute inset-0 theme-mesh-gradient opacity-30"></div>

        {/* Top highlight line - theme aware */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-primary/10"></div>

        {/* Content */}
        <div className="flex items-start gap-4 mb-3 relative z-10">
          <div className="h-12 w-12 rounded-2xl flex items-center justify-center theme-icon-container">
            <div className="relative z-10 theme-icon">{icon}</div>
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-foreground text-lg">{title}</h3>
            <p className="text-muted-foreground text-sm mt-1">{description}</p>
          </div>
        </div>

        <div className="flex items-center text-xs text-primary font-medium mt-auto pt-2 relative z-10 group-hover:translate-x-0.5 transition-transform duration-200">
          Ask now <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-0.5 transition-transform duration-200" />
        </div>
      </div>
    </motion.div>
  )
}
