"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { whyCustomersBuy } from "@/lib/mock-data-simple"
import { TrendingUp, Clock, ThumbsUp, Repeat, Smartphone } from "lucide-react"
import { useLanguage } from "@/i18n/LanguageProvider"

const iconMap = {
  "More site activity": TrendingUp,
  "Longer visits": Clock,
  "Positive feedback": ThumbsUp,
  "Repeat visitors": Repeat,
  "Mobile-friendly": Smartphone,
}

const reasonKeyMap: Record<string, string> = {
  "More site activity": "moreSiteActivity",
  "Longer visits": "longerVisits",
  "Positive feedback": "positiveFeedback",
  "Repeat visitors": "repeatVisitors",
  "Mobile-friendly": "mobileFriendly",
}

const descKeyMap: Record<string, string> = {
  "Customers who click more and visit more pages buy 3x more": "clickMoreBuy3x",
  "Customers who stay 10+ minutes are very likely to purchase": "stay10Min",
  "Customers with good experience buy 2x more than unhappy ones": "goodExperience2x",
  "Customers who bought before are easier to sell to again": "boughtBefore",
  "Customers on mobile devices convert well with simple checkout": "mobileConvert",
}

const impactKeyMap: Record<string, string> = {
  High: "highImpact",
  Medium: "mediumImpact",
  Low: "lowImpact",
}

export function SimpleWhyTheyBuy() {
  const { t } = useLanguage()

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle>{t("whyCustomersBuy")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {whyCustomersBuy.map((item) => {
            const Icon = iconMap[item.reason as keyof typeof iconMap] || TrendingUp
            return (
              <div key={item.reason} className="flex items-start gap-4 p-4 rounded-xl bg-accent/30">
                <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm">{t(reasonKeyMap[item.reason] || item.reason)}</h4>
                    <Badge className={`rounded-2xl text-xs ${impactKeyMap[item.impact] ? `bg-${item.impact === "High" ? "red" : item.impact === "Medium" ? "yellow" : "green"}-100 text-${item.impact === "High" ? "red" : item.impact === "Medium" ? "yellow" : "green"}-700 border-${item.impact === "High" ? "red" : item.impact === "Medium" ? "yellow" : "green"}-200` : ""}`}>
                      {t(impactKeyMap[item.impact])}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{t(descKeyMap[item.description] || item.description)}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
