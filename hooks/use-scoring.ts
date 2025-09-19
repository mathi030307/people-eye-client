"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useReports } from "@/hooks/use-reports"
import type { UserScore, Badge, LeaderboardEntry } from "@/types/user-score"

const BADGES = {
  FIRST_REPORT: {
    id: "first_report",
    name: "First Reporter",
    description: "Submitted your first civic issue report",
    icon: "🎯",
  },
  FIVE_REPORTS: {
    id: "five_reports",
    name: "Active Citizen",
    description: "Submitted 5 civic issue reports",
    icon: "🏆",
  },
  TEN_REPORTS: {
    id: "ten_reports",
    name: "Community Champion",
    description: "Submitted 10 civic issue reports",
    icon: "⭐",
  },
  PHOTO_REPORTER: {
    id: "photo_reporter",
    name: "Visual Reporter",
    description: "Submitted 5 reports with photos",
    icon: "📸",
  },
  VIDEO_REPORTER: {
    id: "video_reporter",
    name: "Video Journalist",
    description: "Submitted 3 reports with videos",
    icon: "🎥",
  },
}

export function useScoring() {
  const { user } = useAuth()
  const { reports, getUserReports } = useReports()
  const [userScore, setUserScore] = useState<UserScore | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])

  const calculateUserScore = (userId: string): UserScore => {
    const userReports = reports.filter((report) => report.userId === userId)
    const resolvedReports = userReports.filter((report) => report.status === "Resolved").length
    const totalReports = userReports.length

    // Calculate impact points
    let impactPoints = totalReports * 10 // Base points per report
    impactPoints += resolvedReports * 25 // Bonus for resolved reports
    impactPoints += userReports.filter((r) => r.images?.length > 0).length * 5 // Photo bonus
    impactPoints += userReports.filter((r) => r.videos?.length > 0).length * 10 // Video bonus
    impactPoints += userReports.filter((r) => r.audioNotes?.length > 0).length * 5 // Audio bonus

    // Calculate level (every 100 points = 1 level)
    const level = Math.floor(impactPoints / 100) + 1

    // Calculate badges
    const badges: Badge[] = []
    const now = new Date().toISOString()

    if (totalReports >= 1) {
      badges.push({ ...BADGES.FIRST_REPORT, earnedAt: now })
    }
    if (totalReports >= 5) {
      badges.push({ ...BADGES.FIVE_REPORTS, earnedAt: now })
    }
    if (totalReports >= 10) {
      badges.push({ ...BADGES.TEN_REPORTS, earnedAt: now })
    }
    if (userReports.filter((r) => r.images?.length > 0).length >= 5) {
      badges.push({ ...BADGES.PHOTO_REPORTER, earnedAt: now })
    }
    if (userReports.filter((r) => r.videos?.length > 0).length >= 3) {
      badges.push({ ...BADGES.VIDEO_REPORTER, earnedAt: now })
    }

    const userName = getUserName(userId)

    return {
      userId,
      userName,
      totalReports,
      resolvedReports,
      impactPoints,
      level,
      badges,
      rank: 0, // Will be calculated in leaderboard
    }
  }

  const getUserName = (userId: string): string => {
    const savedUsers = JSON.parse(localStorage.getItem("civicUsers") || "[]")
    const foundUser = savedUsers.find((u: any) => u.id === userId)
    return foundUser?.fullName || "Unknown User"
  }

  const calculateLeaderboard = (): LeaderboardEntry[] => {
    // Get all unique user IDs from reports
    const userIds = [...new Set(reports.map((report) => report.userId))]

    // Calculate scores for all users
    const scores = userIds.map((userId) => calculateUserScore(userId))

    // Sort by impact points and assign ranks
    const sortedScores = scores.sort((a, b) => b.impactPoints - a.impactPoints)

    return sortedScores.map((score, index) => ({
      userId: score.userId,
      userName: score.userName,
      impactPoints: score.impactPoints,
      level: score.level,
      rank: index + 1,
      badges: score.badges,
    }))
  }

  useEffect(() => {
    if (user) {
      const score = calculateUserScore(user.id)
      const leaderboardData = calculateLeaderboard()

      // Update user's rank from leaderboard
      const userRank = leaderboardData.find((entry) => entry.userId === user.id)?.rank || 0
      score.rank = userRank

      setUserScore(score)
      setLeaderboard(leaderboardData)
    }
  }, [user, reports])

  return {
    userScore,
    leaderboard,
    calculateUserScore,
    calculateLeaderboard,
  }
}
