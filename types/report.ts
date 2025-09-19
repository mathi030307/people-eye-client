export interface Report {
  id: string
  title: string
  description: string
  category: string
  location: string
  coordinates?: {
    latitude: number
    longitude: number
  }
  images: string[]
  videos: string[]
  status: "New" | "In Progress" | "Resolved"
  createdAt: string
  userId: string
}

export interface ReportFormData {
  title: string
  description: string
  category: string
  location: string
  images: File[]
  videos: File[]
}
