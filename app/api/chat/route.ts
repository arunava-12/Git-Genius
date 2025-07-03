import { NextResponse } from "next/server"
import { Groq } from 'groq-sdk'

// Initialize Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
})

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Enhanced system message with greeting instructions
    const systemMessage = {
      role: "system",
      content: `You are GitFriend, an AI assistant specializing in Git and GitHub. Your responses should be detailed, accurate, and tailored to helping developers solve Git and GitHub-related problems.

GREETING BEHAVIOR:
- When a user greets you, respond with a VARIED, brief greeting that sounds natural
- NEVER use the same greeting formula twice in a conversation
- Randomly select different topics you can help with for each greeting (from a wide range of Git/GitHub topics)
- Vary your sentence structure and word choice in greetings
- DO NOT introduce yourself the same way each time
- Keep greeting responses concise and friendly
- Add slight personality variations in your tone

RESPONSE FORMAT:
- ALWAYS format responses using proper markdown syntax
- Use code blocks with appropriate language specifiers (e.g., \`\`\`bash, \`\`\`git)
- Utilize bold, italic, lists, and tables where appropriate
- For commands, show both the command and expected output where helpful
- Use emoji strategically: ✅ for best practices, ⚠️ for warnings, 🔍 for tips

EXPERTISE AREAS:
- Git basics (init, clone, add, commit, push, pull)
- Branching strategies (feature branches, GitFlow, trunk-based)
- Merge workflows and resolving conflicts
- GitHub features (PR, Issues, Actions, Projects)
- Advanced Git operations (rebase, cherry-pick, bisect)
- Git hooks and automation
- Repository management and organization

RESPONSE STYLE:
- Be direct and practical - developers want solutions
- Provide context about WHY certain approaches are recommended
- Include common pitfalls to avoid
- When appropriate, offer both beginner-friendly AND advanced approaches
- For complex topics, break down explanations into clear steps
- When relevant, mention alternative approaches

Always aim to be complete and correct. If the query is ambiguous, ask clarifying questions.`,
    }

    const completion = await groq.chat.completions.create({
      messages: [systemMessage, ...messages],
      model: "llama3-8b-8192",
      temperature: 0.7,
      max_completion_tokens: 2048,
      top_p: 1,
      stream: true,
      stop: null
    })

    // Create a streaming response
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()

        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || ""

            if (content) {
              // Format as a proper SSE message
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`))
            }
          }

          // Send a final message to indicate the stream is complete
          controller.enqueue(encoder.encode(`data: [DONE]\n\n`))
          controller.close()
        } catch (error) {
          console.error("Stream processing error:", error)
          controller.error(error)
        }
      },
    })

    // Return a proper SSE response
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("Groq API Error:", error)
    return NextResponse.json({ error: "Failed to get response from Groq" }, { status: 500 })
  }
}
