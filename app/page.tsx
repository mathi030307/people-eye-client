"use client"

import { useAuth } from "@/contexts/auth-context"
import LoginPage from "@/components/login-page"
import HomePage from "@/components/home-page"

export default function Page() {
  const { isAuthenticated } = useAuth()

  return isAuthenticated ? <HomePage /> : <LoginPage />
}
