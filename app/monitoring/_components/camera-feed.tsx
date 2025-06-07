"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

// @ts-ignore
import Hls from "hls.js"

interface CameraFeedProps {
  name: string
  location?: string | null
  streamUrl: string
  isActive?: boolean
}

export function CameraFeed({ name, location, streamUrl, isActive = true }: CameraFeedProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<Hls | null>(null)

  useEffect(() => {
    setIsLoading(true)
    setError(null)
    const video = videoRef.current
    if (!video) return

    // Clean up previous hls.js instance
    if (hlsRef.current) {
      hlsRef.current.destroy()
      hlsRef.current = null
    }

    // Check for native HLS support
    const canPlayNative = video.canPlayType('application/vnd.apple.mpegurl') !== ''
    if (canPlayNative) {
      video.src = streamUrl
      video.load()
    } else if (Hls.isSupported()) {
      const hls = new Hls()
      hlsRef.current = hls
      hls.loadSource(streamUrl)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false)
        setError(null)
        video.play().catch(() => {})
      })
      hls.on(Hls.Events.ERROR, (event, data) => {
        setIsLoading(false)
        setError("Failed to load camera feed (HLS.js error)")
      })
    } else {
      setIsLoading(false)
      setError("Stream format not supported on this browser")
    }

    const handleCanPlay = () => {
      setIsLoading(false)
      setError(null)
    }
    const handleError = (e: Event) => {
      setIsLoading(false)
      const videoError = (e.target as HTMLVideoElement).error
      let errorMessage = "Failed to load camera feed"
      if (videoError) {
        switch (videoError.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            errorMessage = "Playback aborted"
            break
          case MediaError.MEDIA_ERR_NETWORK:
            errorMessage = "Network error - check your connection"
            break
          case MediaError.MEDIA_ERR_DECODE:
            errorMessage = "Stream decoding error"
            break
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage = "Stream format not supported"
            break
        }
      }
      setError(errorMessage)
    }
    video.addEventListener("canplay", handleCanPlay)
    video.addEventListener("error", handleError)
    return () => {
      video.removeEventListener("canplay", handleCanPlay)
      video.removeEventListener("error", handleError)
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }
    }
  }, [streamUrl, retryCount])

  const handleRetry = () => {
    setError(null)
    setIsLoading(true)
    setRetryCount(prev => prev + 1)
  }

  return (
    <Card className="relative overflow-hidden aspect-video">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <Skeleton className="w-full h-full" />
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/80 text-destructive">
          <AlertCircle className="w-8 h-8 mb-2" />
          <span className="text-sm font-medium mb-2">{error}</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRetry}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </Button>
        </div>
      )}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        muted
        playsInline
        controls={false}
      />
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isActive ? "bg-green-500" : "bg-red-500"}`} />
          <div className="text-white text-sm font-medium">
            {name}
            {location && <span className="text-white/70 ml-1">({location})</span>}
          </div>
        </div>
      </div>
    </Card>
  )
} 