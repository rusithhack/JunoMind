"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Volume2, VolumeX } from "lucide-react"
import type { Message } from "ai"

interface MessageReplayProps {
  messages: Message[]
  darkMode: boolean
}

export function MessageReplay({ messages, darkMode }: MessageReplayProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentMessageIndex, setCurrentMessageIndex] = useState<number | null>(null)

  const assistantMessages = messages.filter((msg) => msg.role === "assistant")

  const playMessage = (message: string, index: number) => {
    if (isPlaying && currentMessageIndex === index) {
      speechSynthesis.cancel()
      setIsPlaying(false)
      setCurrentMessageIndex(null)
      return
    }

    speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(message)
    utterance.rate = 0.9
    utterance.pitch = 1.1
    utterance.volume = 0.8

    // Try to use a better voice
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

    utterance.onstart = () => {
      setIsPlaying(true)
      setCurrentMessageIndex(index)
    }

    utterance.onend = () => {
      setIsPlaying(false)
      setCurrentMessageIndex(null)
    }

    utterance.onerror = () => {
      setIsPlaying(false)
      setCurrentMessageIndex(null)
    }

    speechSynthesis.speak(utterance)
  }

  if (assistantMessages.length === 0) {
    return null
  }

  return (
    <Card
      className={`${
        darkMode ? "bg-white/5 border-white/10 backdrop-blur-lg" : "bg-white/70 border-white/20 backdrop-blur-lg"
      } shadow-xl`}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className={`font-semibold text-sm ${darkMode ? "text-white" : "text-slate-800"}`}>
            Replay Juno's Messages
          </h3>
          {isPlaying && (
            <div className="flex items-center space-x-2">
              <Volume2 className="w-4 h-4 text-indigo-500 animate-pulse" />
              <span className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-600"}`}>Playing...</span>
            </div>
          )}
        </div>

        <div className="space-y-2 max-h-32 overflow-y-auto">
          {assistantMessages.slice(-5).map((message, index) => (
            <div
              key={message.id}
              className={`flex items-start space-x-2 p-2 rounded-lg transition-all duration-200 ${
                currentMessageIndex === index
                  ? darkMode
                    ? "bg-indigo-500/20 border border-indigo-500/30"
                    : "bg-indigo-100 border border-indigo-200"
                  : darkMode
                    ? "hover:bg-white/5"
                    : "hover:bg-slate-50"
              }`}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => playMessage(message.content, index)}
                className={`flex-shrink-0 h-8 w-8 p-0 ${
                  currentMessageIndex === index
                    ? "text-indigo-500"
                    : darkMode
                      ? "text-slate-400 hover:text-white"
                      : "text-slate-600 hover:text-slate-800"
                }`}
              >
                {isPlaying && currentMessageIndex === index ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>
              <p className={`text-xs leading-relaxed flex-1 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                {message.content.length > 100 ? `${message.content.substring(0, 100)}...` : message.content}
              </p>
            </div>
          ))}
        </div>

        {assistantMessages.length > 5 && (
          <p className={`text-xs mt-2 text-center ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
            Showing last 5 messages
          </p>
        )}
      </CardContent>
    </Card>
  )
}
