"use client"

import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"

interface ThemeToggleProps {
  darkMode: boolean
  onToggle: () => void
}

export function ThemeToggle({ darkMode, onToggle }: ThemeToggleProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      className={`transition-all duration-300 hover:scale-110 ${
        darkMode
          ? "text-yellow-400 hover:bg-yellow-400/10 hover:text-yellow-300"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
      }`}
      title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {darkMode ? (
        <Sun className="w-5 h-5 transition-transform duration-300 hover:rotate-12" />
      ) : (
        <Moon className="w-5 h-5 transition-transform duration-300 hover:-rotate-12" />
      )}
    </Button>
  )
}
