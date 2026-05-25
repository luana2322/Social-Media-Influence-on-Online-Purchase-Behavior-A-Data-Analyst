"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  UploadCloud,
  History,
  Settings,
  Sparkles,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/overview", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/analyze", label: "Phân tích dữ liệu", icon: UploadCloud },
  { href: "/history", label: "Lịch sử", icon: History },
  { href: "/settings", label: "Cài đặt", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const isLandingPage = pathname === "/"

  if (isLandingPage) return null

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:h-full border-r bg-background">
      <div className="flex h-16 items-center gap-2 px-6 border-b">
        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <span className="font-semibold text-base">AI Marketing Copilot</span>
      </div>
      <nav className="flex flex-col gap-1 p-4 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-gradient-to-r from-violet-50 to-fuchsia-50 text-violet-700 dark:from-violet-950/40 dark:to-fuchsia-950/40 dark:text-violet-300"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
              {isActive && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-500" />
              )}
            </Link>
          )
        })}
      </nav>
      <div className="border-t p-4">
        {user && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-semibold">
                {user.fullName.charAt(0)}
              </div>
              <div className="text-sm">
                <p className="font-medium leading-tight">{user.fullName}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
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
          </div>
        )}
      </div>
    </div>
  )
}
