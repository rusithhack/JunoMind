"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, Pause, Volume2, VolumeX, Music } from "lucide-react"
import { Slider } from "@/components/ui/slider"

const BINAURAL_TRACKS = [
  {
    name: "Focus Flow",
    description: "40Hz Gamma waves for concentration",
    frequency: "40Hz",
    color: "from-blue-500 to-cyan-500",
    // Using a placeholder URL - in production, you'd host actual binaural beat files
    url: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT",
  },
  {
    name: "Calm Mind",
    description: "10Hz Alpha waves for relaxation",
    frequency: "10Hz",
    color: "from-green-500 to-emerald-500",
    url: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT",
  },
  {
    name: "Deep Rest",
    description: "4Hz Theta waves for meditation",
    frequency: "4Hz",
    color: "from-purple-500 to-pink-500",
    url: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT",
  },
]

interface BinauralAudioPlayerProps {
  darkMode: boolean
}

export function BinauralAudioPlayer({ darkMode }: BinauralAudioPlayerProps) {
  const [currentTrack, setCurrentTrack] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState([50])
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

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
        audioRef.current.play()
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
        audioRef.current?.play()
      }, 100)
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  return (
    <Card
      className={`p-4 ${
        darkMode ? "bg-white/5 border-white/10 backdrop-blur-lg" : "bg-white/70 border-white/20 backdrop-blur-lg"
      } hover:scale-105 transition-transform duration-200`}
    >
      <CardHeader className="p-0 pb-3">
        <div className="flex items-center space-x-2">
          <Music className={`w-5 h-5 ${darkMode ? "text-indigo-400" : "text-indigo-600"}`} />
          <CardTitle className={`text-sm font-semibold ${darkMode ? "text-white" : "text-slate-800"}`}>
            Mindful Sounds
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="p-0 space-y-4">
        {/* Track Selection */}
        <div className="space-y-2">
          {BINAURAL_TRACKS.map((track, index) => (
            <button
              key={index}
              onClick={() => handleTrackChange(index)}
              className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${
                currentTrack === index
                  ? `bg-gradient-to-r ${track.color} text-white shadow-lg`
                  : darkMode
                    ? "bg-white/5 hover:bg-white/10 text-slate-300"
                    : "bg-white/50 hover:bg-white/70 text-slate-700"
              }`}
            >
              <div className="font-medium text-sm">{track.name}</div>
              <div className="text-xs opacity-80">{track.description}</div>
            </button>
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
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
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
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
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
            {BINAURAL_TRACKS[currentTrack].name}
          </div>
          <div className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
            {BINAURAL_TRACKS[currentTrack].frequency} • {isPlaying ? "Playing" : "Paused"}
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
      >
        <source src={BINAURAL_TRACKS[currentTrack].url} type="audio/wav" />
      </audio>
    </Card>
  )
}
