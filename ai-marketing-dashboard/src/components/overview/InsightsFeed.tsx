"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, TrendingUp, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { aiInsights } from "@/lib/mock-data"

const categoryConfig = {
  opportunity: { icon: Lightbulb, color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-100 dark:border-yellow-900" },
  trend: { icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900" },
  action: { icon: Zap, color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-950/20 border-violet-100 dark:border-violet-900" },
}

export function InsightsFeed() {
  return (
    <Card className="rounded-2xl border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          Thông tin AI
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {aiInsights.map((insight) => {
          const config = categoryConfig[insight.category]
          const Icon = config.icon
          return (
            <div
              key={insight.id}
              className={cn("flex items-start gap-4 p-4 rounded-xl border", config.bg)}
            >
              <div className={cn("p-2 rounded-lg", config.bg)}>
                <Icon className={cn("h-5 w-5", config.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{insight.headline}</p>
                <p className="text-sm text-muted-foreground mt-1">{insight.body}</p>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
