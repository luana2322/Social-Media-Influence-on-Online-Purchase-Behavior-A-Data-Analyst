"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Users, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"
import { simpleOverview } from "@/lib/mock-data-simple"
import { useLanguage } from "@/i18n/LanguageProvider"

const iconMap = {
  Users: Users,
  TrendingUp: TrendingUp,
  DollarSign: DollarSign,
}

export function SimpleOverview() {
  const { language } = useLanguage()
  const isVi = language === "vi"

  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {simpleOverview.map((stat) => {
        const Icon = iconMap[stat.icon as keyof typeof iconMap] || Users
        return (
          <Card key={stat.title} className="rounded-2xl shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {isVi ? stat.titleVi : stat.title}
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
              </div>
              <p className="text-sm text-muted-foreground mt-3 pt-3 border-t">
                {isVi ? stat.insightVi : stat.insight}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
