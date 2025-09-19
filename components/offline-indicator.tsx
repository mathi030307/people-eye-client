"use client"
import { usePWA } from "@/hooks/use-pwa"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { WifiOff } from "lucide-react"

export function OfflineIndicator() {
  const { isOnline } = usePWA()

  if (isOnline) return null

  return (
    <div className="fixed top-16 left-4 right-4 z-40 md:left-auto md:right-4 md:w-80">
      <Alert variant="destructive" className="bg-orange-50 border-orange-200 text-orange-800">
        <WifiOff className="h-4 w-4" />
        <AlertDescription>
          You're offline. Reports will be saved and synced when connection is restored.
        </AlertDescription>
      </Alert>
    </div>
  )
}
