"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Play, VolumeX } from "lucide-react"
import { TypingAnimation } from "./typing-animation"

interface MessageWithReplayProps {
  message: {
    id: string
    role: "user" | "assistant"
    content: string
  }
  darkMode: boolean
  isTyping?: boolean
  onTypingComplete?: (messageId: string) => void
}

export function MessageWithReplay({ message, darkMode, isTyping = false, onTypingComplete }: MessageWithReplayProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const playMessage = () => {
    if (isPlaying) {
      try {
        speechSynthesis.cancel()
      } catch (e) {
        console.warn("Error canceling speech:", e)
      }
      setIsPlaying(false)
      return
    }

    try {
      speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(message.content)
      utterance.rate = 0.9
      utterance.pitch = 1.1
      utterance.volume = 0.8

      // Try to use a better voice
      try {
        const voices = speechSynthesis.getVoices()
        const preferredVoice = voices.find(
          (v) =>
            v &&
            typeof v === "object" &&
            "name" in v &&
            typeof v.name === "string" &&
            (v.name.includes("Google") || v.name.includes("Microsoft") || v.name.includes("Samantha")),
        )
        if (preferredVoice) {
          utterance.voice = preferredVoice
        }
      } catch (e) {
        console.warn("Error setting voice:", e)
      }

      utterance.onstart = () => setIsPlaying(true)
      utterance.onend = () => setIsPlaying(false)
      utterance.onerror = (event) => {
        console.warn("Speech synthesis error:", event)
        setIsPlaying(false)
      }

      speechSynthesis.speak(utterance)
    } catch (error) {
      console.error("Error playing message:", error)
      setIsPlaying(false)
    }
  }

  return (
    <div
      className={`group relative max-w-[85%] p-4 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl ${
        message.role === "user"
          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
          : darkMode
            ? "bg-slate-700/80 text-white backdrop-blur-sm"
            : "bg-white/90 text-slate-800 shadow-sm backdrop-blur-sm"
      }`}
    >
      <div className="pr-8">
        {isTyping && onTypingComplete ? (
          <TypingAnimation
            text={message.content}
            onComplete={() => onTypingComplete(message.id)}
            className="text-inherit"
          />
        ) : (
          message.content
        )}
      </div>

      {/* Replay Button - Only show for assistant messages */}
      {message.role === "assistant" && !isTyping && (
        <Button
          variant="ghost"
          size="sm"
          onClick={playMessage}
          className={`absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 p-1 h-6 w-6 ${
            isPlaying
              ? "opacity-100 text-indigo-400 animate-pulse"
              : darkMode
                ? "text-slate-400 hover:text-white hover:bg-white/10"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
          }`}
          title={isPlaying ? "Stop playback" : "Replay message"}
        >
          {isPlaying ? <VolumeX className="w-3 h-3" /> : <Play className="w-3 h-3" />}
        </Button>
      )}
    </div>
  )
}
