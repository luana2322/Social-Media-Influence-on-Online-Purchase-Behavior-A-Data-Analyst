"use client"
import { SimpleOverview } from "@/components/dashboard/SimpleOverview"
import { SimpleCustomerGroups } from "@/components/dashboard/SimpleCustomerGroups"
import { SimpleWhyTheyBuy } from "@/components/dashboard/SimpleWhyTheyBuy"
import { SimpleBestTime } from "@/components/dashboard/SimpleBestTime"
import { SimpleBestChannel } from "@/components/dashboard/SimpleBestChannel"
import { SimpleAISuggestions } from "@/components/dashboard/SimpleAISuggestions"
import { EmbeddedChatbotSimple } from "@/components/dashboard/EmbeddedChatbotSimple"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Megaphone, Sparkles } from "lucide-react"
import { useLanguage } from "@/i18n/LanguageProvider"

export default function SimpleDashboardPage() {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("simpleDashboard")}</h1>
          <p className="text-muted-foreground mt-1">{t("simpleSubtitle")}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Megaphone className="h-4 w-4" />
          <span>Updated 2 min ago</span>
          <Sparkles className="h-4 w-4 text-yellow-500 ml-2" />
          <span>AI-powered</span>
        </div>
      </div>

      {/* Section 1: Overview */}
      <section>
        <h2 className="text-xl font-semibold mb-4">{t("overview")}</h2>
        <SimpleOverview />
      </section>

      {/* Section 2: AI Suggestions (Most Important - at top) */}
      <section>
        <SimpleAISuggestions />
      </section>

      {/* Section 3: Customer Groups (Most Important) */}
      <section>
        <h2 className="text-xl font-semibold mb-4">{t("customerGroups")}</h2>
        <SimpleCustomerGroups />
      </section>

      {/* Section 4: Why Customers Buy */}
      <section>
        <h2 className="text-xl font-semibold mb-4">{t("whyCustomersBuy")}</h2>
        <SimpleWhyTheyBuy />
      </section>

      {/* Section 5: Best Time + Best Channel (2-col on lg) */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-4">{t("bestTimeToSell")}</h2>
          <SimpleBestTime />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">{t("bestChannel")}</h2>
          <SimpleBestChannel />
        </div>
      </section>

      {/* Section 6: Chatbot */}
      <section>
        <h2 className="text-xl font-semibold mb-4">{t("askAssistant")}</h2>
        <EmbeddedChatbotSimple />
      </section>
    </div>
  )
}
