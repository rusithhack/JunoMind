"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Send, Heart, Smile, Sparkles, MessageCircle, Volume2, VolumeX } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { AuthPage } from "@/components/auth-page"
import { AboutPage } from "@/components/about-page"
import { FeaturesPage } from "@/components/features-page"
import { ContactPage } from "@/components/contact-page"
import { EnhancedSpeechRecognition } from "@/components/enhanced-speech-recognition"
import { TextToSpeech } from "@/components/text-to-speech"
import { ConversationTools } from "@/components/conversation-tools"
import { MessageReplay } from "@/components/message-replay"
import { ChatHistory } from "@/components/chat-history"
import { MessageWithReplay } from "@/components/message-with-replay"
import { SupabaseUserService, type Conversation, type ChatMessage } from "@/lib/supabase-user-service"

const DAILY_QUOTES = [
  "Every moment is a fresh beginning. 🌱",
  "You are stronger than you think. 💪",
  "Progress, not perfection. ✨",
  "Breathe in peace, breathe out stress. 🌸",
  "Your feelings are valid and temporary. 🤗",
  "Small steps lead to big changes. 🦋",
  "You deserve kindness, especially from yourself. 💝",
]

const DAILY_AFFIRMATIONS = [
  "I am worthy of love and happiness 💖",
  "Every breath I take fills me with calm and peace 🌸",
  "I choose to focus on what I can control 🎯",
  "My feelings are valid and temporary 🌊",
  "I am growing stronger with each challenge 💪",
  "Today I choose kindness towards myself 🤗",
  "I trust in my ability to navigate life's ups and downs 🦋",
  "I am exactly where I need to be right now ✨",
  "My mental health matters and I prioritize it 🧠",
  "I celebrate small victories and progress 🎉",
  "I am resilient and capable of healing 🌱",
  "Peace begins with me 🕊️",
]

const MOOD_EMOJIS = ["😔", "😕", "😐", "🙂", "😊"]
const MOOD_LABELS = ["Very Sad", "Sad", "Neutral", "Happy", "Very Happy"]

