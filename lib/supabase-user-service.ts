import { supabase } from "./supabase"

export interface JunoUser {
  id: string
  name: string
  email: string
  createdAt: Date
  preferences: {
    darkMode: boolean
    ttsEnabled: boolean
    notifications: boolean
  }
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

export interface Conversation {
  id: string
  userId: string
  title: string
  messages: ChatMessage[]
  createdAt: string
  updatedAt: string
}

export class SupabaseUserService {
  private static currentUser: JunoUser | null = null

  static async getCurrentUser(): Promise<JunoUser | null> {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      /**
       * Supabase returns an `Auth session missing!` error
       * when the user is not signed-in. This isn’t a real
       * failure — it simply means there’s no active session.
       */
      if (authError && authError.message !== "Auth session missing!") {
        console.error("Auth error:", authError)
      }

      if (!user) return null

      if (!this.currentUser || this.currentUser.id !== user.id) {
        const { data: userData, error: dbError } = await supabase.from("users").select("*").eq("id", user.id).single()

        if (dbError) {
          console.error("Database error:", dbError)
          return null
        }

        if (userData) {
          this.currentUser = {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            createdAt: new Date(userData.created_at),
            preferences: userData.preferences || {
              darkMode: true,
              ttsEnabled: true,
              notifications: true,
            },
          }
        }
      }

      return this.currentUser
    } catch (error) {
      console.error("Error getting current user:", error)
      return null
    }
  }

  static async signUp(name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase.from("users").insert({
          id: data.user.id,
          email,
          name,
          preferences: {
            darkMode: true,
            ttsEnabled: true,
            notifications: true,
          },
        })

        if (profileError) {
          console.error("Error creating user profile:", profileError)
          return { success: false, error: "Failed to create user profile" }
        }

        this.dispatchUserChange()
        return { success: true }
      }

      return { success: false, error: "Failed to create user" }
    } catch (error: any) {
      console.error("Sign up error:", error)
      return { success: false, error: error?.message || "An unexpected error occurred" }
    }
  }

  static async signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (data.user) {
        await this.getCurrentUser() // Load user data
        this.dispatchUserChange()
        return { success: true }
      }

      return { success: false, error: "Failed to sign in" }
    } catch (error: any) {
      console.error("Sign in error:", error)
      return { success: false, error: error?.message || "An unexpected error occurred" }
    }
  }

  static async signOut(): Promise<void> {
    try {
      await supabase.auth.signOut()
      this.currentUser = null
      this.dispatchUserChange()
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  static async updateUser(updates: Partial<JunoUser>): Promise<boolean> {
    try {
      const user = await this.getCurrentUser()
      if (!user) return false

      const { error } = await supabase
        .from("users")
        .update({
          name: updates.name,
          preferences: updates.preferences,
        })
        .eq("id", user.id)

      if (error) {
        console.error("Error updating user:", error)
        return false
      }

      // Update local cache
      if (this.currentUser) {
        this.currentUser = { ...this.currentUser, ...updates }
      }

      this.dispatchUserChange()
      return true
    } catch (error) {
      console.error("Update user error:", error)
      return false
    }
  }

  // Chat conversation methods
  static async saveConversation(messages: ChatMessage[], title?: string): Promise<string | null> {
    try {
      const user = await this.getCurrentUser()
      if (!user) return null

      const conversationTitle = title || this.generateConversationTitle(messages)

      const { data, error } = await supabase
        .from("conversations")
        .insert({
          user_id: user.id,
          title: conversationTitle,
          messages,
        })
        .select()
        .single()

      if (error) {
        console.error("Error saving conversation:", error)
        return null
      }

      return data?.id || null
    } catch (error) {
      console.error("Save conversation error:", error)
      return null
    }
  }

  static async updateConversation(conversationId: string, messages: ChatMessage[]): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("conversations")
        .update({
          messages,
          updated_at: new Date().toISOString(),
        })
        .eq("id", conversationId)

      if (error) {
        console.error("Error updating conversation:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Update conversation error:", error)
      return false
    }
  }

  static async getConversations(): Promise<Conversation[]> {
    try {
      const user = await this.getCurrentUser()
      if (!user) return []

      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })

      if (error) {
        console.error("Error getting conversations:", error)
        return []
      }

      return (data || []).map((conv) => ({
        id: conv.id,
        userId: conv.user_id,
        title: conv.title,
        messages: Array.isArray(conv.messages) ? conv.messages : [],
        createdAt: conv.created_at,
        updatedAt: conv.updated_at,
      }))
    } catch (error) {
      console.error("Get conversations error:", error)
      return []
    }
  }

  static async deleteConversation(conversationId: string): Promise<boolean> {
    try {
      const { error } = await supabase.from("conversations").delete().eq("id", conversationId)

      if (error) {
        console.error("Error deleting conversation:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Delete conversation error:", error)
      return false
    }
  }

  private static generateConversationTitle(messages: ChatMessage[]): string {
    const firstUserMessage = messages.find((m) => m.role === "user")
    if (firstUserMessage && firstUserMessage.content) {
      const title = firstUserMessage.content.slice(0, 50)
      return title.length < firstUserMessage.content.length ? `${title}...` : title
    }
    return `Conversation ${new Date().toLocaleDateString()}`
  }

  private static dispatchUserChange(): void {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("userChanged"))
    }
  }

  // Initialize auth state listener
  static initializeAuthListener(): void {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        await this.getCurrentUser()
      } else if (event === "SIGNED_OUT") {
        this.currentUser = null
      }
      this.dispatchUserChange()
    })
  }
}
