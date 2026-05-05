"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Lightbulb, TrendingUp, AlertTriangle, Target } from "lucide-react"
import { aiInsights } from "@/lib/mock-data"

const iconMap = {
  opportunity: Lightbulb,
  warning: AlertTriangle,
  trend: TrendingUp,
}

const colorMap = {
  opportunity: "text-yellow-500",
  warning: "text-red-500",
  trend: "text-blue-500",
}

export function AiInsightBox() {
  const insightsWithTypes = aiInsights.map((text, index) => ({
    text,
    type: index === 0 ? "trend" as const : index === 1 ? "warning" as const : "opportunity" as const
  }))

  return (
    <Card className="rounded-2xl shadow-sm border-yellow-200 bg-yellow-50/50 dark:bg-yellow-950/20">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          <h3 className="font-semibold">AI-Generated Insights</h3>
        </div>
        <div className="space-y-3">
          {insightsWithTypes.map((insight, index) => {
            const Icon = iconMap[insight.type]
            const colorClass = colorMap[insight.type]
            return (
              <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-background/80">
                <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${colorClass}`} />
                <p className="text-sm">{insight.text}</p>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
