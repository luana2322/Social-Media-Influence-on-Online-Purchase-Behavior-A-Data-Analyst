"use client"
import { KpiOverview } from "@/components/dashboard/KpiOverview"
import { ProbabilityDistribution } from "@/components/dashboard/ProbabilityDistribution"
import { FeatureImportance } from "@/components/dashboard/FeatureImportance"
import { BehaviorInsights } from "@/components/dashboard/BehaviorInsights"
import { TrafficSourceAnalysis } from "@/components/dashboard/TrafficSourceAnalysis"
import { TimeAnalysis } from "@/components/dashboard/TimeAnalysis"
import { AiInsightBox } from "@/components/dashboard/AiInsightBox"
import { RecommendationPanel } from "@/components/dashboard/RecommendationPanel"
import { EmbeddedChatbot } from "@/components/dashboard/EmbeddedChatbot"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/i18n/LanguageProvider"
import { Brain, Sparkles } from "lucide-react"

export default function DashboardPage() {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{t("dashboard")}</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Brain className="h-4 w-4" />
          <span>{t("modelVersion")}</span>
          <Sparkles className="h-4 w-4 text-yellow-500 ml-2" />
          <span>{t("lastUpdated")}</span>
        </div>
      </div>

      {/* Section 1: KPI Overview */}
      <KpiOverview />

      {/* Section 2: AI Insight Box */}
      <AiInsightBox />

      {/* Section 3: Probability Distribution + Segmentation */}
      <ProbabilityDistribution />

      {/* Section 4: Feature Importance (SHAP) */}
      <FeatureImportance />

      {/* Section 5: Behavior Insights */}
      <BehaviorInsights />

      {/* Section 6: Traffic Source Analysis */}
      <TrafficSourceAnalysis />

      {/* Section 7: Time Analysis */}
      <TimeAnalysis />

      {/* Section 8: Recommendation Panel */}
      <RecommendationPanel />

      {/* Section 9: Embedded Chatbot */}
      <EmbeddedChatbot />
    </div>
  )
}
