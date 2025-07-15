// Health check endpoint to verify API configuration
export async function GET() {
  const hasGeminiKey = !!process.env.GEMINI_API_KEY
  const hasOpenAIKey = !!process.env.OPENAI_API_KEY

  return Response.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    ai_configured: hasGeminiKey || hasOpenAIKey,
    provider: hasGeminiKey ? "gemini" : hasOpenAIKey ? "openai" : "none",
  })
}
