"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Music, Loader2 } from "lucide-react"
import { BlobStorageService, type AudioFile } from "@/lib/blob-storage"

interface AudioUploadProps {
  onUploadComplete: (audioFile: AudioFile) => void
  darkMode: boolean
}

export function AudioUpload({ onUploadComplete, darkMode }: AudioUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    frequency: "",
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    try {
      const files = Array.from(e.dataTransfer?.files || [])
      const audioFile = files.find((file) => {
        return (
          file &&
          typeof file === "object" &&
          "type" in file &&
          typeof file.type === "string" &&
          file.type.startsWith("audio/")
        )
      })

      if (!audioFile) {
        alert("Please drop a valid audio file (mp3, wav, ogg).")
        return
      }

      handleFileUpload(audioFile)
    } catch (error) {
      console.error("Error handling file drop:", error)
      alert("Error processing dropped file. Please try again.")
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target?.files?.[0]
      if (file && typeof file.type === "string") {
        handleFileUpload(file)
      }
    } catch (error) {
      console.error("Error handling file selection:", error)
      alert("Error processing selected file. Please try again.")
    }
  }

  const handleFileUpload = async (file: File) => {
    if (!formData.name.trim() || !formData.description.trim() || !formData.frequency.trim()) {
      alert("Please fill in all fields before uploading")
      return
    }

    if (!file.type.startsWith("audio/")) {
      alert("Unsupported file type. Please choose an audio file (mp3, wav, ogg).")
      return
    }

    setIsUploading(true)
    try {
      const audioFile = await BlobStorageService.uploadAudio(file, formData)
      onUploadComplete(audioFile)

      // Reset form
      setFormData({ name: "", description: "", frequency: "" })
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      console.error("Upload failed:", error)
      alert("Failed to upload audio file. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card
      className={`${
        darkMode ? "bg-white/5 border-white/10 backdrop-blur-lg" : "bg-white/70 border-white/20 backdrop-blur-lg"
      }`}
    >
      <CardHeader>
        <CardTitle className={`flex items-center space-x-2 ${darkMode ? "text-white" : "text-slate-800"}`}>
          <Music className="w-5 h-5" />
          <span>Upload Custom Audio</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="name" className={darkMode ? "text-slate-300" : "text-slate-700"}>
              Track Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Deep Focus"
              className={
                darkMode
                  ? "bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                  : "bg-white/50 border-slate-200"
              }
            />
          </div>

          <div>
            <Label htmlFor="description" className={darkMode ? "text-slate-300" : "text-slate-700"}>
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g., Binaural beats for concentration"
              className={
                darkMode
                  ? "bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                  : "bg-white/50 border-slate-200"
              }
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="frequency" className={darkMode ? "text-slate-300" : "text-slate-700"}>
              Frequency
            </Label>
            <Input
              id="frequency"
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
              placeholder="e.g., 40Hz"
              className={
                darkMode
                  ? "bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                  : "bg-white/50 border-slate-200"
              }
            />
          </div>
        </div>

        {/* File Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive
              ? "border-indigo-500 bg-indigo-500/10"
              : darkMode
                ? "border-white/20 hover:border-white/30"
                : "border-slate-300 hover:border-slate-400"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input ref={fileInputRef} type="file" accept="audio/*" onChange={handleFileSelect} className="hidden" />

          <div className="space-y-2">
            <Upload className={`w-8 h-8 mx-auto ${darkMode ? "text-slate-400" : "text-slate-500"}`} />
            <p className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
              Drag and drop an audio file here, or{" "}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-indigo-500 hover:text-indigo-600 underline"
              >
                browse
              </button>
            </p>
            <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Supports MP3, WAV, OGG files</p>
          </div>
        </div>

        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading || !formData.name.trim() || !formData.description.trim() || !formData.frequency.trim()}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload Audio File
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
