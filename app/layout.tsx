import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/contexts/auth-context"
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "CivicEdge - Report Civic Issues",
  description: "Report and track civic issues in your community with live media capture and voice input",
  generator: "v0.app",
  manifest: "/manifest.json",
  themeColor: "#059669",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CivicEdge",
  },
  icons: {
    apple: "/placeholder.svg?height=180&width=180",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="CivicEdge" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/placeholder.svg?height=180&width=180" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>
          <AuthProvider>
            {children}
            <PWAInstallPrompt />
          </AuthProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
