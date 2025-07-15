"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, Pause, Volume2, VolumeX, Music, Trash2, Plus } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { BlobStorageService, type AudioFile } from "@/lib/blob-storage"
import { AudioUpload } from "./audio-upload"

const DEFAULT_TRACKS: AudioFile[] = [
  {
    name: "Focus Flow",
    description: "40Hz Gamma waves for concentration",
    frequency: "40Hz",
    url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
    uploadedAt: new Date(),
  },
  {
    name: "Calm Mind",
    description: "10Hz Alpha waves for relaxation",
    frequency: "10Hz",
    url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
    uploadedAt: new Date(),
  },
  {
    name: "Deep Rest",
    description: "4Hz Theta waves for meditation",
    frequency: "4Hz",
    url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
    uploadedAt: new Date(),
  },
]

interface EnhancedBinauralPlayerProps {
  darkMode: boolean
}

export function EnhancedBinauralPlayer({ darkMode }: EnhancedBinauralPlayerProps) {
  const [tracks, setTracks] = useState<AudioFile[]>(DEFAULT_TRACKS)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState([50])
  const [isMuted, setIsMuted] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Load custom tracks from blob storage
  useEffect(() => {
    const customTracks = BlobStorageService.getStoredAudioFiles()
    if (customTracks.length > 0) {
      setTracks([...DEFAULT_TRACKS, ...customTracks])
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume[0] / 100
    }
  }, [volume, isMuted])

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch(console.error)
      }
    }
  }

  const handleTrackChange = (trackIndex: number) => {
    const wasPlaying = isPlaying
    if (audioRef.current && isPlaying) {
      audioRef.current.pause()
    }
    setCurrentTrack(trackIndex)
    if (wasPlaying) {
      setTimeout(() => {
        audioRef.current?.play().catch(console.error)
      }, 100)
    }
  }

  const handleDeleteTrack = async (trackIndex: number) => {
    const track = tracks[trackIndex]

    // Don't delete default tracks
    if (DEFAULT_TRACKS.some((defaultTrack) => defaultTrack.name === track.name)) {
      return
    }

    try {
      await BlobStorageService.deleteAudio(track.url)
      const newTracks = tracks.filter((_, index) => index !== trackIndex)
      setTracks(newTracks)

      // Adjust current track if necessary
      if (currentTrack >= trackIndex) {
        setCurrentTrack(Math.max(0, currentTrack - 1))
      }
    } catch (error) {
      console.error("Failed to delete track:", error)
    }
  }

  const handleUploadComplete = (audioFile: AudioFile) => {
    setTracks([...tracks, audioFile])
    setShowUpload(false)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const getTrackColor = (index: number) => {
    const colors = [
      "from-blue-500 to-cyan-500",
      "from-green-500 to-emerald-500",
      "from-purple-500 to-pink-500",
      "from-orange-500 to-red-500",
      "from-indigo-500 to-purple-500",
    ]
    return colors[index % colors.length]
  }

  if (showUpload) {
    return <AudioUpload onUploadComplete={handleUploadComplete} darkMode={darkMode} />
  }

  return (
    <Card
      className={`p-4 ${
        darkMode ? "bg-white/5 border-white/10 backdrop-blur-lg" : "bg-white/70 border-white/20 backdrop-blur-lg"
      } hover:scale-105 transition-transform duration-200`}
    >
      <CardHeader className="p-0 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Music className={`w-5 h-5 ${darkMode ? "text-indigo-400" : "text-indigo-600"}`} />
            <CardTitle className={`text-sm font-semibold ${darkMode ? "text-white" : "text-slate-800"}`}>
              Mindful Sounds
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowUpload(true)}
            className={`${darkMode ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-800"}`}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0 space-y-4">
        {/* Track Selection */}
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {tracks.map((track, index) => (
            <div
              key={index}
              className={`group relative p-3 rounded-lg text-left transition-all duration-200 ${
                currentTrack === index
                  ? `bg-gradient-to-r ${getTrackColor(index)} text-white shadow-lg`
                  : darkMode
                    ? "bg-white/5 hover:bg-white/10 text-slate-300"
                    : "bg-white/50 hover:bg-white/70 text-slate-700"
              }`}
            >
              <button onClick={() => handleTrackChange(index)} className="w-full text-left">
                <div className="font-medium text-sm">{track.name}</div>
                <div className="text-xs opacity-80">{track.description}</div>
              </button>

              {/* Delete button for custom tracks */}
              {!DEFAULT_TRACKS.some((defaultTrack) => defaultTrack.name === track.name) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteTrack(index)
                  }}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={togglePlayback}
              className={`${
                darkMode
                  ? "border-white/20 text-white hover:bg-white/10"
                  : "border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-indigo-500" />}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={toggleMute}
              className={`${
                darkMode
                  ? "border-white/20 text-white hover:bg-white/10"
                  : "border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-indigo-500" />}
            </Button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-2 flex-1 max-w-24 ml-4">
            <Slider value={volume} onValueChange={setVolume} max={100} step={1} className="flex-1" disabled={isMuted} />
          </div>
        </div>

        {/* Current Track Info */}
        <div className={`text-center p-2 rounded-lg ${darkMode ? "bg-white/5" : "bg-slate-100/50"}`}>
          <div className={`text-sm font-medium ${darkMode ? "text-white" : "text-slate-800"}`}>
            {tracks[currentTrack]?.name || "No track selected"}
          </div>
          <div className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
            {tracks[currentTrack]?.frequency} • {isPlaying ? "Playing" : "Paused"}
          </div>
        </div>
      </CardContent>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        loop
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onError={(e) => {
          console.error("Audio playback error:", e)
          setIsPlaying(false)
        }}
      >
        <source src={tracks[currentTrack]?.url} type="audio/mpeg" />
      </audio>
    </Card>
  )
}
