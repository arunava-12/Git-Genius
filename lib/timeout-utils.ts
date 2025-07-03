/**
 * Executes a promise with a timeout
 * @param promise The promise to execute
 * @param timeoutMs Timeout in milliseconds
 * @param errorMessage Custom error message for timeout
 * @returns Promise result or throws error on timeout
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs = 10000,
  errorMessage = "Operation timed out",
): Promise<T> {
  let timeoutId: NodeJS.Timeout

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(errorMessage))
    }, timeoutMs)
  })

  return Promise.race([
    promise.then((result) => {
      clearTimeout(timeoutId)
      return result
    }),
    timeoutPromise,
  ])
}

/**
 * Safely executes a function that might time out
 * @param fn Function to execute
 * @param fallback Fallback value if function times out
 * @param timeoutMs Timeout in milliseconds
 * @returns Result of function or fallback value
 */
export async function executeSafely<T>(fn: () => Promise<T>, fallback: T, timeoutMs = 10000): Promise<T> {
  try {
    return await withTimeout(fn(), timeoutMs)
  } catch (error) {
    console.error("Operation failed or timed out:", error)
    return fallback
  }
}
