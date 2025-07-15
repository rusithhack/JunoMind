# Juno - AI Mental Health Copilot

A compassionate AI companion for mental and emotional wellbeing, built with Next.js and powered by Google Gemini AI.

## Features

- 🤖 AI-powered therapeutic conversations
- 🎨 Beautiful glassmorphic design with light/dark mode
- 🧠 Mental wellness tools (mood tracking, focus timer, binaural beats)
- 🗣️ Text-to-speech and voice input support
- 📱 Fully responsive, mobile-first design
- 🔒 Privacy-focused (no login required, local storage only)

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in your project root:

\`\`\`env
# Google Gemini API Key (Primary)
GEMINI_API_KEY=your_gemini_api_key_here

# Alternative: OpenAI API Key
# OPENAI_API_KEY=your_openai_api_key_here
\`\`\`

### 2. Getting API Keys

#### Google Gemini API:
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key to your `.env.local` file

#### OpenAI API (Alternative):
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in to your OpenAI account
3. Click "Create new secret key"
4. Copy the key to your `.env.local` file

### 3. Local Development

\`\`\`bash
npm install
npm run dev
\`\`\`

Visit `http://localhost:3000` to see the app.

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. In Vercel dashboard, go to your project settings
4. Navigate to "Environment Variables"
5. Add your API key:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: Your actual API key
   - **Environment**: Production, Preview, Development

### Netlify Deployment

1. Push your code to GitHub
2. Connect your repository to Netlify
3. In Netlify dashboard, go to Site settings > Environment variables
4. Add your API key:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: Your actual API key

### Environment Variable Security

✅ **Secure Practices:**
- API keys are stored server-side only
- Never exposed to the frontend/client
- Used only in API routes (`/app/api/`)
- Validated before use

❌ **Never Do:**
- Hardcode API keys in your code
- Use API keys in client-side components
- Commit `.env.local` to version control
- Share API keys in public repositories

## API Integration Details

The app uses the AI SDK to integrate with Google Gemini:

\`\`\`typescript
// Server-side API route only
import { google } from "@ai-sdk/google"
import { streamText } from "ai"

const googleAI = google({
  apiKey: process.env.GEMINI_API_KEY, // Server-side only
})

const result = streamText({
  model: googleAI("gemini-1.5-flash"),
  messages,
  // ... other options
})
\`\`\`

## Troubleshooting

### "AI service is not configured" Error
- Check that your `.env.local` file exists and contains the API key
- Verify the API key is valid and active
- Restart your development server after adding environment variables

### API Rate Limits
- Gemini API has generous free tier limits
- Monitor your usage in the respective AI provider's dashboard
- Consider implementing rate limiting for production apps

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **AI Integration**: AI SDK with Google Gemini
- **Styling**: Tailwind CSS with glassmorphic effects
- **UI Components**: shadcn/ui
- **Speech**: Web Speech API
- **Storage**: Local Storage (client-side)
