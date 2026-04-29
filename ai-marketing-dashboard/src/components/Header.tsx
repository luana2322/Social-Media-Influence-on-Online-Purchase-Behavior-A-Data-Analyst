"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Search, Bell, User, Settings, LogOut, Globe } from "lucide-react"
import { useLanguage } from "@/i18n/LanguageProvider"

export function Header() {
  const { t, language, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    const newLang = language === "en" ? "vi" : "en"
    setLanguage(newLang)
    // Reload page to apply lang attribute change
    window.location.reload()
  }

  return (
    <header key={language} className="fixed top-0 left-64 w-[calc(100%-16rem)] h-16 border-b bg-background z-10 flex items-center justify-between px-6">
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t("searchPlaceholder")}
          className="pl-10 rounded-2xl bg-accent/50 border-none"
        />
      </div>
      <div className="flex items-center gap-4">
        <Button
          variant={language === "en" ? "default" : "outline"}
          size="sm"
          className={`rounded-2xl flex items-center gap-2 transition-all ${language === "vi" ? "bg-blue-50 border-blue-300 text-blue-700" : ""}`}
          onClick={toggleLanguage}
          title={t("language")}
        >
          <Globe className="h-4 w-4" />
          <span className="font-medium text-xs">{language === "en" ? "EN" : "VI"}</span>
        </Button>
        <Button variant="ghost" size="icon" className="rounded-2xl">
          <Bell className="h-5 w-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-2xl hover:bg-accent transition-colors outline-none">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <span>John Doe</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-2xl">
            <DropdownMenuLabel>{t("myAccount")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              {t("profile")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              {t("settings")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              {t("logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
