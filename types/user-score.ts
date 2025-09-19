export interface UserScore {
  userId: string
  userName: string
  totalReports: number
  resolvedReports: number
  impactPoints: number
  level: number
  badges: Badge[]
  rank: number
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  earnedAt: string
}

export interface LeaderboardEntry {
  userId: string
  userName: string
  impactPoints: number
  level: number
  rank: number
  badges: Badge[]
}
