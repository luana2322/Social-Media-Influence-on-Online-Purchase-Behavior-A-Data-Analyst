"use client"
import { Card, CardContent } from "@/components/ui/card"
import { aiSuggestions } from "@/lib/mock-data-simple"
import { Button } from "@/components/ui/button"
import { Lightbulb, ArrowRight, Zap, TrendingUp, Clock } from "lucide-react"
import { useLanguage } from "@/i18n/LanguageProvider"

const iconMap = {
  "🎯": Lightbulb,
  "📈": TrendingUp,
  "⏰": Clock,
}

const textKeyMap: Record<string, string> = {
  "Focus on 17,500 ready-to-buy customers today": "focusReadyCustomers",
  "Interested customers need follow-up content": "needFollowUp",
  "Evening promotions get 48% more sales": "eveningPromotions",
}

const actionKeyMap: Record<string, string> = {
  "Send flash sale emails now": "sendFlashSale",
  "Start 5-day email nurture series": "startEmailSeries",
  "Schedule ads for 7-9 PM": "scheduleAds",
}

export function SimpleAISuggestions() {
  const { t } = useLanguage()

  return (
    <Card className="rounded-2xl shadow-sm border-l-4 border-l-yellow-400 bg-yellow-50/50">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          <h3 className="font-semibold text-lg">{t("aiSuggestions")}</h3>
        </div>
        <div className="space-y-3">
          {aiSuggestions.map((suggestion, index) => {
            const Icon = iconMap[suggestion.emoji as keyof typeof iconMap] || Lightbulb
            return (
              <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-white border">
                <div className="h-10 w-10 rounded-2xl bg-yellow-100 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{t(textKeyMap[suggestion.text] || suggestion.text)}</p>
                  <Button size="sm" variant="outline" className="mt-2 rounded-2xl">
                    {t(actionKeyMap[suggestion.action] || suggestion.action)}
                    <ArrowRight className="h-3 w-3 ml-2" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
