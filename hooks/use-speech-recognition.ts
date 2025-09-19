"use client"

import { useState, useRef, useCallback, useEffect } from "react"

export interface SpeechRecognitionHook {
  isListening: boolean
  transcript: string
  translatedText: string
  confidence: number
  language: string
  startListening: (language?: string) => void
  stopListening: () => void
  clearTranscript: () => void
  error: string | null
  isSupported: boolean
}

// Language mappings for speech recognition
const LANGUAGE_CODES = {
  tamil: "ta-IN",
  hindi: "hi-IN",
  sanskrit: "sa-IN",
  english: "en-US",
}

// Translation API simulation (in real app, this would call a translation service)
const translateText = async (text: string, fromLang: string): Promise<string> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Mock translation responses for demo
  const mockTranslations: Record<string, Record<string, string>> = {
    "ta-IN": {
      "சாலையில் குழி உள்ளது": "There is a pothole on the road",
      "தெரு விளக்கு வேலை செய்யவில்லை": "Street light is not working",
      "குப்பை சேகரிப்பு தாமதம்": "Garbage collection is delayed",
      "நீர் கசிவு உள்ளது": "There is a water leak",
    },
    "hi-IN": {
      "सड़क में गड्ढा है": "There is a pothole on the road",
      "स्ट्रीट लाइट काम नहीं कर रही": "Street light is not working",
      "कचरा संग्रह में देरी": "Garbage collection is delayed",
      "पानी का रिसाव है": "There is a water leak",
    },
    "sa-IN": {
      "मार्गे गर्तं अस्ति": "There is a pothole on the road",
      "पथप्रकाशः न कार्यति": "Street light is not working",
      "मलसंग्रहे विलम्बः": "Garbage collection is delayed",
      "जलस्रावः अस्ति": "There is a water leak",
    },
  }

  // Check for exact matches first
  if (mockTranslations[fromLang] && mockTranslations[fromLang][text]) {
    return mockTranslations[fromLang][text]
  }

  // Fallback: simple word-based translation for common civic terms
  const commonTerms: Record<string, string> = {
    // Tamil
    குழி: "pothole",
    சாலை: "road",
    விளக்கு: "light",
    குப்பை: "garbage",
    நீர்: "water",
    கசிவு: "leak",

    // Hindi
    गड्ढा: "pothole",
    सड़क: "road",
    लाइट: "light",
    कचरा: "garbage",
    पानी: "water",
    रिसाव: "leak",

    // Sanskrit
    गर्तं: "pothole",
    मार्गे: "road",
    प्रकाशः: "light",
    मलं: "garbage",
    जलं: "water",
    स्रावः: "leak",
  }

  // Simple word replacement
  let translated = text
  Object.entries(commonTerms).forEach(([original, english]) => {
    translated = translated.replace(new RegExp(original, "g"), english)
  })

  return translated !== text ? translated : `[Translated] ${text}`
}

export function useSpeechRecognition(): SpeechRecognitionHook {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [translatedText, setTranslatedText] = useState("")
  const [confidence, setConfidence] = useState(0)
  const [language, setLanguage] = useState("english")
  const [error, setError] = useState<string | null>(null)
  const [isSupported, setIsSupported] = useState(false)

  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    setIsSupported(!!SpeechRecognition)
  }, [])

  const startListening = useCallback(
    (selectedLanguage = "english") => {
      if (!isSupported) {
        setError("Speech recognition is not supported in this browser")
        return
      }

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

      if (!SpeechRecognition) {
        setError("Speech recognition is not available")
        return
      }

      try {
        const recognition = new SpeechRecognition()
        recognitionRef.current = recognition

        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = LANGUAGE_CODES[selectedLanguage as keyof typeof LANGUAGE_CODES] || LANGUAGE_CODES.english

        recognition.onstart = () => {
          setIsListening(true)
          setError(null)
          setLanguage(selectedLanguage)
        }

        recognition.onresult = async (event: any) => {
          let finalTranscript = ""
          let interimTranscript = ""

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i]
            if (result.isFinal) {
              finalTranscript += result[0].transcript
              setConfidence(result[0].confidence)
            } else {
              interimTranscript += result[0].transcript
            }
          }

          const fullTranscript = finalTranscript || interimTranscript
          setTranscript(fullTranscript)

          // Translate if not English and we have final results
          if (finalTranscript && selectedLanguage !== "english") {
            try {
              const translated = await translateText(
                finalTranscript,
                LANGUAGE_CODES[selectedLanguage as keyof typeof LANGUAGE_CODES],
              )
              setTranslatedText(translated)
            } catch (err) {
              console.error("Translation error:", err)
              setTranslatedText(`[Translation failed] ${finalTranscript}`)
            }
          } else if (selectedLanguage === "english") {
            setTranslatedText(fullTranscript)
          }
        }

        recognition.onerror = (event: any) => {
          setError(`Speech recognition error: ${event.error}`)
          setIsListening(false)
        }

        recognition.onend = () => {
          setIsListening(false)
        }

        recognition.start()
      } catch (err) {
        setError("Failed to start speech recognition")
        setIsListening(false)
      }
    },
    [isSupported],
  )

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsListening(false)
  }, [])

  const clearTranscript = useCallback(() => {
    setTranscript("")
    setTranslatedText("")
    setConfidence(0)
    setError(null)
  }, [])

  return {
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
  }
}
