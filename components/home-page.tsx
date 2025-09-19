"use client"
import { useState } from "react"
import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { useReports } from "@/hooks/use-reports"
import { useGeolocation } from "@/hooks/use-geolocation"
import { useProblemDetection } from "@/hooks/use-problem-detection"
import type { ReportFormData } from "@/types/report"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { VoiceInputModal } from "@/components/voice-input-modal"
import { MediaCaptureModal } from "@/components/media-capture-modal"
import { LocationMap } from "@/components/location-map"
import { OfflineIndicator } from "@/components/offline-indicator"
import { Scoreboard } from "@/components/scoreboard"
import {
  Camera,
  MapPin,
  FileText,
  Settings,
  Home,
  Plus,
  User,
  LogOut,
  Menu,
  X,
  Mic,
  Video,
  Trophy,
  Brain,
  CheckCircle,
} from "lucide-react"

type Page = "home" | "report" | "my-reports" | "profile" | "scoreboard"

export default function HomePage() {
  const { user, logout } = useAuth()
  const { submitReport, getUserReports } = useReports()
  const [currentPage, setCurrentPage] = useState<Page>("home")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigationItems = [
    { id: "home" as Page, label: "Home", icon: Home },
    { id: "report" as Page, label: "Report Issue", icon: Plus },
    { id: "my-reports" as Page, label: "My Reports", icon: FileText },
    { id: "scoreboard" as Page, label: "Scoreboard", icon: Trophy },
    { id: "profile" as Page, label: "Profile", icon: User },
  ]

  const featureCards = [
    {
      title: "Capture Issue",
      description: "Take photos and videos of civic problems",
      icon: Camera,
      color: "bg-primary/10 text-primary",
    },
    {
      title: "Location Tracking",
      description: "Automatically detect and tag issue location",
      icon: MapPin,
      color: "bg-accent/10 text-accent",
    },
    {
      title: "My Reports",
      description: "Track status of your submitted issues",
      icon: FileText,
      color: "bg-secondary/10 text-secondary",
    },
    {
      title: "Settings",
      description: "Manage your account and preferences",
      icon: Settings,
      color: "bg-muted-foreground/10 text-muted-foreground",
    },
  ]

  const renderContent = () => {
    switch (currentPage) {
      case "home":
        return (
          <div className="space-y-6">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 text-center">
              <h1 className="text-2xl font-bold text-foreground mb-2">Welcome back, {user?.fullName}!</h1>
              <p className="text-muted-foreground mb-4">Help make your community better by reporting civic issues</p>
              <Button onClick={() => setCurrentPage("report")} size="lg" className="shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                Report New Issue
              </Button>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featureCards.map((feature) => {
                const IconComponent = feature.icon
                return (
                  <Card
                    key={feature.title}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => {
                      if (feature.title === "My Reports") setCurrentPage("my-reports")
                      if (feature.title === "Settings") setCurrentPage("profile")
                      if (feature.title === "Capture Issue") setCurrentPage("report")
                    }}
                  >
                    <CardHeader className="pb-3">
                      <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-2`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Community Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">24</div>
                    <div className="text-sm text-muted-foreground">Issues Reported</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-accent">18</div>
                    <div className="text-sm text-muted-foreground">Issues Resolved</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-secondary">6</div>
                    <div className="text-sm text-muted-foreground">In Progress</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "report":
        return <ReportIssuePage onBack={() => setCurrentPage("home")} submitReport={submitReport} />

      case "my-reports":
        return <MyReportsPage onBack={() => setCurrentPage("home")} getUserReports={getUserReports} />

      case "scoreboard":
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => setCurrentPage("home")}>
                ← Back
              </Button>
              <h1 className="text-2xl font-bold">Scoreboard</h1>
            </div>
            <Scoreboard />
          </div>
        )

      case "profile":
        return <ProfilePage onBack={() => setCurrentPage("home")} />

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <OfflineIndicator />

      {/* Navigation Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-primary">CivicEdge</h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigationItems.map((item) => {
                const IconComponent = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentPage === item.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </nav>

            {/* Desktop Logout */}
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Hello, {user?.fullName}</span>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-card border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => {
                const IconComponent = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentPage(item.id)
                      setMobileMenuOpen(false)
                    }}
                    className={`flex items-center space-x-3 w-full px-3 py-2 rounded-md text-base font-medium ${
                      currentPage === item.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                )
              })}
              <button
                onClick={logout}
                className="flex items-center space-x-3 w-full px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{renderContent()}</main>
    </div>
  )
}

// Placeholder components for other pages
function ReportIssuePage({
  onBack,
  submitReport,
}: { onBack: () => void; submitReport: (formData: ReportFormData) => Promise<boolean> }) {
  const [formData, setFormData] = useState<ReportFormData>({
    title: "",
    description: "",
    category: "",
    location: "",
    images: [],
    videos: [],
    audioNotes: [],
    geoLocation: null,
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [showVoiceModal, setShowVoiceModal] = useState(false)
  const [showMediaModal, setShowMediaModal] = useState(false)
  const [voiceField, setVoiceField] = useState<"title" | "description">("description")
  const [detectionResult, setDetectionResult] = useState<{
    category: string
    confidence: number
    description: string
  } | null>(null)

  const { getCurrentLocation, location: geoLocation } = useGeolocation()
  const { detectProblemFromImage, isDetecting } = useProblemDetection()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFormData((prev) => ({
      ...prev,
      images: files,
    }))

    if (files.length > 0) {
      try {
        const result = await detectProblemFromImage(files[0])
        setDetectionResult(result)
        setFormData((prev) => ({
          ...prev,
          category: result.category,
          title: prev.title || result.description,
        }))
      } catch (error) {
        console.error("Detection failed:", error)
      }
    }
  }

  const handleVoiceInput = (field: "title" | "description") => {
    setVoiceField(field)
    setShowVoiceModal(true)
  }

  const handleVoiceText = (text: string) => {
    setFormData((prev) => ({
      ...prev,
      [voiceField]: text,
    }))
    setShowVoiceModal(false)
  }

  const handleMediaCapture = async (media: { images?: File[]; videos?: File[]; audioNotes?: File[] }) => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...(media.images || [])],
      videos: [...(prev.videos || []), ...(media.videos || [])],
      audioNotes: [...(prev.audioNotes || []), ...(media.audioNotes || [])],
    }))

    if (media.images && media.images.length > 0) {
      try {
        const result = await detectProblemFromImage(media.images[0])
        setDetectionResult(result)
        setFormData((prev) => ({
          ...prev,
          category: result.category,
          title: prev.title || result.description,
        }))
      } catch (error) {
        console.error("Detection failed:", error)
      }
    }

    setShowMediaModal(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  
    if (formData.images.length === 0 && (!formData.videos || formData.videos.length === 0)) {
      setError("Live photos or videos are required. Please use the camera to capture media.")
      return
    }
  
    setLoading(true)
    setError("")
  
    try {
      const submitData = {
        ...formData,
        geoLocation: geoLocation,
      }
  
      // 👇 Show collected data before sending
      console.log("Collected Report Data:", submitData)
      alert(JSON.stringify(submitData, null, 2)) // formatted JSON in alert
  
      const success = await submitReport(submitData)
      if (success) {
        setSuccess(true)
        setFormData({
          title: "",
          description: "",
          category: "",
          location: "",
          images: [],
          videos: [],
          audioNotes: [],
          geoLocation: null,
        })
        setDetectionResult(null)
        const fileInput = document.getElementById("images") as HTMLInputElement
        if (fileInput) fileInput.value = ""
      } else {
        setError("Failed to submit report. Please try again.")
      }
    } catch (err) {
      setError("An error occurred while submitting the report.")
    } finally {
      setLoading(false)
    }
  }
  

  const handleGetCurrentLocation = async () => {
    try {
      const location = await getCurrentLocation()
      if (location) {
        setFormData((prev) => ({
          ...prev,
          location: location.address || `Lat: ${location.latitude.toFixed(6)}, Lng: ${location.longitude.toFixed(6)}`,
        }))
      }
    } catch (error) {
      console.error("Error getting location:", error)
      setError("Unable to get current location. Please enter manually.")
    }
  }

  if (success) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            ← Back
          </Button>
          <h1 className="text-2xl font-bold">Report Submitted</h1>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Thank you for your report!</h3>
            <p className="text-muted-foreground mb-4">
              Your civic issue has been submitted successfully. You can track its progress in the "My Reports" section.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => setSuccess(false)}>Submit Another Report</Button>
              <Button variant="outline" onClick={onBack}>
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onBack}>
          ← Back
        </Button>
        <h1 className="text-2xl font-bold">Report New Issue</h1>
      </div>

      {geoLocation && (
        <LocationMap
          latitude={geoLocation.latitude}
          longitude={geoLocation.longitude}
          address={geoLocation.address}
          className="mb-6"
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Issue Details</CardTitle>
          <CardDescription>
            Upload photos/videos to automatically detect the issue type, or provide details manually
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {detectionResult && (
              <Alert className="border-green-200 bg-green-50">
                <Brain className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <div className="flex items-center justify-between">
                    <span>
                      Auto-detected: <strong>{detectionResult.category}</strong>(
                      {Math.round(detectionResult.confidence * 100)}% confidence)
                    </span>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Media Upload *</Label>
                <Button type="button" variant="outline" onClick={() => setShowMediaModal(true)}>
                  <Video className="w-4 h-4 mr-2" />
                  Live Capture
                </Button>
              </div>

              <div className="space-y-2">
                {/* Live Media Capture Required */}
                <div className="p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg text-center">
                  <Camera className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium mb-1">Live Media Capture Required</p>
                  <p className="text-xs text-muted-foreground mb-3">
                    Use the "Live Capture" button above to take photos/videos with automatic geo-tagging
                  </p>
                  <Button type="button" onClick={() => setShowMediaModal(true)} className="w-full">
                    <Camera className="w-4 h-4 mr-2" />
                    Open Camera
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong>Required:</strong> Live capture only - photos and videos will be automatically geo-tagged with
                  your current location. AI will detect the issue type.
                </p>
              </div>

              {isDetecting && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  Analyzing image to detect issue type...
                </div>
              )}

              {(formData.images.length > 0 ||
                (formData.videos && formData.videos.length > 0) ||
                (formData.audioNotes && formData.audioNotes.length > 0)) && (
                <div className="space-y-2">
                  <Label>Attached Media</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {formData.images.length > 0 && (
                      <div className="p-2 bg-muted rounded border">
                        <div className="text-sm font-medium">Images ({formData.images.length})</div>
                        <div className="text-xs text-muted-foreground">
                          {formData.images.map((file) => file.name).join(", ")}
                        </div>
                      </div>
                    )}
                    {formData.videos && formData.videos.length > 0 && (
                      <div className="p-2 bg-muted rounded border">
                        <div className="text-sm font-medium">Videos ({formData.videos.length})</div>
                        <div className="text-xs text-muted-foreground">
                          {formData.videos.map((file) => file.name).join(", ")}
                        </div>
                      </div>
                    )}
                    {formData.audioNotes && formData.audioNotes.length > 0 && (
                      <div className="p-2 bg-muted rounded border">
                        <div className="text-sm font-medium">Audio Notes ({formData.audioNotes.length})</div>
                        <div className="text-xs text-muted-foreground">
                          {formData.audioNotes.map((file) => file.name).join(", ")}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Issue Title *</Label>
              <div className="flex gap-2">
                <Input
                  id="title"
                  name="title"
                  placeholder="Brief description of the issue"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="flex-1"
                />
                <Button type="button" variant="outline" onClick={() => handleVoiceInput("title")}>
                  <Mic className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {formData.category && (
              <div className="space-y-2">
                <Label>Detected Category</Label>
                <div className="p-3 bg-muted rounded-md border">
                  <span className="font-medium text-foreground">{formData.category}</span>
                  {detectionResult && (
                    <span className="text-sm text-muted-foreground ml-2">
                      (Auto-detected with {Math.round(detectionResult.confidence * 100)}% confidence)
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Detailed description of the issue"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="flex-1 px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleVoiceInput("description")}
                    className="self-start"
                  >
                    <Mic className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Use the microphone button for voice input (supports Tamil, Hindi, Sanskrit)
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <div className="flex gap-2">
                <Input
                  id="location"
                  name="location"
                  placeholder="Enter location or address"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="flex-1"
                />
                <Button type="button" variant="outline" onClick={handleGetCurrentLocation}>
                  <MapPin className="w-4 h-4 mr-2" />
                  Use Current
                </Button>
              </div>
              {geoLocation && (
                <p className="text-sm text-muted-foreground">
                  Accuracy: ±{geoLocation.accuracy}m | {geoLocation.address}
                </p>
              )}
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Submitting Report...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Submit 
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <VoiceInputModal
        isOpen={showVoiceModal}
        onClose={() => setShowVoiceModal(false)}
        onTextReceived={handleVoiceText}
        fieldName={voiceField}
      />

      <MediaCaptureModal
        isOpen={showMediaModal}
        onClose={() => setShowMediaModal(false)}
        onMediaCaptured={handleMediaCapture}
      />
    </div>
  )
}

function MyReportsPage({ onBack, getUserReports }: { onBack: () => void; getUserReports: () => any[] }) {
  const userReports = getUserReports()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-800"
      case "In Progress":
        return "bg-yellow-100 text-yellow-800"
      case "Resolved":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onBack}>
          ← Back
        </Button>
        <h1 className="text-2xl font-bold">My Reports</h1>
      </div>

      {userReports.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Reports Yet</h3>
            <p className="text-muted-foreground mb-4">You haven't submitted any civic issue reports yet.</p>
            <Button onClick={onBack}>Report Your First Issue</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {userReports.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{report.category}</span>
                      <span>•</span>
                      <span>{formatDate(report.createdAt)}</span>
                    </div>
                  </div>
                  <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                </div>
                <CardDescription className="line-clamp-2">{report.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{report.location}</span>
                </div>
                {report.images.length > 0 && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    <Camera className="w-4 h-4 inline mr-1" />
                    {report.images.length} image{report.images.length > 1 ? "s" : ""} attached
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function ProfilePage({ onBack }: { onBack: () => void }) {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onBack}>
          ← Back
        </Button>
        <h1 className="text-2xl font-bold">Profile</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Full Name</label>
            <p className="text-foreground">{user?.fullName}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Email</label>
            <p className="text-foreground">{user?.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Mobile Number</label>
            <p className="text-foreground">{user?.mobileNumber}</p>
          </div>
          <Button variant="outline" className="mt-4 bg-transparent">
            Edit Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
