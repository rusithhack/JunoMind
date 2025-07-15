"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, Check, X } from "lucide-react"

interface TimerSettingsProps {
  currentMinutes: number
  onDurationChange: (minutes: number) => void
  darkMode: boolean
}

export function TimerSettings({ currentMinutes, onDurationChange, darkMode }: TimerSettingsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [tempMinutes, setTempMinutes] = useState(currentMinutes)

  const handleSave = () => {
    const minutes = Math.max(1, Math.min(120, tempMinutes))
    onDurationChange(minutes)
    setIsOpen(false)
  }

  const handleCancel = () => {
    setTempMinutes(currentMinutes)
    setIsOpen(false)
  }

  const presetDurations = [5, 15, 25, 30, 45, 60]

  if (!isOpen) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className={`${
          darkMode
            ? "text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10"
            : "text-slate-600 hover:text-indigo-600 hover:bg-indigo-100"
        } transition-all duration-200`}
      >
        <Settings className="w-4 h-4" />
      </Button>
    )
  }

  return (
    <Card
      className={`absolute top-0 left-0 right-0 z-10 ${
        darkMode ? "bg-slate-800/95 border-white/20 backdrop-blur-lg" : "bg-white/95 border-slate-200 backdrop-blur-lg"
      }`}
    >
      <CardHeader className="pb-3">
        <CardTitle className={`text-sm ${darkMode ? "text-white" : "text-slate-800"}`}>Timer Duration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="minutes" className={`text-xs ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
            Minutes (1-120)
          </Label>
          <Input
            id="minutes"
            type="number"
            min="1"
            max="120"
            value={tempMinutes}
            onChange={(e) => setTempMinutes(Number.parseInt(e.target.value) || 1)}
            className={`mt-1 ${
              darkMode ? "bg-white/10 border-white/20 text-white" : "bg-white border-slate-200 text-slate-800"
            }`}
          />
        </div>

        <div>
          <Label className={`text-xs ${darkMode ? "text-slate-300" : "text-slate-600"}`}>Quick Select</Label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {presetDurations.map((duration) => (
              <Button
                key={duration}
                variant={tempMinutes === duration ? "default" : "outline"}
                size="sm"
                onClick={() => setTempMinutes(duration)}
                className={`text-xs ${
                  tempMinutes === duration
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : darkMode
                      ? "border-white/20 text-white hover:bg-indigo-500/10 hover:text-indigo-400 hover:border-indigo-400/50"
                      : "border-slate-200 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300"
                }`}
              >
                {duration}m
              </Button>
            ))}
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={handleSave}
            size="sm"
            className={`flex-1 ${
              darkMode ? "bg-teal-600 hover:bg-teal-700 text-white" : "bg-teal-600 hover:bg-teal-700 text-white"
            }`}
          >
            <Check className="w-4 h-4 mr-1" />
            Save
          </Button>
          <Button
            onClick={handleCancel}
            variant="outline"
            size="sm"
            className={`flex-1 ${
              darkMode
                ? "border-white/20 text-white hover:bg-white/10 hover:text-slate-300"
                : "border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <X className="w-4 h-4 mr-1" />
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
