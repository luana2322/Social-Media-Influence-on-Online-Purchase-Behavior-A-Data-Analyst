"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"
import { AuthProvider, useAuth } from "@/context/AuthContext"

function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  const isPublic = pathname === "/" || pathname === "/login" || pathname === "/signup"

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isPublic) {
      router.replace("/login")
    }
  }, [isLoading, isAuthenticated, isPublic, router])

  if (isPublic) return <>{children}</>
  if (isLoading) return null
  if (!isAuthenticated) return null

  return <>{children}</>
}

function LayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLandingPage = pathname === "/"
  const isAuthPage = pathname === "/login" || pathname === "/signup"

  if (isAuthPage) {
    return (
      <AuthGuard>
        <div className="flex min-h-screen">
          <main className="flex-1">{children}</main>
        </div>
      </AuthGuard>
    )
  }

  if (isLandingPage) {
    return (
      <AuthGuard>
        <div className="flex min-h-screen">
          <div className="flex-1">
            <Header />
            <main>{children}</main>
          </div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 md:ml-64">
          <Header />
          <main className="p-6 max-w-7xl mx-auto">{children}</main>
        </div>
      </div>
    </AuthGuard>
  )
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LayoutInner>{children}</LayoutInner>
    </AuthProvider>
  )
}
