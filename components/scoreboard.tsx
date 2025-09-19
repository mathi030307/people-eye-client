"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award, Star, Camera, Video } from "lucide-react"
import { useScoring } from "@/hooks/use-scoring"
import { useAuth } from "@/contexts/auth-context"

export function Scoreboard() {
  const { userScore, leaderboard } = useScoring()
  const { user } = useAuth()

  if (!user || !userScore) {
    return null
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />
      default:
        return <Star className="h-6 w-6 text-emerald-600" />
    }
  }

  const getBadgeIcon = (badgeId: string) => {
    switch (badgeId) {
      case "photo_reporter":
        return <Camera className="h-4 w-4" />
      case "video_reporter":
        return <Video className="h-4 w-4" />
      default:
        return <Star className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* User Score Card */}
      <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-800">
            {getRankIcon(userScore.rank)}
            Your Civic Impact Score
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-700">{userScore.impactPoints}</div>
              <div className="text-sm text-emerald-600">Impact Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-700">{userScore.level}</div>
              <div className="text-sm text-emerald-600">Level</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-700">#{userScore.rank}</div>
              <div className="text-sm text-emerald-600">Rank</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-700">{userScore.totalReports}</div>
              <div className="text-sm text-emerald-600">Reports</div>
            </div>
          </div>

          {/* Badges */}
          {userScore.badges.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-emerald-800">Badges Earned</h4>
              <div className="flex flex-wrap gap-2">
                {userScore.badges.map((badge) => (
                  <Badge key={badge.id} variant="secondary" className="flex items-center gap-1">
                    <span>{badge.icon}</span>
                    {badge.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Community Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leaderboard.slice(0, 10).map((entry) => (
              <div
                key={entry.userId}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  entry.userId === user.id ? "bg-emerald-50 border-emerald-200" : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  {getRankIcon(entry.rank)}
                  <div>
                    <div className="font-semibold">{entry.userName}</div>
                    <div className="text-sm text-gray-600">Level {entry.level}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-700">{entry.impactPoints}</div>
                  <div className="text-sm text-gray-600">points</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
