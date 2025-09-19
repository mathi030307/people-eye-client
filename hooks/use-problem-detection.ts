"use client"
import { useState } from "react"

interface DetectionResult {
  category: string
  confidence: number
  description: string
}

export function useProblemDetection() {
  const [isDetecting, setIsDetecting] = useState(false)

  const detectProblemFromImage = async (imageFile: File): Promise<DetectionResult> => {
    setIsDetecting(true)

    try {
      // Simulate AI detection - in real app, this would call an AI service
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock detection based on image name or random selection
      const problems = [
        {
          category: "Road Issues",
          keywords: ["pothole", "crack", "road", "street"],
          description: "Road damage detected",
        },
        {
          category: "Street Lighting",
          keywords: ["light", "lamp", "dark"],
          description: "Street lighting issue identified",
        },
        {
          category: "Waste Management",
          keywords: ["trash", "garbage", "waste"],
          description: "Waste management problem found",
        },
        {
          category: "Water & Drainage",
          keywords: ["water", "drain", "flood"],
          description: "Water or drainage issue detected",
        },
        {
          category: "Public Safety",
          keywords: ["danger", "safety", "hazard"],
          description: "Public safety concern identified",
        },
        {
          category: "Parks & Recreation",
          keywords: ["park", "tree", "bench"],
          description: "Parks and recreation issue found",
        },
      ]

      const fileName = imageFile.name.toLowerCase()
      let detectedProblem = problems.find((p) => p.keywords.some((keyword) => fileName.includes(keyword)))

      if (!detectedProblem) {
        // Random selection if no keywords match
        detectedProblem = problems[Math.floor(Math.random() * problems.length)]
      }

      return {
        category: detectedProblem.category,
        confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
        description: detectedProblem.description,
      }
    } finally {
      setIsDetecting(false)
    }
  }

  return {
    detectProblemFromImage,
    isDetecting,
  }
}
