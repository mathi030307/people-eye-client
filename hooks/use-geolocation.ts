"use client"

import { useState, useEffect, useCallback } from "react"

export interface GeolocationData {
  latitude: number
  longitude: number
  accuracy: number
  address?: string
}

export interface GeolocationHook {
  location: GeolocationData | null
  loading: boolean
  error: string | null
  getCurrentLocation: () => Promise<void>
  watchLocation: () => void
  stopWatching: () => void
}

export function useGeolocation(): GeolocationHook {
  const [location, setLocation] = useState<GeolocationData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [watchId, setWatchId] = useState<number | null>(null)

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      // Using a free geocoding service (OpenStreetMap Nominatim)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      )
      const data = await response.json()
      return data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`
    } catch (err) {
      console.error("Reverse geocoding failed:", err)
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`
    }
  }

  const getCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        })
      })

      const { latitude, longitude, accuracy } = position.coords
      const address = await reverseGeocode(latitude, longitude)

      setLocation({
        latitude,
        longitude,
        accuracy,
        address,
      })
    } catch (err: any) {
      let errorMessage = "Unable to get location"

      switch (err.code) {
        case err.PERMISSION_DENIED:
          errorMessage = "Location access denied by user"
          break
        case err.POSITION_UNAVAILABLE:
          errorMessage = "Location information unavailable"
          break
        case err.TIMEOUT:
          errorMessage = "Location request timed out"
          break
      }

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const watchLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser")
      return
    }

    const id = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords
        const address = await reverseGeocode(latitude, longitude)

        setLocation({
          latitude,
          longitude,
          accuracy,
          address,
        })
        setError(null)
      },
      (err) => {
        setError("Unable to watch location changes")
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    )

    setWatchId(id)
  }, [])

  const stopWatching = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId)
      setWatchId(null)
    }
  }, [watchId])

  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [watchId])

  return {
    location,
    loading,
    error,
    getCurrentLocation,
    watchLocation,
    stopWatching,
  }
}
