"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { LoginModal } from "@/components/auth/login-modal"
import { useRouter, usePathname } from "next/navigation"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Only show the login modal if the user is not logged in and we're done loading
    if (!loading && !user) {
      setShowLoginModal(true)
    }
  }, [user, loading])

  const handleLoginSuccess = () => {
    setShowLoginModal(false)
  }

  const handleCloseModal = () => {
    setShowLoginModal(false)
    router.push("/")
  }

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {user ? children : null}
      <LoginModal isOpen={showLoginModal} onClose={handleCloseModal} onSuccess={handleLoginSuccess} />
    </>
  )
}
