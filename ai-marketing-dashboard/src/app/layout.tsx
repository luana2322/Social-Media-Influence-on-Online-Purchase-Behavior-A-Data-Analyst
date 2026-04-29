import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Sidebar } from "@/components/Sidebar"
import { Header } from "@/components/Header"
import { ThemeProvider } from "@/components/ThemeProvider"
import { LanguageProvider } from "@/i18n/LanguageProvider"
import HtmlLang from "@/components/HtmlLang"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI Marketing Assistant",
  description: "SaaS platform for AI-driven marketing predictions",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LanguageProvider>
      <HtmlLang>
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="flex min-h-screen">
              <Sidebar />
              <div className="flex-1 ml-64 mt-16">
                <Header />
                <main className="p-6">{children}</main>
              </div>
            </div>
          </ThemeProvider>
        </body>
      </HtmlLang>
    </LanguageProvider>
  )
}
