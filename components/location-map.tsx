"use client"
import { useEffect, useRef, useState } from "react"
import { MapPin } from "lucide-react"

interface LocationMapProps {
  latitude?: number
  longitude?: number
  address?: string
  className?: string
}

export function LocationMap({ latitude, longitude, address, className = "" }: LocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapError, setMapError] = useState(false)

  useEffect(() => {
    // In a real app, you would integrate with Google Maps, Mapbox, or OpenStreetMap
    // For now, we'll show a placeholder with coordinates
    if (latitude && longitude) {
      setMapError(false)
    }
  }, [latitude, longitude])

  if (!latitude || !longitude) {
    return (
      <div className={`bg-muted rounded-lg p-8 text-center ${className}`}>
        <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-muted-foreground">Location will appear here once detected</p>
      </div>
    )
  }

  return (
    <div className={`bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-4 border ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-foreground">Current Location</h3>
        <MapPin className="w-5 h-5 text-primary" />
      </div>

      {/* Mock map visualization */}
      <div className="bg-white rounded border h-32 flex items-center justify-center mb-3 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-green-100 to-blue-50 opacity-50"></div>
        <div className="relative z-10 text-center">
          <div className="w-6 h-6 bg-red-500 rounded-full mx-auto mb-1 animate-pulse"></div>
          <div className="text-xs font-medium text-foreground">You are here</div>
        </div>
        {/* Mock map grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-8 grid-rows-4 h-full">
            {Array.from({ length: 32 }).map((_, i) => (
              <div key={i} className="border border-gray-300"></div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Coordinates:</span>
          <span className="font-mono text-foreground">
            {latitude.toFixed(6)}, {longitude.toFixed(6)}
          </span>
        </div>
        {address && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Address:</span>
            <span className="text-foreground text-right flex-1 ml-2">{address}</span>
          </div>
        )}
      </div>
    </div>
  )
}
