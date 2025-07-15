// AI Configuration utility
export const AI_CONFIG = {
  // Default to Gemini, fallback to OpenAI
  getProvider: () => {
    if (process.env.GEMINI_API_KEY) {
      return "gemini"
    } else if (process.env.OPENAI_API_KEY) {
      return "openai"
    }
    return null
  },

  // Validate environment setup
  validateConfig: () => {
    const provider = AI_CONFIG.getProvider()
    if (!provider) {
      throw new Error(
        "No AI provider configured. Please set GEMINI_API_KEY or OPENAI_API_KEY in your environment variables.",
      )
    }
    return provider
  },
}
