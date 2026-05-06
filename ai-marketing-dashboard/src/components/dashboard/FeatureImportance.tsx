"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShapBarChart } from "@/components/Charts"
import { shapData } from "@/lib/mock-data"
import { BarChart3 } from "lucide-react"
import { useLanguage } from "@/i18n/LanguageProvider"

export function FeatureImportance() {
  const { t } = useLanguage()

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          {t("featureImportance")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ShapBarChart />
        <div className="mt-6 space-y-2">
          <p className="text-sm font-medium text-muted-foreground mb-3">{t("keyInsights")}</p>
          {shapData.slice(0, 5).map((feature) => (
            <div key={feature.feature} className="flex items-start gap-2 p-2 rounded-lg bg-accent/30">
              <div
                className="w-1 h-full min-h-[40px] rounded-full shrink-0"
                style={{ backgroundColor: `hsl(240, 70%, ${60 - shapData.indexOf(feature) * 3}%)` }}
              />
              <p className="text-sm">
                <span className="font-medium">{feature.feature}</span> {t("contributesToPurchase")}
                <span className="font-semibold text-primary"> +{(feature.importance * 100).toFixed(0)}%</span> {t("toPurchaseProbability")}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
