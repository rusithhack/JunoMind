"use client"

import { useEffect, useRef, useState } from "react"

interface Props {
  text: string
  enabled: boolean
  onStart?: () => void
  onEnd?: () => void
}

export function TextToSpeech({ text, enabled, onStart, onEnd }: Props) {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const [lastSpokenText, setLastSpokenText] = useState<string>("")

  useEffect(() => {
    // Prevent speaking the same text multiple times
    if (!enabled || !text || typeof window === "undefined" || text === lastSpokenText) {
      return
    }

    // Cancel any previous speech
    try {
      speechSynthesis.cancel()
    } catch (e) {
      console.warn("Error canceling speech:", e)
    }

    let cancelled = false

    const speak = (retry = false) => {
      if (cancelled) return

      try {
        const ut = new SpeechSynthesisUtterance(text)
        utteranceRef.current = ut
        ut.rate = 0.9
        ut.pitch = 1.1
        ut.volume = 0.8

        // Attempt to pick a nicer voice (1st try only)
        if (!retry) {
          try {
            const voices = speechSynthesis.getVoices()
            const preferred = voices.find(
              (v) =>
                v &&
                v.name &&
                ["Google", "Microsoft", "Samantha", "Karen", "Alex", "Zira"].some((n) => v.name.includes(n)),
            )
            if (preferred) ut.voice = preferred
          } catch (e) {
            console.warn("Error setting voice:", e)
          }
        }

        ut.onstart = () => {
          setLastSpokenText(text)
          onStart?.()
        }

        ut.onend = () => {
          onEnd?.()
        }

        // If an error fires we retry once (without a custom voice) then give up silently
        ut.onerror = (event) => {
          console.warn("Speech synthesis error:", event)
          if (!retry) {
            setTimeout(() => speak(true), 200)
          } else {
            onEnd?.()
          }
        }

        speechSynthesis.speak(ut)
      } catch (error) {
        console.error("Error in speech synthesis:", error)
        onEnd?.()
      }
    }

    // Voices may arrive asynchronously
    try {
      if (speechSynthesis.getVoices().length) {
        speak()
      } else {
        const timer = setTimeout(speak, 300)
        const handleVoicesChanged = () => {
          clearTimeout(timer)
          speak()
        }
        speechSynthesis.addEventListener("voiceschanged", handleVoicesChanged, { once: true })

        // Cleanup
        return () => {
          cancelled = true
          clearTimeout(timer)
          speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged)
          try {
            speechSynthesis.cancel()
          } catch (e) {
            console.warn("Error canceling speech in cleanup:", e)
          }
        }
      }
    } catch (error) {
      console.error("Error initializing speech synthesis:", error)
    }

    return () => {
      cancelled = true
      try {
        speechSynthesis.cancel()
      } catch (e) {
        console.warn("Error canceling speech in cleanup:", e)
      }
    }
  }, [text, enabled, onStart, onEnd, lastSpokenText])

  return null
}
