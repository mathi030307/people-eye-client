"use client"
import { useState, useEffect } from "react"

export function usePWA() {
  const [isOnline, setIsOnline] = useState(true)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check online status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Check if PWA is installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches
      const isInWebAppiOS = (window.navigator as any).standalone === true
      setIsInstalled(isStandalone || isInWebAppiOS)
    }

    checkInstalled()
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Register service worker
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("[PWA] Service Worker registered:", registration)
        })
        .catch((error) => {
          console.log("[PWA] Service Worker registration failed:", error)
        })
    }
  }, [])

  const addToQueue = (data: any) => {
    if (!isOnline) {
      const pendingReports = JSON.parse(localStorage.getItem("pendingReports") || "[]")
      pendingReports.push({ ...data, id: Date.now(), timestamp: new Date().toISOString() })
      localStorage.setItem("pendingReports", JSON.stringify(pendingReports))

      // Register for background sync
      if ("serviceWorker" in navigator && "sync" in window.ServiceWorkerRegistration.prototype) {
        navigator.serviceWorker.ready.then((registration) => {
          return registration.sync.register("background-sync-reports")
        })
      }

      return true
    }
    return false
  }

  return {
    isOnline,
    isInstalled,
    addToQueue,
  }
}
