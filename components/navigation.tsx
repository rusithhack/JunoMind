"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Menu, X, User, LogOut } from "lucide-react"
import { SupabaseUserService } from "@/lib/supabase-user-service"
import { ThemeToggle } from "./theme-toggle"

interface NavigationProps {
  currentPage: string
  onPageChange: (page: string) => void
  darkMode: boolean
  onDarkModeToggle: () => void
}

export function Navigation({ currentPage, onPageChange, darkMode, onDarkModeToggle }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await SupabaseUserService.getCurrentUser()
      setUser(currentUser)
    }

    loadUser()

    const handleUserChange = () => {
      loadUser()
    }

    window.addEventListener("userChanged", handleUserChange)
    return () => window.removeEventListener("userChanged", handleUserChange)
  }, [])

  const navItems = [
    { id: "juno", label: "Juno", badge: null },
    { id: "about", label: "About", badge: null },
    { id: "features", label: "Features", badge: "New" },
    { id: "contact", label: "Contact", badge: null },
  ]

  const handleSignOut = async () => {
    await SupabaseUserService.signOut()
    setUser(null)
    onPageChange("juno")
  }

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        darkMode
          ? "bg-slate-900/95 border-white/10 backdrop-blur-lg"
          : "bg-white/95 border-slate-200/50 backdrop-blur-lg"
      } border-b shadow-lg`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className={`text-xl font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>Juno</h1>
              <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>AI Mental Health Copilot</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={currentPage === item.id ? "default" : "ghost"}
                onClick={() => onPageChange(item.id)}
                className={`relative transition-all duration-200 ${
                  currentPage === item.id
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                    : darkMode
                      ? "text-slate-300 hover:text-white hover:bg-white/10"
                      : "text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                }`}
              >
                {item.label}
                {item.badge && (
                  <Badge variant="secondary" className="ml-2 text-xs bg-green-500 text-white">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            ))}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <ThemeToggle darkMode={darkMode} onToggle={onDarkModeToggle} />

            {user ? (
              <div className="flex items-center space-x-3">
                <div className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>Welcome, {user.name}</div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className={`${
                    darkMode
                      ? "border-white/20 text-white hover:bg-white/10"
                      : "border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => onPageChange("auth")}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
              >
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle darkMode={darkMode} onToggle={onDarkModeToggle} />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={darkMode ? "text-white" : "text-slate-800"}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`md:hidden py-4 border-t ${darkMode ? "border-white/10" : "border-slate-200"}`}>
            <div className="space-y-2">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? "default" : "ghost"}
                  onClick={() => {
                    onPageChange(item.id)
                    setIsMenuOpen(false)
                  }}
                  className={`w-full justify-start ${
                    currentPage === item.id
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                      : darkMode
                        ? "text-slate-300 hover:text-white hover:bg-white/10"
                        : "text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                  }`}
                >
                  {item.label}
                  {item.badge && (
                    <Badge variant="secondary" className="ml-2 text-xs bg-green-500 text-white">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              ))}

              <div className="pt-4 border-t border-slate-200/20">
                {user ? (
                  <div className="space-y-2">
                    <div className={`px-3 py-2 text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                      Welcome, {user.name}
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleSignOut}
                      className={`w-full justify-start ${
                        darkMode
                          ? "border-white/20 text-white hover:bg-white/10"
                          : "border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => {
                      onPageChange("auth")
                      setIsMenuOpen(false)
                    }}
                    className="w-full justify-start bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
