"use client"

import { useState, useEffect } from "react"
import { useSpeechRecognition } from "@/hooks/use-speech-recognition"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, X, Copy, Check } from "lucide-react"

interface VoiceInputModalProps {
  isOpen: boolean
  onClose: () => void
  onTextReceived: (text: string) => void
  fieldName: string
}

export function VoiceInputModal({ isOpen, onClose, onTextReceived, fieldName }: VoiceInputModalProps) {
  const {
    isListening,
    transcript,
    translatedText,
    confidence,
    language,
    startListening,
    stopListening,
    clearTranscript,
    error,
    isSupported,
  } = useSpeechRecognition()

  const [selectedLanguage, setSelectedLanguage] = useState("english")
  const [copied, setCopied] = useState(false)

  const languages = [
    { code: "english", name: "English", flag: "🇺🇸" },
    { code: "tamil", name: "Tamil", flag: "🇮🇳" },
    { code: "hindi", name: "Hindi", flag: "🇮🇳" },
    { code: "sanskrit", name: "Sanskrit", flag: "🇮🇳" },
  ]

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [copied])

  if (!isOpen) return null

  const handleStartListening = () => {
    clearTranscript()
    startListening(selectedLanguage)
  }

  const handleStopListening = () => {
    stopListening()
  }

  const handleCopyText = () => {
    navigator.clipboard.writeText(transcript)
    setCopied(true)
  }

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language)
  }

  const handleCaptureText = () => {
    const textToUse = translatedText || transcript
    onTextReceived(textToUse)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="w-[90vw] max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Voice Input for {fieldName}</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isSupported ? (
            <Alert variant="destructive">
              <AlertDescription>Speech recognition is not supported in your browser.</AlertDescription>
            </Alert>
          ) : (
            <>
              {/* Language Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Language:</label>
                <div className="flex flex-wrap gap-2">
                  {languages.map((lang) => (
                    <Button
                      key={lang.code}
                      variant={selectedLanguage === lang.code ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleLanguageChange(lang.code)}
                    >
                      {lang.flag} {lang.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Recording Controls */}
              <div className="flex justify-center">
                <Button
                  onClick={isListening ? handleStopListening : handleStartListening}
                  size="lg"
                  className={isListening ? "bg-red-500 hover:bg-red-600" : ""}
                >
                  {isListening ? <MicOff className="h-5 w-5 mr-2" /> : <Mic className="h-5 w-5 mr-2" />}
                  {isListening ? "Stop Recording" : "Start Recording"}
                </Button>
              </div>

              {/* Status Indicators */}
              {isListening && (
                <div className="text-center">
                  <div className="inline-flex items-center space-x-2 text-red-500">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm">Listening...</span>
                  </div>
                </div>
              )}

              {/* Transcript Display */}
              {transcript && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">Original ({language})</Badge>
                    {confidence && <Badge variant="outline">Confidence: {Math.round(confidence * 100)}%</Badge>}
                  </div>
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm">{transcript}</p>
                  </div>
                </div>
              )}

              {/* Translated Text */}
              {translatedText && translatedText !== transcript && (
                <div className="space-y-2">
                  <Badge variant="secondary">Translated to English</Badge>
                  <div className="p-3 bg-primary/10 rounded-md">
                    <p className="text-sm">{translatedText}</p>
                  </div>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Action Buttons */}
              {transcript && (
                <div className="flex justify-center space-x-2">
                  <Button variant="outline" onClick={handleCopyText}>
                    {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    {copied ? "Copied!" : "Copy Text"}
                  </Button>
                  <Button onClick={handleCaptureText}>Use This Text</Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default VoiceInputModal
