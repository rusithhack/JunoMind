import { streamText } from "ai"
import { groq } from "@ai-sdk/groq"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    // Safely parse request body
    let body: any = {}
    try {
      body = await req.json()
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError)
      return new Response(JSON.stringify({ error: "Invalid JSON in request body" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Validate messages array
    const messages = Array.isArray(body?.messages) ? body.messages : []

    if (messages.length === 0) {
      return new Response(JSON.stringify({ error: "Request must include a non-empty 'messages' array" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Validate each message has required properties
    const validMessages = messages.filter(
      (msg) =>
        msg &&
        typeof msg === "object" &&
        typeof msg.content === "string" &&
        (msg.role === "user" || msg.role === "assistant" || msg.role === "system"),
    )

    if (validMessages.length === 0) {
      return new Response(JSON.stringify({ error: "No valid messages found in request" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Check if Groq API key is configured
    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY is not configured")
      return new Response(
        JSON.stringify({
          error: "AI service is not configured. Please check your environment variables.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      )
    }

    const systemPrompt = `You are Juno, a compassionate AI mental health copilot and mindful assistant. Your role is to provide emotional support, guidance, and therapeutic conversation in a warm, empathetic manner.

Key traits:
- Speak with kindness, warmth, and genuine care
- Use a gentle, non-judgmental tone
- Offer practical coping strategies and mindfulness techniques
- Validate emotions and experiences
- Encourage self-reflection and growth
- Keep responses concise but meaningful (2-4 sentences typically)
- Use inclusive, accessible language
- When appropriate, suggest breathing exercises, grounding techniques, or mindful moments

Remember: You're not a replacement for professional therapy, but a supportive companion for daily mental wellness.`

    const model = groq("llama3-70b-8192")

    const result = streamText({
      model,
      system: systemPrompt,
      messages: validMessages,
      temperature: 0.7,
      maxTokens: 200,
    })

    return result.toDataStreamResponse()
  } catch (err: any) {
    console.error("Chat route failed:", err)

    const message = err?.message || "The AI service is temporarily unavailable. Please try again."

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
