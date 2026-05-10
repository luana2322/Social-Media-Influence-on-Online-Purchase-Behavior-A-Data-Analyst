"use client"
import { AiActionCenter } from "@/components/dashboard/AiActionCenter"
import { BusinessOverview } from "@/components/dashboard/BusinessOverview"
import { CustomerSegments } from "@/components/dashboard/CustomerSegments"
import { AiInsights } from "@/components/dashboard/AiInsights"
import { QuickActions } from "@/components/dashboard/QuickActions"
import { EmbeddedChatbotSimple } from "@/components/dashboard/EmbeddedChatbotSimple"
import { useLanguage } from "@/i18n/LanguageProvider"

export default function SimpleDashboardPage() {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("simpleDashboard")}</h1>
        <p className="text-muted-foreground mt-1">{t("simpleSubtitle")}</p>
      </div>

      {/* Section A: AI Action Center */}
      <section>
        <AiActionCenter />
      </section>

      {/* Section B: Business Overview */}
      <section>
        <BusinessOverview />
      </section>

      {/* Section C: Customer Segments */}
      <section>
        <CustomerSegments />
      </section>

      {/* Section D: AI Insights */}
      <section>
        <AiInsights />
      </section>

      {/* Section E: Quick Actions */}
      <section>
        <QuickActions />
      </section>

      {/* Chatbot */}
      <section>
        <h2 className="text-xl font-semibold mb-4">{t("askAssistant")}</h2>
        <EmbeddedChatbotSimple />
      </section>
    </div>
  )
}
