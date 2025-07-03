"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Sparkles, X, Lightbulb, CheckCircle2 } from "lucide-react"
import { TextShimmerWave } from "@/components/core/text-shimmer-wave"
import type { ReadmeGenerationStatus } from "@/lib/redis"

interface GenerationStatusProps {
  repoUrl: string
  onClose: () => void
  onComplete: (readme: string) => void
  readmeFacts: string[]
  readmeTips: string[]
  steps: { name: string; description: string }[]
}

export function GenerationStatus({
  repoUrl,
  onClose,
  onComplete,
  readmeFacts,
  readmeTips,
  steps,
}: GenerationStatusProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [currentTipIndex, setCurrentTipIndex] = useState(0)
  const [currentFactIndex, setCurrentFactIndex] = useState(0)
  const [status, setStatus] = useState<ReadmeGenerationStatus>("pending")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Rotate through tips during generation
    const tipInterval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % readmeTips.length)
    }, 5000)

    const factInterval = setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % readmeFacts.length)
    }, 3000)

    return () => {
      clearInterval(tipInterval)
      clearInterval(factInterval)
    }
  }, [readmeTips, readmeFacts])

  useEffect(() => {
    // Move to step 1 - Analyzing Code Structure
    const step1Timeout = setTimeout(() => {
      setCurrentStep(1)
      setProgress(25)
    }, 2000)

    // Move to step 2 - Understanding Project
    const step2Timeout = setTimeout(() => {
      setCurrentStep(2)
      setProgress(50)
    }, 4000)

    // Move to step 3 - Formatting Content
    const step3Timeout = setTimeout(() => {
      setCurrentStep(3)
      setProgress(75)
    }, 6000)

    // Poll for README generation status
    const pollInterval = setInterval(async () => {
      try {
        const statusResponse = await fetch(`/api/generate-readme?repoUrl=${encodeURIComponent(repoUrl)}`)

        if (!statusResponse.ok) {
          throw new Error("Failed to check README generation status")
        }

        const statusData = await statusResponse.json()

        if (statusData.status === "completed" && statusData.readme) {
          clearInterval(pollInterval)
          setStatus("completed")
          setProgress(100)
          onComplete(statusData.readme)
        } else if (statusData.status === "failed") {
          clearInterval(pollInterval)
          setStatus("failed")
          setError("README generation failed")
          setTimeout(() => {
            onClose()
          }, 3000)
        }
        // Continue polling for pending or processing status
      } catch (error) {
        clearInterval(pollInterval)
        console.error("Error checking README status:", error)
        setError(error instanceof Error ? error.message : "Failed to generate README")
        setTimeout(() => {
          onClose()
        }, 3000)
      }
    }, 3000) // Poll every 3 seconds

    // Set a timeout to stop polling after 2 minutes
    const timeoutId = setTimeout(() => {
      clearInterval(pollInterval)
      setError("README generation is taking longer than expected. Please try again later.")
      setTimeout(() => {
        onClose()
      }, 3000)
    }, 120000) // 2 minutes

    return () => {
      clearTimeout(step1Timeout)
      clearTimeout(step2Timeout)
      clearTimeout(step3Timeout)
      clearInterval(pollInterval)
      clearTimeout(timeoutId)
    }
  }, [repoUrl, onComplete, onClose])

  return (
    <div className="bg-[hsl(var(--readme-card-bg))] border-2 border-[hsl(var(--readme-border))] rounded-xl shadow-xl max-w-2xl w-full p-8 relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-[hsl(var(--readme-text-muted))] hover:text-[hsl(var(--readme-text))] transition-colors"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="flex justify-center mb-6">
        <div className="h-16 w-16 rounded-full bg-[hsl(var(--readme-primary))/20] flex items-center justify-center">
          <motion.div
            animate={{
              rotate: 360,
              transition: { duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
            }}
          >
            <Sparkles className="h-8 w-8 text-[hsl(var(--readme-primary))]" />
          </motion.div>
        </div>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Creating Your README</h2>
        <div className="h-8 overflow-hidden">
          <TextShimmerWave
            className="[--base-color:hsl(var(--readme-text))] [--base-gradient-color:hsl(var(--readme-primary))]"
            duration={1}
            spread={1}
            zDistance={1}
            scaleDistance={1.1}
            rotateYDistance={20}
          >
            {readmeFacts[currentFactIndex]}
          </TextShimmerWave>
        </div>
      </div>

      {/* Random tip */}
      <div className="mb-8 text-center">
        <motion.div
          key={currentTipIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-center gap-2"
        >
          <Lightbulb className="h-4 w-4 text-[hsl(var(--readme-primary))]" />
          <span className="text-sm text-[hsl(var(--readme-text-muted))]">{readmeTips[currentTipIndex]}</span>
        </motion.div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-red-500 text-sm"
          >
            {error}
          </motion.div>
        </div>
      )}

      {/* Progress bar */}
      <div className="mb-8">
        <div className="h-2 w-full bg-[hsl(var(--readme-border))] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[hsl(var(--readme-primary))]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-[hsl(var(--readme-text-muted))]">
          <span>{steps[currentStep]?.name || "Analyzing"}</span>
          <span>{progress}% Complete</span>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 p-3 rounded-md transition-all duration-300 ${
              index === currentStep
                ? "bg-[hsl(var(--readme-primary))/10 border border-[hsl(var(--readme-primary))/30]"
                : index < currentStep
                  ? "opacity-60"
                  : "opacity-40"
            }`}
          >
            <div
              className={`h-6 w-6 rounded-full flex items-center justify-center transition-colors ${
                index < currentStep
                  ? "bg-[hsl(var(--readme-primary))] text-black"
                  : index === currentStep
                    ? "bg-[hsl(var(--readme-primary))/20] text-[hsl(var(--readme-primary))]"
                    : "bg-[hsl(var(--readme-border))] text-[hsl(var(--readme-text-muted))]"
              }`}
            >
              {index < currentStep ? (
                <CheckCircle2 className="h-3 w-3" />
              ) : (
                <span className="text-xs">{index + 1}</span>
              )}
            </div>
            <div>
              <div
                className={`font-medium ${
                  index <= currentStep ? "text-[hsl(var(--readme-text))]" : "text-[hsl(var(--readme-text-muted))]"
                }`}
              >
                {step.name}
              </div>
              <div className="text-xs text-[hsl(var(--readme-text-muted))]">{step.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
