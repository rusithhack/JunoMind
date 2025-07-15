"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Play, Pause, RotateCcw, Timer } from "lucide-react"
import { TimerSettings } from "./timer-settings"
import { EnhancedBinauralPlayer } from "./enhanced-binaural-player"
import { DataExport } from "./data-export"

interface ConversationToolsProps {
  darkMode: boolean
}

export function ConversationTools({ darkMode }: ConversationToolsProps) {
  const [timerMinutes, setTimerMinutes] = useState(25)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [timerActive, setTimerActive] = useState(false)
  const [timerDuration, setTimerDuration] = useState(25)
  const timerRef = useRef<NodeJS.Timeout>()

  // Timer logic
  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => {
        if (timerSeconds > 0) {
          setTimerSeconds(timerSeconds - 1)
        } else if (timerMinutes > 0) {
          setTimerMinutes(timerMinutes - 1)
          setTimerSeconds(59)
        } else {
          setTimerActive(false)
          // Timer completed notification
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("Juno Timer", {
              body: "Your focus session is complete! 🎉",
              icon: "/favicon.ico",
            })
          }
        }
      }, 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [timerActive, timerMinutes, timerSeconds])

  const toggleTimer = () => {
    if (timerActive) {
      setTimerActive(false)
    } else {
      if (timerMinutes === 0 && timerSeconds === 0) {
        setTimerMinutes(timerDuration)
        setTimerSeconds(0)
      }
      setTimerActive(true)
      // Request notification permission
      if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission()
      }
    }
  }

  const resetTimer = () => {
    setTimerActive(false)
    setTimerMinutes(timerDuration)
    setTimerSeconds(0)
  }

  const handleTimerDurationChange = (newDuration: number) => {
    setTimerDuration(newDuration)
    if (!timerActive) {
      setTimerMinutes(newDuration)
      setTimerSeconds(0)
    }
  }

  const formatTime = (minutes: number, seconds: number) => {
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="space-y-6">
      {/* Focus Timer */}
      <Card
        className={`p-6 ${
          darkMode ? "bg-white/5 border-white/10 backdrop-blur-lg" : "bg-white/70 border-white/20 backdrop-blur-lg"
        } shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div
              className={`p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg group-hover:scale-110 transition-transform duration-300`}
            >
              <Timer className="w-6 h-6 text-white" />
            </div>
            <h3 className={`font-semibold text-lg ${darkMode ? "text-white" : "text-slate-800"}`}>Focus Timer</h3>
          </div>
          <TimerSettings
            currentMinutes={timerDuration}
            onDurationChange={handleTimerDurationChange}
            darkMode={darkMode}
          />
        </div>

        <div className="text-center space-y-6">
          <div
            className={`text-5xl font-mono font-bold transition-all duration-300 ${
              timerActive
                ? "text-indigo-500 animate-pulse scale-110 drop-shadow-lg"
                : darkMode
                  ? "text-white"
                  : "text-slate-800"
            }`}
          >
            {formatTime(timerMinutes, timerSeconds)}
          </div>

          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              size="lg"
              onClick={toggleTimer}
              className={`transition-all duration-300 hover:scale-110 shadow-lg ${
                darkMode
                  ? "border-white/20 text-white hover:bg-white/10 hover:border-white/30"
                  : "border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
              } ${timerActive ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-400" : ""}`}
            >
              {timerActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 text-indigo-500" />}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={resetTimer}
              className={`transition-all duration-300 hover:scale-110 shadow-lg ${
                darkMode
                  ? "border-white/20 text-white hover:bg-white/10 hover:border-white/30"
                  : "border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              <RotateCcw className="w-5 h-5 text-indigo-500" />
            </Button>
          </div>

          <div className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
            {timerActive ? (
              <span className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Focus session in progress</span>
              </span>
            ) : (
              `${timerDuration} minute session ready`
            )}
          </div>
        </div>
      </Card>

      {/* Mindful Sounds */}
      <EnhancedBinauralPlayer darkMode={darkMode} />

      {/* Data Export */}
      <DataExport darkMode={darkMode} />
    </div>
  )
}
