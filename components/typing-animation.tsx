"use client"

import { useState, useEffect } from "react"

interface TypingAnimationProps {
  text: string
  speed?: number
  onComplete?: () => void
  className?: string
}

export function TypingAnimation({ text, speed = 30, onComplete, className = "" }: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex + 1))
        setCurrentIndex(currentIndex + 1)
      }, speed)

      return () => clearTimeout(timer)
    } else if (onComplete) {
      onComplete()
    }
  }, [currentIndex, text, speed, onComplete])

  useEffect(() => {
    // Reset when text changes
    setDisplayedText("")
    setCurrentIndex(0)
  }, [text])

  return (
    <span className={className}>
      {displayedText}
      {currentIndex < text.length && <span className="animate-pulse text-indigo-400">|</span>}
    </span>
  )
}
