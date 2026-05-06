"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrafficSourceBarChart } from "@/components/Charts"
import { trafficSourceData } from "@/lib/mock-data"
import { Lightbulb, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/i18n/LanguageProvider"

export function TrafficSourceAnalysis() {
  const { t } = useLanguage()
  const bestChannel = [...trafficSourceData].sort((a, b) => b.conversionRate - a.conversionRate)[0]
  const worstChannel = [...trafficSourceData].sort((a, b) => a.conversionRate - b.conversionRate)[0]

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          {t("trafficSourceAnalysis")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TrafficSourceBarChart />
        <div className="mt-6 space-y-4">
          <div className="p-4 bg-accent/50 rounded-2xl">
            <div className="flex items-start gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{bestChannel.source}</span> {t("performsBest").replace("%", `${(bestChannel.conversionRate * 100).toFixed(0)}%`)}
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{worstChannel.source}</span> {t("underperforms").replace("%", `${(worstChannel.conversionRate * 100).toFixed(0)}%`)}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {trafficSourceData.map((source) => (
              <div key={source.source} className="p-3 rounded-xl bg-accent/30 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{source.source}</span>
                  <Badge variant={source.conversionRate > 0.2 ? "default" : "secondary"} className="rounded-2xl text-xs">
                    {(source.conversionRate * 100).toFixed(0)}%
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{source.count.toLocaleString()} {t("visitors")}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
