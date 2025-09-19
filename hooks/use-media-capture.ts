"use client"

import { useState, useRef, useCallback } from "react"

export interface MediaCaptureHook {
  isRecording: boolean
  recordedVideoUrl: string | null
  capturedImageUrl: string | null
  startVideoRecording: () => Promise<void>
  stopVideoRecording: () => void
  capturePhoto: () => Promise<void>
  clearMedia: () => void
  error: string | null
}

export function useMediaCapture(): MediaCaptureHook {
  const [isRecording, setIsRecording] = useState(false)
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null)
  const [capturedImageUrl, setCapturedImageUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const startVideoRecording = useCallback(async () => {
    try {
      setError(null)

      // Get user media with video and audio
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "environment", // Use back camera on mobile
        },
        audio: true,
      })

      streamRef.current = stream
      chunksRef.current = []

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp9", // Use VP9 codec for better compression
      })

      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" })
        const url = URL.createObjectURL(blob)
        setRecordedVideoUrl(url)

        // Clean up stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop())
          streamRef.current = null
        }
      }

      mediaRecorder.start(1000) // Collect data every second
      setIsRecording(true)
    } catch (err) {
      console.error("Error starting video recording:", err)
      setError("Unable to access camera and microphone. Please check permissions.")
    }
  }, [])

  const stopVideoRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }, [isRecording])

  const capturePhoto = useCallback(async () => {
    try {
      setError(null)

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "environment",
        },
      })

      // Create video element to capture frame
      const video = document.createElement("video")
      video.srcObject = stream
      video.play()

      video.onloadedmetadata = () => {
        // Create canvas to capture frame
        const canvas = document.createElement("canvas")
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        const ctx = canvas.getContext("2d")
        if (ctx) {
          ctx.drawImage(video, 0, 0)

          // Convert to blob and create URL
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob)
                setCapturedImageUrl(url)
              }
            },
            "image/jpeg",
            0.9,
          )
        }

        // Clean up
        stream.getTracks().forEach((track) => track.stop())
      }
    } catch (err) {
      console.error("Error capturing photo:", err)
      setError("Unable to access camera. Please check permissions.")
    }
  }, [])

  const clearMedia = useCallback(() => {
    if (recordedVideoUrl) {
      URL.revokeObjectURL(recordedVideoUrl)
      setRecordedVideoUrl(null)
    }
    if (capturedImageUrl) {
      URL.revokeObjectURL(capturedImageUrl)
      setCapturedImageUrl(null)
    }
    setError(null)
  }, [recordedVideoUrl, capturedImageUrl])

  return {
    isRecording,
    recordedVideoUrl,
    capturedImageUrl,
    startVideoRecording,
    stopVideoRecording,
    capturePhoto,
    clearMedia,
    error,
  }
}
