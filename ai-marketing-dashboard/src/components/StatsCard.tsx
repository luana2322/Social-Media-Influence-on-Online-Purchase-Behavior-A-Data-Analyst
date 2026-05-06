"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Brain, Database, TrendingUp as TrendingUpIcon, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/i18n/LanguageProvider"

const iconMap = {
  Brain: Brain,
  Database: Database,
  TrendingUp: TrendingUpIcon,
  Users: Users,
}

export function StatsCard({ title, value, icon, change, changeType }: {
  title: string
  value: string
  icon: string
  change: string
  changeType: string
}) {
  const { t } = useLanguage()
  const Icon = iconMap[icon as keyof typeof iconMap]
  return (
    <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {t(title)}
        </CardTitle>
        <Icon className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center gap-1 mt-2">
          {changeType === "positive" ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
          <span className={cn("text-xs font-medium",
            changeType === "positive" ? "text-green-500" : "text-red-500"
          )}>
            {change}
          </span>
          <span className="text-xs text-muted-foreground ml-1">{t("vsLastMonth")}</span>
        </div>
      </CardContent>
    </Card>
  )
}
