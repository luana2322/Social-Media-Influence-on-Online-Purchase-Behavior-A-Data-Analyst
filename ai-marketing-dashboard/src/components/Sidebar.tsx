"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  UploadCloud,
  ListTodo,
  BarChart3,
  MessageSquare,
  Settings,
  Brain,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/i18n/LanguageProvider"

const navItems = [
  { href: "/", labelKey: "dashboard" as const, icon: LayoutDashboard },
  { href: "/upload", labelKey: "upload" as const, icon: UploadCloud },
  { href: "/jobs", labelKey: "jobs" as const, icon: ListTodo },
  { href: "/analytics", labelKey: "analytics" as const, icon: BarChart3 },
  { href: "/chatbot", labelKey: "chatbot" as const, icon: MessageSquare },
  { href: "/settings", labelKey: "settingsTitle" as const, icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { t, language } = useLanguage()
  return (
    <div key={language} className="hidden md:block w-64 fixed h-full border-r bg-background overflow-y-auto">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Brain className="h-6 w-6 text-primary" />
          <span>AI Marketing</span>
        </Link>
      </div>
      <nav className="flex flex-col gap-1 p-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent"
            )}
          >
            <item.icon className="h-5 w-5" />
            {t(item.labelKey)}
          </Link>
        ))}
      </nav>
    </div>
  )
}
