"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Users, DollarSign, Target, Activity } from "lucide-react"
import { kpiCards } from "@/lib/mock-data"

const iconMap: Record<string, typeof Users> = {
  "Khách hàng có ý định cao": Users,
  "Doanh thu dự kiến": DollarSign,
  "Tiềm năng chuyển đổi": Target,
  "Xu hướng tương tác": Activity,
}

export function KpiCards() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {kpiCards.map((kpi) => {
        const Icon = iconMap[kpi.label] || Activity
        return (
          <Card key={kpi.label} className="rounded-2xl border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded-xl bg-violet-50 dark:bg-violet-950/30 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-violet-500" />
                </div>
                <div className="flex items-center gap-1">
                  {kpi.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm font-medium text-green-600">{kpi.change}</span>
                </div>
              </div>
              <p className="text-3xl font-bold tracking-tight">{kpi.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{kpi.label}</p>
              <p className="text-xs text-muted-foreground mt-2">{kpi.subtitle}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
