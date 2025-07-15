// Alternative OpenAI implementation (if you want to switch providers)
import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Validate API key exists
    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is not configured")
      return new Response(
        JSON.stringify({ error: "AI service is not configured. Please check your environment variables." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
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

    const result = streamText({
      model: openai("gpt-3.5-turbo"),
      system: systemPrompt,
      messages,
      temperature: 0.7,
      maxTokens: 200,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Error in chat API:", error)
    return new Response(
      JSON.stringify({
        error: "Sorry, I encountered an issue. Please try again in a moment.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
