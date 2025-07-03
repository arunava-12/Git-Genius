import { Redis } from "@upstash/redis"

// Initialize Redis client
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// README generation status types
export type ReadmeGenerationStatus = "pending" | "processing" | "completed" | "failed"

// Cache keys
export const CACHE_KEYS = {
  README_GENERATION: (repoUrl: string) => `readme:${repoUrl}`,
  README_STATUS: (repoUrl: string) => `readme:status:${repoUrl}`,
}

// Cache TTLs in seconds
export const CACHE_TTL = {
  README: 7 * 24 * 60 * 60, // 7 days
  STATUS: 24 * 60 * 60, // 1 day
}
