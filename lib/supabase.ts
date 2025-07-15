import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          created_at: string
          preferences: {
            darkMode: boolean
            ttsEnabled: boolean
            notifications: boolean
          }
        }
        Insert: {
          id?: string
          email: string
          name: string
          created_at?: string
          preferences?: {
            darkMode: boolean
            ttsEnabled: boolean
            notifications: boolean
          }
        }
        Update: {
          id?: string
          email?: string
          name?: string
          created_at?: string
          preferences?: {
            darkMode: boolean
            ttsEnabled: boolean
            notifications: boolean
          }
        }
      }
      conversations: {
        Row: {
          id: string
          user_id: string
          title: string
          messages: Array<{
            id: string
            role: "user" | "assistant"
            content: string
            timestamp: string
          }>
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          messages: Array<{
            id: string
            role: "user" | "assistant"
            content: string
            timestamp: string
          }>
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          messages?: Array<{
            id: string
            role: "user" | "assistant"
            content: string
            timestamp: string
          }>
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
