"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface TextShimmerWaveProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  duration?: number
  spread?: number
  zDistance?: number
  scaleDistance?: number
  rotateYDistance?: number
}

export function TextShimmerWave({
  children,
  className,
  duration = 1,
  spread = 1,
  zDistance = 1,
  scaleDistance = 1.1,
  rotateYDistance = 20,
  ...props
}: TextShimmerWaveProps) {
  const childrenArray = React.Children.toArray(children)
  const childrenCount = childrenArray.length
  const childrenElements = childrenArray.map((child, i) => {
    const progress = i / (childrenCount - 1)
    const delay = progress * duration * spread
    const style = {
      "--delay": `${delay}s`,
      "--duration": `${duration}s`,
      "--z-distance": zDistance,
      "--scale-distance": scaleDistance,
      "--rotate-y-distance": `${rotateYDistance}deg`,
    } as React.CSSProperties

    return (
      <span key={i} className="animate-shimmer-wave" style={style}>
        {child}
      </span>
    )
  })

  return (
    <div
      className={cn(
        "text-shimmer-wave inline-flex overflow-hidden [--base-color:theme(colors.foreground)] [--base-gradient-color:theme(colors.primary)]",
        className,
      )}
      {...props}
    >
      {childrenElements}
    </div>
  )
}
