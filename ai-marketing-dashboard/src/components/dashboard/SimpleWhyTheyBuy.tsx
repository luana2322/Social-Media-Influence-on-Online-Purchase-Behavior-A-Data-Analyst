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

const impactColor = {
  High: "bg-red-100 text-red-700 border-red-200",
  Medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Low: "bg-green-100 text-green-700 border-green-200",
}

export function SimpleWhyTheyBuy() {
  const { language } = useLanguage()
  const isVi = language === "vi"

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle>{isVi ? "Tại sao khách hàng mua" : "Why Customers Buy"}</CardTitle>
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
                    <h4 className="font-semibold text-sm">{isVi ? item.reasonVi : item.reason}</h4>
                    <Badge className={`rounded-2xl text-xs ${impactColor[item.impact as keyof typeof impactColor]}`}>
                      {item.impact} Impact
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{isVi ? item.descriptionVi : item.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
