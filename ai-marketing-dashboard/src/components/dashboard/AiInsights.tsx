"use client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, AlertTriangle, Lightbulb, DollarSign } from "lucide-react"
import { useLanguage } from "@/i18n/LanguageProvider"

const insightConfig = [
  {
    id: "trend",
    badgeKey: "insightTrend",
    icon: TrendingUp,
    badgeColor: "bg-green-500",
    headlineKey: "insight1Headline",
    meaningKey: "insight1Meaning",
    actionKey: "insight1Action",
    resultKey: "insight1Result",
  },
  {
    id: "warning",
    badgeKey: "insightWarning",
    icon: AlertTriangle,
    badgeColor: "bg-orange-500",
    headlineKey: "insight2Headline",
    meaningKey: "insight2Meaning",
    actionKey: "insight2Action",
    resultKey: "insight2Result",
  },
  {
    id: "opportunity",
    badgeKey: "insightOpportunity",
    icon: Lightbulb,
    badgeColor: "bg-blue-500",
    headlineKey: "insight3Headline",
    meaningKey: "insight3Meaning",
    actionKey: "insight3Action",
    resultKey: "insight3Result",
  },
]

export function AiInsights() {
  const { t } = useLanguage()

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{t("aiInsightsTitle")}</h2>
      <div className="grid gap-4">
        {insightConfig.map((insight) => {
          const Icon = insight.icon
          return (
            <Card key={insight.id} className="rounded-2xl shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white ${insight.badgeColor}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={insight.badgeColor}>{t(insight.badgeKey)}</Badge>
                    </div>
                    <p className="text-lg font-bold text-foreground">
                      {t(insight.headlineKey)}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* What this means */}
                <div className="p-3 bg-muted/50 rounded-xl">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                    {t("insightWhatMeans")}
                  </p>
                  <p className="text-sm">{t(insight.meaningKey)}</p>
                </div>

                {/* What to do */}
                <div className="p-3 bg-primary/5 rounded-xl border border-primary/20">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">
                    {t("insightWhatDo")}
                  </p>
                  <p className="text-sm">{t(insight.actionKey)}</p>
                </div>

                {/* Expected result */}
                <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/30 rounded-xl">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-semibold text-green-700">
                    {t("insightExpected")}: {t(insight.resultKey)}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
