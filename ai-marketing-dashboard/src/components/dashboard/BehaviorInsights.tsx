"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EngagementScatterChart, SentimentLineChart } from "@/components/Charts"
import { Lightbulb } from "lucide-react"
import { useLanguage } from "@/i18n/LanguageProvider"

export function BehaviorInsights() {
  const { t } = useLanguage()

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>{t("engagementVsPurchase")}</CardTitle>
        </CardHeader>
        <CardContent>
          <EngagementScatterChart />
          <div className="mt-4 p-4 bg-accent/50 rounded-2xl">
            <div className="flex items-start gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground">
                {t("engagementInsight")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>{t("sentimentVsConversion")}</CardTitle>
        </CardHeader>
        <CardContent>
          <SentimentLineChart />
          <div className="mt-4 p-4 bg-accent/50 rounded-2xl">
            <div className="flex items-start gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground">
                {t("sentimentInsight")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
