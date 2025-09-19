const CACHE_NAME = "civicedge-v1"
const urlsToCache = ["/", "/static/js/bundle.js", "/static/css/main.css", "/manifest.json"]

// Install event - cache resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Opened cache")
      return cache.addAll(urlsToCache)
    }),
  )
})

// Fetch event - serve from cache when offline
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      if (response) {
        return response
      }
      return fetch(event.request)
    }),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("[SW] Deleting old cache:", cacheName)
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
})

// Background sync for offline report submissions
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync-reports") {
    event.waitUntil(syncReports())
  }
})

async function syncReports() {
  try {
    const reports = JSON.parse(localStorage.getItem("pendingReports") || "[]")

    for (const report of reports) {
      try {
        // Attempt to submit the report
        const response = await fetch("/api/reports", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(report),
        })

        if (response.ok) {
          // Remove from pending reports
          const updatedReports = reports.filter((r) => r.id !== report.id)
          localStorage.setItem("pendingReports", JSON.stringify(updatedReports))
        }
      } catch (error) {
        console.log("[SW] Failed to sync report:", error)
      }
    }
  } catch (error) {
    console.log("[SW] Background sync error:", error)
  }
}
