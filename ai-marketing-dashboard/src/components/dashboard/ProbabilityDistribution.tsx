"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChartComponent, BarChartComponent } from "@/components/Charts"
import { SegmentationPanel } from "./SegmentationPanel"
import { enhancedSegmentationData } from "@/lib/mock-data"
import { Lightbulb } from "lucide-react"
import { useLanguage } from "@/i18n/LanguageProvider"

export function ProbabilityDistribution() {
  const { t } = useLanguage()
  const highIntentPct = enhancedSegmentationData[0].value
  const mediumIntentPct = enhancedSegmentationData[1].value

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>{t("purchaseProbabilityDistribution")}</CardTitle>
        </CardHeader>
        <CardContent>
          <PieChartComponent />
          <div className="mt-4 p-4 bg-accent/50 rounded-2xl">
            <div className="flex items-start gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground">
                {t("highIntentInsight").replace("%", `${highIntentPct}%`).replace("%", `${mediumIntentPct}%`)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <SegmentationPanel />
    </div>
  )
}