export default function JunoApp() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error, setMessages } = useChat({
    api: "/api/chat",
    onError: (error) => {
      console.error("Chat error:", error)
      setIsTyping(false)
      setAvatarPulse(false)
    },
    onFinish: async (message) => {
      setIsTyping(false)
      setAvatarPulse(false)

      // Save conversation after each message
      try {
        const user = await SupabaseUserService.getCurrentUser()
        if (user && currentConversationId) {
          const chatMessages: ChatMessage[] = [...messages, message].map((m) => ({
            id: m.id,
            role: m.role as "user" | "assistant",
            content: m.content,
            timestamp: new Date().toISOString(),
          }))
          await SupabaseUserService.updateConversation(currentConversationId, chatMessages)
        }
      } catch (error) {
        console.error("Error saving conversation:", error)
      }
    },
  })

  const [currentPage, setCurrentPage] = useState("juno")
  const [darkMode, setDarkMode] = useState(true)
  const [currentMood, setCurrentMood] = useState([2])
  const [ttsEnabled, setTtsEnabled] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [dailyQuote, setDailyQuote] = useState("")
  const [currentAffirmation, setCurrentAffirmation] = useState("")
  const [showWelcome, setShowWelcome] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const [avatarPulse, setAvatarPulse] = useState(false)
  const [typingMessages, setTypingMessages] = useState<Set<string>>(new Set())
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize Supabase auth listener
  useEffect(() => {
    SupabaseUserService.initializeAuthListener()

    const loadUser = async () => {
      try {
        const currentUser = await SupabaseUserService.getCurrentUser()
        setUser(currentUser)
        if (currentUser?.preferences) {
          setDarkMode(currentUser.preferences.darkMode)
          setTtsEnabled(currentUser.preferences.ttsEnabled)
        }
      } catch (error) {
        console.error("Error loading user:", error)
      }
    }

    loadUser()

    const handleUserChange = () => {
      loadUser()
    }

    window.addEventListener("userChanged", handleUserChange)
    return () => window.removeEventListener("userChanged", handleUserChange)
  }, [])

  // Initialize daily content
  useEffect(() => {
    try {
      const today = new Date().toDateString()
      const savedQuote = localStorage.getItem(`juno-quote-${today}`)
      const savedAffirmation = localStorage.getItem(`juno-affirmation-${today}`)

      if (savedQuote) {
        setDailyQuote(savedQuote)
      } else {
        const randomQuote = DAILY_QUOTES[Math.floor(Math.random() * DAILY_QUOTES.length)]
        setDailyQuote(randomQuote)
        localStorage.setItem(`juno-quote-${today}`, randomQuote)
      }

      if (savedAffirmation) {
        setCurrentAffirmation(savedAffirmation)
      } else {
        const randomAffirmation = DAILY_AFFIRMATIONS[Math.floor(Math.random() * DAILY_AFFIRMATIONS.length)]
        setCurrentAffirmation(randomAffirmation)
        localStorage.setItem(`juno-affirmation-${today}`, randomAffirmation)
      }
    } catch (error) {
      console.error("Error initializing daily content:", error)
    }
  }, [])

  // Load saved preferences
  useEffect(() => {
    try {
      const today = new Date().toDateString()
      const savedMood = localStorage.getItem(`juno-mood-${today}`)
      const savedMute = localStorage.getItem("juno-muted")

      if (savedMood) setCurrentMood([Number.parseInt(savedMood)])
      if (savedMute !== null) setIsMuted(savedMute === "true")
    } catch (error) {
      console.error("Error loading preferences:", error)
    }
  }, [])

  // Save preferences
  useEffect(() => {
    try {
      const today = new Date().toDateString()
      localStorage.setItem(`juno-mood-${today}`, currentMood[0].toString())
    } catch (error) {
      console.error("Error saving mood:", error)
    }
  }, [currentMood])

  useEffect(() => {
    try {
      localStorage.setItem("juno-muted", isMuted.toString())
    } catch (error) {
      console.error("Error saving mute setting:", error)
    }
  }, [isMuted])

  // Update user preferences in Supabase
  useEffect(() => {
    const updateUserPreferences = async () => {
      if (user) {
        try {
          await SupabaseUserService.updateUser({
            preferences: {
              darkMode,
              ttsEnabled,
              notifications: user.preferences?.notifications || true,
            },
          })
        } catch (error) {
          console.error("Error updating user preferences:", error)
        }
      }
    }

    updateUserPreferences()
  }, [darkMode, ttsEnabled, user])

  // Auto-scroll to bottom of messages
  useEffect(() => {
    try {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    } catch (error) {
      console.error("Error scrolling to bottom:", error)
    }
  }, [messages])

  // Enhanced loading state management
  useEffect(() => {
    if (isLoading) {
      setIsTyping(true)
      setAvatarPulse(true)
    }
  }, [isLoading])

  const handleTypingComplete = (messageId: string) => {
    setTypingMessages((prev) => {
      const newSet = new Set(prev)
      newSet.delete(messageId)
      return newSet
    })
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (!isMuted) {
      try {
        speechSynthesis.cancel()
      } catch (e) {
        console.warn("Error canceling speech:", e)
      }
    }
  }

  const handleAuthSuccess = () => {
    setCurrentPage("juno")
  }

  const handleLoadConversation = (conversation: Conversation) => {
    try {
      const aiMessages = conversation.messages.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        createdAt: new Date(m.timestamp),
      }))
      setMessages(aiMessages)
      setCurrentConversationId(conversation.id)
      setShowWelcome(false)
    } catch (error) {
      console.error("Error loading conversation:", error)
    }
  }

  const handleNewConversation = async () => {
    setMessages([])
    setCurrentConversationId(null)
    setShowWelcome(true)
  }

  const handleSubmitWithSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!input.trim()) return

    try {
      // If this is the first message in a new conversation, create a new conversation
      if (!currentConversationId && user) {
        const userMessage: ChatMessage = {
          id: Date.now().toString(),
          role: "user",
          content: input,
          timestamp: new Date().toISOString(),
        }

        const conversationId = await SupabaseUserService.saveConversation([userMessage])
        if (conversationId) {
          setCurrentConversationId(conversationId)
        }
      }

      handleSubmit(e)
    } catch (error) {
      console.error("Error submitting message:", error)
      handleSubmit(e) // Still try to submit even if save fails
    }
  }

  // Render different pages
  const renderPage = () => {
    switch (currentPage) {
      case "auth":
        return <AuthPage darkMode={darkMode} onAuthSuccess={handleAuthSuccess} />
      case "about":
        return <AboutPage darkMode={darkMode} />
      case "features":
        return <FeaturesPage darkMode={darkMode} />
      case "contact":
        return <ContactPage darkMode={darkMode} />
      default:
        return renderJunoPage()
    }
  }

  const renderJunoPage = () => (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="flex flex-col space-y-8">
        {/* Main Chat Area */}
        <div className="w-full">
          <Card
            className={`${
              darkMode ? "bg-white/5 border-white/10 backdrop-blur-lg" : "bg-white/70 border-white/20 backdrop-blur-lg"
            } h-[70vh] flex flex-col shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden`}
          >
            {/* Daily Quote */}
            <div
              className={`p-6 border-b ${darkMode ? "border-white/10" : "border-slate-200/50"} bg-gradient-to-r from-indigo-500/10 to-purple-500/10`}
            >
              <p className={`text-center italic text-lg ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                {dailyQuote}
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {showWelcome && messages.length === 0 && (
                <div className="text-center py-12 animate-fade-in">
                  <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center animate-float shadow-xl">
                    <Heart className="w-12 h-12 text-white" />
                  </div>
                  <h3 className={`text-2xl font-semibold mb-4 ${darkMode ? "text-white" : "text-slate-800"}`}>
                    Hello, I'm Juno 💜
                  </h3>
                  <p
                    className={`${darkMode ? "text-slate-300" : "text-slate-600"} max-w-lg mx-auto mb-6 leading-relaxed text-lg`}
                  >
                    I'm your compassionate AI companion for mental and emotional wellbeing. I'm here to listen, support,
                    and guide you through whatever you're experiencing.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3 mb-8">
                    <Badge variant="secondary" className="text-sm px-4 py-2 hover:scale-105 transition-transform">
                      Mood Tracking
                    </Badge>
                    <Badge variant="secondary" className="text-sm px-4 py-2 hover:scale-105 transition-transform">
                      Focus Timer
                    </Badge>
                    <Badge variant="secondary" className="text-sm px-4 py-2 hover:scale-105 transition-transform">
                      Mindful Sounds
                    </Badge>
                  </div>
                  <Button
                    onClick={() => setShowWelcome(false)}
                    className={`px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${
                      darkMode
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white"
                    }`}
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Start Conversation
                  </Button>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-slide-up`}
                >
                  <MessageWithReplay
                    message={message}
                    darkMode={darkMode}
                    isTyping={typingMessages.has(message.id)}
                    onTypingComplete={handleTypingComplete}
                  />
                </div>
              ))}

              {(isLoading || isTyping) && (
                <div className="flex justify-start animate-fade-in">
                  <div
                    className={`p-5 rounded-2xl shadow-lg ${
                      darkMode ? "bg-slate-700/50 backdrop-blur-sm" : "bg-white/70 backdrop-blur-sm shadow-sm"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                        <Heart className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce"></div>
                        <div
                          className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className={`text-sm font-medium ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                        Juno is thinking...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex justify-center animate-fade-in">
                  <div
                    className={`max-w-[85%] p-4 rounded-2xl border-2 border-red-500/20 shadow-lg ${
                      darkMode ? "bg-red-900/20 text-red-300" : "bg-red-50 text-red-700"
                    }`}
                  >
                    <p className="text-sm font-medium">Connection Error</p>
                    <p className="text-xs mt-1">
                      {error.message || "Unable to connect to AI service. Please check your configuration."}
                    </p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Text-to-Speech for assistant messages */}
            {messages.length > 0 && (
              <TextToSpeech
                text={messages[messages.length - 1]?.role === "assistant" ? messages[messages.length - 1].content : ""}
                enabled={ttsEnabled && !isMuted && messages[messages.length - 1]?.role === "assistant"}
              />
            )}

            {/* Enhanced Input Area */}
            <div
              className={`p-6 border-t ${darkMode ? "border-white/10" : "border-slate-200/50"} bg-gradient-to-r from-indigo-500/5 to-purple-500/5`}
            >
              <form onSubmit={handleSubmitWithSave} className="flex space-x-3">
                <div className="flex-1 relative">
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Share what's on your mind..."
                    className={`pr-14 py-3 text-lg transition-all duration-200 focus:ring-2 focus:ring-indigo-500 ${
                      darkMode
                        ? "bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                        : "bg-white/50 border-slate-200 text-slate-800"
                    }`}
                    disabled={isLoading}
                  />
                  <EnhancedSpeechRecognition
                    onResult={(transcript) => handleInputChange({ target: { value: transcript } } as any)}
                    disabled={isLoading}
                    darkMode={darkMode}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className={`px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                    darkMode
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  }`}
                >
                  <Send className="w-5 h-5" />
                </Button>
              </form>

              {/* Controls */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="tts-toggle" className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                      Voice Responses
                    </Label>
                    <Switch id="tts-toggle" checked={ttsEnabled} onCheckedChange={setTtsEnabled} disabled={isMuted} />
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMute}
                  className={`transition-all duration-200 ${
                    darkMode
                      ? "text-white hover:bg-white/10 hover:text-indigo-400"
                      : "text-slate-600 hover:bg-slate-100 hover:text-indigo-600"
                  } ${isMuted ? "text-red-500" : ""}`}
                  title={isMuted ? "Unmute Juno" : "Mute Juno"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Bottom Section - Vertical Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Chat History - Only show for authenticated users */}
          {user && (
            <div className="lg:col-span-2 xl:col-span-1">
              <ChatHistory
                darkMode={darkMode}
                onLoadConversation={handleLoadConversation}
                onNewConversation={handleNewConversation}
              />
            </div>
          )}

          {/* Enhanced Mood Check-in */}
          <Card
            className={`p-6 ${
              darkMode ? "bg-white/5 border-white/10 backdrop-blur-lg" : "bg-white/70 border-white/20 backdrop-blur-lg"
            } shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group overflow-hidden`}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div
                className={`p-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 shadow-lg group-hover:scale-110 transition-transform duration-300`}
              >
                <Smile className="w-6 h-6 text-white" />
              </div>
              <h3 className={`font-semibold text-lg ${darkMode ? "text-white" : "text-slate-800"}`}>Mood Check-in</h3>
            </div>
            <div className="space-y-6">
              <div className="flex justify-between text-3xl">
                {MOOD_EMOJIS.map((emoji, index) => (
                  <button
                    key={index}
                    className={`cursor-pointer transition-all duration-300 hover:scale-125 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg p-3 ${
                      currentMood[0] === index
                        ? "scale-125 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 shadow-lg ring-2 ring-indigo-500/50"
                        : darkMode
                          ? "hover:bg-white/10"
                          : "hover:bg-slate-100"
                    }`}
                    onClick={() => setCurrentMood([index])}
                    title={MOOD_LABELS[index]}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <Slider value={currentMood} onValueChange={setCurrentMood} max={4} step={1} className="w-full" />
              <div className="text-center">
                <p className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                  How are you feeling today?
                </p>
                <p className={`text-lg font-medium mt-1 ${darkMode ? "text-white" : "text-slate-800"}`}>
                  {MOOD_LABELS[currentMood[0]]}
                </p>
              </div>
            </div>
          </Card>

          {/* Enhanced Daily Affirmation */}
          <Card
            className={`p-6 ${
              darkMode ? "bg-white/5 border-white/10 backdrop-blur-lg" : "bg-white/70 border-white/20 backdrop-blur-lg"
            } shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group overflow-hidden`}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div
                className={`p-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 shadow-lg group-hover:scale-110 transition-transform duration-300`}
              >
                <Sparkles className="w-6 h-6 text-white group-hover:animate-pulse" />
              </div>
              <h3 className={`font-semibold text-lg ${darkMode ? "text-white" : "text-slate-800"}`}>
                Daily Affirmation
              </h3>
            </div>
            <div className="text-center p-6 rounded-xl bg-gradient-to-r from-yellow-400/10 to-orange-400/10 border border-yellow-400/20 group-hover:from-yellow-400/20 group-hover:to-orange-400/20 transition-all duration-300">
              <p
                className={`text-base font-medium ${darkMode ? "text-yellow-200" : "text-yellow-800"} leading-relaxed`}
              >
                {currentAffirmation}
              </p>
            </div>
          </Card>
        </div>

        {/* Additional Tools Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Message Replay */}
          <MessageReplay messages={messages} darkMode={darkMode} />

          {/* Conversation Tools */}
          <ConversationTools darkMode={darkMode} />
        </div>
      </div>
    </div>
  )

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900"
          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
      }`}
    >
      <Navigation
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        darkMode={darkMode}
        onDarkModeToggle={() => setDarkMode(!darkMode)}
      />
      {renderPage()}
    </div>
  )
}
