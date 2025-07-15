"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Loader2, Database } from "lucide-react"
import { BlobStorageService } from "@/lib/blob-storage"

interface DataExportProps {
  darkMode: boolean
}

export function DataExport({ darkMode }: DataExportProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportUrl, setExportUrl] = useState<string | null>(null)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const userId = `user-${Date.now()}` // In a real app, this would be the actual user ID
      const url = await BlobStorageService.exportUserData(userId)
      setExportUrl(url)
    } catch (error) {
      console.error("Export failed:", error)
      alert("Failed to export data. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  const handleDownload = () => {
    if (exportUrl) {
      window.open(exportUrl, "_blank")
    }
  }

  return (
    <Card
      className={`p-4 ${
        darkMode ? "bg-white/5 border-white/10 backdrop-blur-lg" : "bg-white/70 border-white/20 backdrop-blur-lg"
      }`}
    >
      <CardHeader className="p-0 pb-3">
        <CardTitle
          className={`flex items-center space-x-2 text-sm font-semibold ${darkMode ? "text-white" : "text-slate-800"}`}
        >
          <Database className="w-5 h-5" />
          <span>Data Export</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 space-y-3">
        <p className={`text-xs ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
          Export your mood data, custom audio files, and preferences to keep your progress safe.
        </p>

        <div className="space-y-2">
          <Button
            onClick={handleExport}
            disabled={isExporting}
            className={`w-full text-white ${
              darkMode ? "bg-indigo-600 hover:bg-indigo-700" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
            size="sm"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Database className="w-4 h-4 mr-2" />
                Export Data
              </>
            )}
          </Button>

          {exportUrl && (
            <Button
              onClick={handleDownload}
              variant="outline"
              className={`w-full ${
                darkMode
                  ? "border-white/20 text-white hover:bg-indigo-500/10 hover:text-indigo-400 hover:border-indigo-400/50"
                  : "border-slate-200 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300"
              }`}
              size="sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Export
            </Button>
          )}
        </div>

        <div className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"} space-y-1`}>
          <p>• Mood tracking history</p>
          <p>• Custom audio files</p>
          <p>• Daily affirmations & quotes</p>
          <p>• App preferences</p>
        </div>
      </CardContent>
    </Card>
  )
}
