"use client"

import { useState } from "react"
import { useMediaCapture } from "@/hooks/use-media-capture"
import { useGeolocation } from "@/hooks/use-geolocation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, Video, MapPin, X, Square } from "lucide-react"

interface MediaCaptureModalProps {
  isOpen: boolean
  onClose: () => void
  onMediaCaptured: (media: { images?: File[]; videos?: File[]; audioNotes?: File[] }) => void
}

export function MediaCaptureModal({ isOpen, onClose, onMediaCaptured }: MediaCaptureModalProps) {
  const {
    isRecording,
    recordedVideoUrl,
    capturedImageUrl,
    startVideoRecording,
    stopVideoRecording,
    capturePhoto,
    clearMedia,
    error: mediaError,
  } = useMediaCapture()

  const { location, loading: locationLoading, error: locationError, getCurrentLocation } = useGeolocation()

  const [capturedFiles, setCapturedFiles] = useState<{ images: File[]; videos: File[] }>({
    images: [],
    videos: [],
  })

  if (!isOpen) return null

  const handleSaveMedia = async () => {
    const files = { images: [...capturedFiles.images], videos: [...capturedFiles.videos] }

    // Convert captured media to files
    if (capturedImageUrl) {
      const response = await fetch(capturedImageUrl)
      const blob = await response.blob()
      const imageFile = new File([blob], `captured-image-${Date.now()}.jpg`, { type: "image/jpeg" })
      files.images.push(imageFile)
    }

    if (recordedVideoUrl) {
      const response = await fetch(recordedVideoUrl)
      const blob = await response.blob()
      const videoFile = new File([blob], `recorded-video-${Date.now()}.webm`, { type: "video/webm" })
      files.videos.push(videoFile)
    }

    onMediaCaptured(files)
    handleClose()
  }

  const handleClose = () => {
    clearMedia()
    setCapturedFiles({ images: [], videos: [] })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Capture Media & Location</CardTitle>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Location Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Location
              </h3>
              <Button variant="outline" size="sm" onClick={getCurrentLocation} disabled={locationLoading}>
                {locationLoading ? "Getting Location..." : "Get Current Location"}
              </Button>
            </div>

            {location && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium">Current Location:</p>
                <p className="text-sm text-muted-foreground">{location.address}</p>
                <p className="text-xs text-muted-foreground">Accuracy: {location.accuracy.toFixed(0)}m</p>
              </div>
            )}

            {locationError && (
              <Alert variant="destructive">
                <AlertDescription>{locationError}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Media Capture Section */}
          <div className="space-y-4">
            <h3 className="font-semibold">Capture Media</h3>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={capturePhoto}
                className="h-20 flex-col bg-transparent"
                disabled={isRecording}
              >
                <Camera className="w-6 h-6 mb-2" />
                Take Photo
              </Button>

              <Button
                variant="outline"
                onClick={isRecording ? stopVideoRecording : startVideoRecording}
                className={`h-20 flex-col ${isRecording ? "bg-red-50 border-red-200" : ""}`}
              >
                {isRecording ? (
                  <>
                    <Square className="w-6 h-6 mb-2 text-red-600" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Video className="w-6 h-6 mb-2" />
                    Record Video
                  </>
                )}
              </Button>
            </div>

            {isRecording && (
              <div className="flex items-center justify-center p-4 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
                  <span className="text-red-600 font-medium">Recording in progress...</span>
                </div>
              </div>
            )}
          </div>

          {/* Preview Section */}
          {(capturedImageUrl || recordedVideoUrl) && (
            <div className="space-y-3">
              <h3 className="font-semibold">Preview</h3>

              {capturedImageUrl && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Captured Photo:</p>
                  <img
                    src={capturedImageUrl || "/placeholder.svg"}
                    alt="Captured"
                    className="w-full max-w-sm rounded-lg border"
                  />
                </div>
              )}

              {recordedVideoUrl && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Recorded Video:</p>
                  <video src={recordedVideoUrl} controls className="w-full max-w-sm rounded-lg border" />
                </div>
              )}
            </div>
          )}

          {mediaError && (
            <Alert variant="destructive">
              <AlertDescription>{mediaError}</AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleSaveMedia} disabled={!capturedImageUrl && !recordedVideoUrl} className="flex-1">
              Save Media & Location
            </Button>
            <Button variant="outline" onClick={clearMedia}>
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default MediaCaptureModal
