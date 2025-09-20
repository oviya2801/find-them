"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface AuthGuardProps {
  children: React.ReactNode
  allowedRoles?: string[]
  fallback?: React.ReactNode
}

export function AuthGuard({ children, allowedRoles, fallback }: AuthGuardProps) {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me")
        const data = await response.json()

        if (!data.success) {
          router.push("/organization/login")
          return
        }

        if (allowedRoles && !allowedRoles.includes(data.user.role)) {
          router.push("/unauthorized")
          return
        }

        setIsAuthorized(true)
      } catch (error) {
        console.error("Auth check failed:", error)
        router.push("/organization/login")
      }
    }

    checkAuth()
  }, [router, allowedRoles])

  if (isAuthorized === null) {
    return fallback || <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}
