import { put, del, list } from "@vercel/blob"

export interface AudioFile {
  name: string
  description: string
  frequency: string
  url: string
  uploadedAt: Date
}

export interface UserSession {
  id: string
  mood: number
  affirmation: string
  timerSessions: number
  createdAt: Date
}

export class BlobStorageService {
  // Upload audio file to Vercel Blob
  static async uploadAudio(file: File, metadata: Omit<AudioFile, "url" | "uploadedAt">): Promise<AudioFile> {
    try {
      const blob = await put(`audio/${file.name}`, file, {
        access: "public",
        addRandomSuffix: true,
      })

      const audioFile: AudioFile = {
        ...metadata,
        url: blob.url,
        uploadedAt: new Date(),
      }

      // Store metadata in localStorage for now (can be moved to database later)
      const existingAudio = this.getStoredAudioFiles()
      existingAudio.push(audioFile)
      localStorage.setItem("juno-audio-files", JSON.stringify(existingAudio))

      return audioFile
    } catch (error) {
      console.error("Failed to upload audio file:", error)
      throw new Error("Failed to upload audio file")
    }
  }

  // Get stored audio files from localStorage
  static getStoredAudioFiles(): AudioFile[] {
    if (typeof window === "undefined") return []

    try {
      const stored = localStorage.getItem("juno-audio-files")
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  // Delete audio file from Vercel Blob
  static async deleteAudio(url: string): Promise<void> {
    try {
      await del(url)

      // Remove from localStorage
      const existingAudio = this.getStoredAudioFiles()
      const filtered = existingAudio.filter((audio) => audio.url !== url)
      localStorage.setItem("juno-audio-files", JSON.stringify(filtered))
    } catch (error) {
      console.error("Failed to delete audio file:", error)
      throw new Error("Failed to delete audio file")
    }
  }

  // Export user data by sending it to the server-side route that owns the Blob token
  static async exportUserData(userId: string): Promise<string> {
    if (typeof window === "undefined") {
      throw new Error("exportUserData should be called from the client")
    }

    // Build the data object on the client
    const today = new Date().toDateString()
    const userData = {
      userId,
      mood: localStorage.getItem(`juno-mood-${today}`),
      affirmation: localStorage.getItem(`juno-affirmation-${today}`),
      quote: localStorage.getItem(`juno-quote-${today}`),
      audioFiles: this.getStoredAudioFiles(),
      exportedAt: new Date().toISOString(),
    }

    // POST to the new API route
    const res = await fetch("/api/export-user-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })

    if (!res.ok) {
      const { error } = await res.json()
      throw new Error(error || "Failed to export data")
    }

    const { url } = await res.json()
    return url as string
  }

  // List all files in blob storage
  static async listFiles(prefix?: string) {
    try {
      const { blobs } = await list({ prefix })
      return blobs
    } catch (error) {
      console.error("Failed to list files:", error)
      return []
    }
  }
}
