"use client"

import { useLanguage } from "@/i18n/LanguageProvider"
import { ReactNode } from "react"

export default function HtmlLang({ children }: { children: ReactNode }) {
  const { language } = useLanguage()

  return (
    <html lang={language === "vi" ? "vi" : "en"} suppressHydrationWarning>
      {children}
    </html>
  )
}
