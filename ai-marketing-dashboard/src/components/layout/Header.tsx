"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { LogOut } from "lucide-react"

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const isLandingPage = pathname === "/"

  if (isLandingPage) {
    return (
      <header className="fixed top-0 left-0 w-full h-16 border-b bg-background/80 backdrop-blur-sm z-10 flex items-center justify-between px-6">
        <div className="flex items-center gap-2 font-semibold">
          <span>AI Marketing Copilot</span>
        </div>
        <div className="flex items-center gap-4">
          <Button
            size="sm"
            variant="ghost"
            className="rounded-xl"
            onClick={() => router.push("/login")}
          >
            Đăng nhập
          </Button>
          <Button
            size="sm"
            className="rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-600 hover:to-fuchsia-600"
            onClick={() => router.push("/signup")}
          >
            Đăng ký
          </Button>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 h-14 border-b bg-background/80 backdrop-blur-sm z-10 flex items-center justify-between px-6">
      <div />
      <div className="flex items-center gap-3">
        {user && (
          <>
            <div className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-xl bg-accent/50">
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-semibold">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm">{user.fullName}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-xl text-muted-foreground hover:text-foreground"
              onClick={() => {
                logout()
                router.push("/")
              }}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </header>
  )
}
