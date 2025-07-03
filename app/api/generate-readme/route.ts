import { Octokit } from "@octokit/rest"
import { Groq } from 'groq-sdk'
import { type NextRequest, NextResponse } from "next/server"
import { redis, CACHE_KEYS, CACHE_TTL, type ReadmeGenerationStatus } from "@/lib/redis"

// Initialize Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
})

const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN,
})

async function fetchLanguages(owner: string, repo: string) {
  const { data } = await octokit.repos.listLanguages({ owner, repo })
  return data
}

async function fetchFileContents(owner: string, repo: string, path: string) {
  try {
    const { data } = await octokit.repos.getContent({ owner, repo, path })
    return "content" in data ? Buffer.from(data.content, "base64").toString() : null
  } catch (e) {
    console.error(`Error fetching file content at path: ${path}`, e)
    return null
  }
}

// Check if README generation is already in progress or completed
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const repoUrl = url.searchParams.get("repoUrl")

    if (!repoUrl) {
      return NextResponse.json({ error: "Repository URL is required" }, { status: 400 })
    }

    // Check if we have a cached README
    const cachedReadme = await redis.get(CACHE_KEYS.README_GENERATION(repoUrl))
    if (cachedReadme) {
      return NextResponse.json({
        status: "completed",
        readme: cachedReadme,
      })
    }

    // Check the status of generation
    const status = await redis.get<ReadmeGenerationStatus>(CACHE_KEYS.README_STATUS(repoUrl))

    return NextResponse.json({
      status: status || "not_started",
    })
  } catch (error: any) {
    console.error("Error checking README status:", error)
    return NextResponse.json({ error: "Failed to check README status", details: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { repoUrl, customInstructions } = await req.json()

    if (!repoUrl) {
      return NextResponse.json({ error: "Repository URL is required" }, { status: 400 })
    }

    const match = repoUrl.match(/github\.com\/(.+?)\/(.+?)(?:\.git)?$/)
    if (!match) {
      return NextResponse.json({ error: "Invalid GitHub URL" }, { status: 400 })
    }

    // Check if we already have a cached README
    const cachedReadme = await redis.get(CACHE_KEYS.README_GENERATION(repoUrl))
    if (cachedReadme) {
      return NextResponse.json({
        status: "completed",
        readme: cachedReadme,
        cached: true,
      })
    }

    // Check if generation is already in progress
    const status = await redis.get<ReadmeGenerationStatus>(CACHE_KEYS.README_STATUS(repoUrl))
    if (status === "processing" || status === "pending") {
      return NextResponse.json({
        status: status,
        message: "README generation is already in progress",
      })
    }

    // Set status to pending
    await redis.set(CACHE_KEYS.README_STATUS(repoUrl), "pending", { ex: CACHE_TTL.STATUS })

    // Start the generation process in the background
    generateReadmeInBackground(repoUrl, customInstructions)

    return NextResponse.json({
      status: "pending",
      message: "README generation has started",
    })
  } catch (error: any) {
    console.error("Error starting README generation:", error)
    return NextResponse.json({ error: "Failed to start README generation", details: error.message }, { status: 500 })
  }
}

// Background process to generate README
async function generateReadmeInBackground(repoUrl: string, customInstructions?: string) {
  try {
    // Update status to processing
    await redis.set(CACHE_KEYS.README_STATUS(repoUrl), "processing", { ex: CACHE_TTL.STATUS })

    const match = repoUrl.match(/github\.com\/(.+?)\/(.+?)(?:\.git)?$/)
    if (!match) {
      throw new Error("Invalid GitHub URL")
    }

    const [_, owner, repo] = match
    const { data: repoData } = await octokit.repos.get({ owner, repo })
    const { data: rootContents } = await octokit.repos.getContent({ owner, repo, path: "" })

    const files = Array.isArray(rootContents)
      ? rootContents.map((item) => ({ name: item.name, type: item.type, path: item.path }))
      : []
    const languages = await fetchLanguages(owner, repo)

    let packageJson = null
    const packageJsonFile = files.find((file) => file.name === "package.json")
    if (packageJsonFile) {
      const content = await fetchFileContents(owner, repo, packageJsonFile.path)
      if (content) {
        try {
          packageJson = JSON.parse(content)
        } catch (e) {
          console.error("Error parsing package.json:", e)
        }
      }
    }

    const dependencies = packageJson
      ? { dependencies: packageJson.dependencies || {}, devDependencies: packageJson.devDependencies || {} }
      : null

    const configFiles = {
      hasReact: files.some(
        (f) =>
          f.name.includes("react") ||
          (dependencies?.dependencies && Object.keys(dependencies.dependencies).includes("react")),
      ),
      hasNext: files.some(
        (f) =>
          f.name === "next.config.js" ||
          (dependencies?.dependencies && Object.keys(dependencies.dependencies).includes("next")),
      ),
      hasTypescript: files.some(
        (f) =>
          f.name === "tsconfig.json" || files.some((file) => file.name.endsWith(".ts") || file.name.endsWith(".tsx")),
      ),
      hasDocker: files.some((f) => f.name === "Dockerfile" || f.name === "docker-compose.yml"),
      hasTests: files.some(
        (f) =>
          f.name.includes("test") ||
          f.name.includes("spec") ||
          (dependencies?.devDependencies &&
            Object.keys(dependencies.devDependencies).some((dep) => dep.match(/jest|mocha|vitest/))),
      ),
    }

    const categorizedFiles = {
      configuration: files
        .filter((f) => f.name.match(/\.json$|\.config\.js$|\.env\.example$|\.gitignore/))
        .map((f) => f.name),
      sourceCode: files
        .filter((f) => f.name.match(/\.(js|ts|jsx|tsx|py|go|rb|php|java)$/) && !f.name.endsWith(".config.js"))
        .map((f) => f.name),
      documentation: files
        .filter(
          (f) =>
            f.name.toLowerCase().includes("readme") || f.name.toLowerCase().includes("docs") || f.name.endsWith(".md"),
        )
        .map((f) => f.name),
    }

    const existingReadme = files.some((f) => f.name.toLowerCase() === "readme.md")
      ? await fetchFileContents(owner, repo, files.find((f) => f.name.toLowerCase() === "readme.md")?.path || "")
      : "No existing README found"

    const basePrompt = `
# Context
You are generating a comprehensive and useful GitHub README.md file for a repository. Focus on providing clear, concise, and practical information that would help someone understand the project quickly.

## Repository Information
- **Name**: ${repoData.name}
- **Description**: ${repoData.description || "No description provided"}
- **Stars**: ${repoData.stargazers_count}
- **Forks**: ${repoData.forks_count}
- **Languages**: ${Object.keys(languages).join(", ")}
- **Owner**: ${owner}

## Tech Stack Clues
${JSON.stringify(configFiles, null, 2)}

## Dependencies (if available)
${dependencies ? JSON.stringify(dependencies, null, 2) : "No package.json found"}

## File Structure Overview
Configuration files: ${categorizedFiles.configuration.join(", ") || "None found"}
Source code files: ${categorizedFiles.sourceCode.join(", ") || "None found"}
Documentation files: ${categorizedFiles.documentation.join(", ") || "None found"}

## Current README (if exists):
${existingReadme}

# README Generation Instructions
Create a comprehensive README.md file that includes:

1. **Title and Introduction**
   - Clear project title
   - Concise explanation of what the project does
   - Brief overview of the problem it solves

2. **Project Purpose and Background**
   - Detailed explanation of why this project exists
   - What problem it aims to solve
   - Target audience/users

3. **Features and Functionality**
   - List of key features with brief descriptions
   - What makes this project unique or useful
   - Core functionality explained

4. **Technology Stack**
   - Languages used (with version if identifiable)
   - Frameworks and libraries
   - Tools and infrastructure

5. **Installation and Setup**
   - Prerequisites
   - Step-by-step installation instructions
   - Environment configuration
   - How to run the project locally

6. **Usage Examples**
   - Basic usage instructions
   - Code examples or screenshots if appropriate
   - Common use cases

7. **Project Structure**
   - Brief explanation of important directories and files
   - Architecture overview if applicable

8. **Contributing Guidelines**
   - How others can contribute
   - Development workflow
   - Code style and standards

9. **License Information**
   - Clear license statement
   - Any restrictions on usage

## Emoji Usage
Use Unicode emojis (not emoji codes) throughout the README to make it more visually appealing. Use emojis that are relevant to the content they accompany. Some examples:
- Use 🚀 for features or getting started sections
- Use 🔧 for installation or configuration
- Use 💡 for tips or ideas
- Use ⚠️ for important notes or warnings
- Use 📚 for documentation sections
- Use 🛠️ for development sections
- Use ⭐ for highlighting important features

${customInstructions ? `# Additional User Instructions\n${customInstructions}` : ""}

# Output
Return only the final README.md content in Markdown format, no explanation or additional headers. Make sure to include Unicode emojis directly in the text, not as emoji codes.
`

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: basePrompt },
        { role: "user", content: "Generate the complete README.md file with Unicode emojis." },
      ],
      model: "llama3-8b-8192",
      temperature: 1,
      max_completion_tokens: 2500,
      top_p: 1,
      stream: false,
      stop: null
    })

    const generatedReadme = completion.choices[0]?.message?.content

    if (!generatedReadme) {
      throw new Error("Failed to generate README")
    }

    // Cache the generated README
    await redis.set(CACHE_KEYS.README_GENERATION(repoUrl), generatedReadme, { ex: CACHE_TTL.README })

    // Update status to completed
    await redis.set(CACHE_KEYS.README_STATUS(repoUrl), "completed", { ex: CACHE_TTL.STATUS })

    return generatedReadme
  } catch (error) {
    console.error("Error generating README:", error)
    await redis.set(CACHE_KEYS.README_STATUS(repoUrl), "failed", { ex: CACHE_TTL.STATUS })
    throw error
  }
}
