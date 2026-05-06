"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Users, Target, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"
import { kpiStats } from "@/lib/mock-data"
import { useLanguage } from "@/i18n/LanguageProvider"

const iconMap = {
  Users: Users,
  TrendingUp: TrendingUp,
  Target: Target,
  DollarSign: DollarSign,
}

const titleKeyMap: Record<string, string> = {
  "Total Users Analyzed": "totalUsersAnalyzed",
  "Predicted Buyers": "predictedBuyers",
  "High-Intent Users": "highIntentUsers",
  "Revenue Opportunity": "revenueOpportunity",
}

const insightKeyMap: Record<string, string> = {
  "12% more than last batch": "moreThanLastBatch",
  "35% conversion rate projected": "conversionRateProjected",
  "Best segment for flash sales": "bestSegmentFlashSales",
  "Based on predicted AOV × users": "basedOnAov",
}

export function KpiOverview() {
  const { t } = useLanguage()

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {kpiStats.map((stat) => {
        const Icon = iconMap[stat.icon as keyof typeof iconMap] || Users
        return (
          <Card key={stat.title} className="rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t(titleKeyMap[stat.title] || stat.title)}
              </CardTitle>
              <Icon className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 mt-2">
                {stat.changeType === "positive" ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className={cn("text-xs font-medium",
                  stat.changeType === "positive" ? "text-green-500" : "text-red-500"
                )}>
                  {stat.change}
                </span>
                <span className="text-xs text-muted-foreground ml-1">{t("vsLastMonth")}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-3 border-t pt-2">
                {t(insightKeyMap[stat.insight] || stat.insight)}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
