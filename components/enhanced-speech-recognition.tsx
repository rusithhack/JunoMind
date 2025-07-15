"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Loader2, AlertCircle } from "lucide-react"

interface SpeechRecognitionProps {
  onResult: (transcript: string) => void
  disabled?: boolean
  darkMode?: boolean
}

export function EnhancedSpeechRecognition({ onResult, disabled, darkMode }: SpeechRecognitionProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<any>()
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    // Check if speech recognition is supported
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      if (SpeechRecognition) {
        setIsSupported(true)

        try {
          recognitionRef.current = new SpeechRecognition()
          recognitionRef.current.continuous = false
          recognitionRef.current.interimResults = false
          recognitionRef.current.lang = "en-US"
          recognitionRef.current.maxAlternatives = 1

          recognitionRef.current.onstart = () => {
            console.log("Speech recognition started")
            setIsListening(true)
            setIsProcessing(false)
            setError(null)

            // Auto-stop after 15 seconds to prevent hanging
            timeoutRef.current = setTimeout(() => {
              if (recognitionRef.current) {
                try {
                  recognitionRef.current.stop()
                } catch (e) {
                  console.warn("Error stopping recognition:", e)
                }
              }
            }, 15000)
          }

          recognitionRef.current.onresult = (event: any) => {
            console.log("Speech recognition result received")
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current)
            }

            setIsProcessing(true)

            try {
              if (event?.results?.[0]?.[0]?.transcript) {
                const transcript = event.results[0][0].transcript
                console.log("Transcript:", transcript)

                // Small delay to show processing state
                setTimeout(() => {
                  onResult(transcript)
                  setIsListening(false)
                  setIsProcessing(false)
                }, 300)
              } else {
                throw new Error("No transcript found in results")
              }
            } catch (err) {
              console.error("Error processing speech result:", err)
              setError("Failed to process speech")
              setIsListening(false)
              setIsProcessing(false)
            }
          }

          recognitionRef.current.onerror = (event: any) => {
            console.error("Speech recognition error:", event)
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current)
            }

            let errorMessage = "Speech recognition failed"
            if (event?.error) {
              switch (event.error) {
                case "no-speech":
                  errorMessage = "No speech detected. Please try again."
                  break
                case "audio-capture":
                  errorMessage = "Microphone not accessible. Please check permissions."
                  break
                case "not-allowed":
                  errorMessage = "Microphone permission denied. Please allow microphone access."
                  break
                case "network":
                  errorMessage = "Network error. Please check your connection."
                  break
                default:
                  errorMessage = `Speech recognition error: ${event.error}`
              }
            }

            setError(errorMessage)
            setIsListening(false)
            setIsProcessing(false)
          }

          recognitionRef.current.onend = () => {
            console.log("Speech recognition ended")
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current)
            }
            setIsListening(false)
            if (isProcessing) {
              setIsProcessing(false)
            }
          }
        } catch (err) {
          console.error("Failed to initialize speech recognition:", err)
          setIsSupported(false)
        }
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [onResult, isProcessing])

  const toggleListening = async () => {
    if (!recognitionRef.current || disabled) return

    if (isListening) {
      try {
        recognitionRef.current.stop()
      } catch (e) {
        console.warn("Error stopping recognition:", e)
        setIsListening(false)
        setIsProcessing(false)
      }
    } else {
      try {
        // Request microphone permission first
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          await navigator.mediaDevices.getUserMedia({ audio: true })
        }

        setError(null)
        recognitionRef.current.start()
      } catch (error) {
        console.error("Failed to start speech recognition:", error)
        setError("Microphone access denied. Please allow microphone permissions.")
        setIsListening(false)
        setIsProcessing(false)
      }
    }
  }

  if (!isSupported) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled
        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 opacity-50"
        title="Speech recognition not supported in this browser"
      >
        <AlertCircle className="w-4 h-4" />
      </Button>
    )
  }

  return (
    <div className="absolute right-1 top-1/2 -translate-y-1/2">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={`h-8 w-8 transition-all duration-200 ${
          isListening || isProcessing
            ? "text-red-500 animate-pulse scale-110 bg-red-500/10"
            : error
              ? "text-orange-500 hover:text-orange-600"
              : darkMode
                ? "text-slate-400 hover:text-indigo-400 hover:scale-105 hover:bg-indigo-500/10"
                : "text-slate-600 hover:text-indigo-600 hover:scale-105 hover:bg-indigo-100"
        }`}
        onClick={toggleListening}
        disabled={disabled || isProcessing}
        title={
          error
            ? error
            : isProcessing
              ? "Processing speech..."
              : isListening
                ? "Stop listening (click or speak)"
                : "Start voice input (click and speak)"
        }
      >
        {isProcessing ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isListening ? (
          <MicOff className="w-4 h-4" />
        ) : error ? (
          <AlertCircle className="w-4 h-4" />
        ) : (
          <Mic className="w-4 h-4" />
        )}
      </Button>

      {error && (
        <div
          className={`absolute top-full right-0 mt-1 p-2 rounded-lg text-xs whitespace-nowrap z-50 max-w-xs ${
            darkMode ? "bg-orange-900/90 text-orange-200" : "bg-orange-100 text-orange-800"
          } shadow-lg border border-orange-500/20`}
        >
          {error}
        </div>
      )}
    </div>
  )
}
