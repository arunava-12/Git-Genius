"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const responseStreamVariants = cva("relative w-full overflow-hidden rounded-lg border bg-background text-sm", {
  variants: {
    variant: {
      default: "border",
      ghost: "border-none shadow-none",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

export interface ResponseStreamProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof responseStreamVariants> {
  isLoading?: boolean
  loadingText?: string
  emptyText?: string
  children?: React.ReactNode
}

const ResponseStream = React.forwardRef<HTMLDivElement, ResponseStreamProps>(
  (
    {
      className,
      variant,
      isLoading = false,
      loadingText = "Generating response...",
      emptyText = "Response will appear here",
      children,
      ...props
    },
    ref,
  ) => {
    const hasContent = React.Children.count(children) > 0

    return (
      <div ref={ref} className={cn(responseStreamVariants({ variant }), className)} {...props}>
        {isLoading ? (
          <div className="flex min-h-[100px] w-full items-center justify-center p-4">
            <div className="flex flex-col items-center gap-2">
              <div className="flex space-x-1">
                <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]"></div>
                <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]"></div>
                <div className="h-2 w-2 animate-bounce rounded-full bg-primary"></div>
              </div>
              <p className="text-xs text-muted-foreground">{loadingText}</p>
            </div>
          </div>
        ) : hasContent ? (
          <div className="prose prose-sm dark:prose-invert max-w-none p-4">{children}</div>
        ) : (
          <div className="flex min-h-[100px] w-full items-center justify-center p-4">
            <p className="text-sm text-muted-foreground">{emptyText}</p>
          </div>
        )}
      </div>
    )
  },
)
ResponseStream.displayName = "ResponseStream"

export { ResponseStream }
