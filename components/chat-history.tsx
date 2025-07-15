"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, Trash2, Plus, Clock } from "lucide-react"
import { SupabaseUserService, type Conversation } from "@/lib/supabase-user-service"

interface ChatHistoryProps {
  darkMode: boolean
  onLoadConversation: (conversation: Conversation) => void
  onNewConversation: () => void
}

export function ChatHistory({ darkMode, onLoadConversation, onNewConversation }: ChatHistoryProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadConversations()
  }, [])

  const loadConversations = async () => {
    setIsLoading(true)
    try {
      const convs = await SupabaseUserService.getConversations()
      setConversations(convs)
    } catch (error) {
      console.error("Error loading conversations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteConversation = async (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm("Are you sure you want to delete this conversation?")) {
      const success = await SupabaseUserService.deleteConversation(conversationId)
      if (success) {
        setConversations((prev) => prev.filter((c) => c.id !== conversationId))
      }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diffInHours < 168) {
      // 7 days
      return date.toLocaleDateString([], { weekday: "short" })
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    }
  }

  return (
    <Card
      className={`${
        darkMode ? "bg-white/5 border-white/10 backdrop-blur-lg" : "bg-white/70 border-white/20 backdrop-blur-lg"
      } shadow-xl h-full`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className={`text-lg ${darkMode ? "text-white" : "text-slate-800"}`}>Chat History</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onNewConversation}
            className={`${
              darkMode ? "text-slate-300 hover:text-white hover:bg-white/10" : "text-slate-600 hover:text-slate-800"
            }`}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-[400px] px-4">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`h-16 rounded-lg animate-pulse ${darkMode ? "bg-white/5" : "bg-slate-200/50"}`}
                />
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className={`w-12 h-12 mx-auto mb-3 ${darkMode ? "text-slate-500" : "text-slate-400"}`} />
              <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                No conversations yet. Start chatting with Juno!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => onLoadConversation(conversation)}
                  className={`group p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    darkMode
                      ? "hover:bg-white/10 border border-transparent hover:border-white/20"
                      : "hover:bg-slate-100 border border-transparent hover:border-slate-200"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-medium truncate ${darkMode ? "text-white" : "text-slate-800"}`}>
                        {conversation.title}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock className={`w-3 h-3 ${darkMode ? "text-slate-500" : "text-slate-400"}`} />
                        <span className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                          {formatDate(conversation.updatedAt)}
                        </span>
                        <span className={`text-xs ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                          • {conversation.messages.length} messages
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDeleteConversation(conversation.id, e)}
                      className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6 ${
                        darkMode ? "text-slate-400 hover:text-red-400" : "text-slate-500 hover:text-red-500"
                      }`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
