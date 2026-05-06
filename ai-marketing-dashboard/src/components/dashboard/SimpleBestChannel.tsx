"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { channelPerformance } from "@/lib/mock-data-simple"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Mail, MessageCircle, Search, Megaphone } from "lucide-react"
import { useLanguage } from "@/i18n/LanguageProvider"

const iconMap = {
  "📧 Email": Mail,
  "📱 Social Media": MessageCircle,
  "🔍 Search": Search,
  "📢 Ads": Megaphone,
  "👥 Referral": TrendingUp,
}

const channelKeyMap: Record<string, string> = {
  "📧 Email": "email",
  "📱 Social Media": "socialMedia",
  "🔍 Search": "search",
  "📢 Ads": "ads",
  "👥 Referral": "referral",
}

const recKeyMap: Record<string, string> = {
  "Best ROI - send more emails": "bestRoi",
  "Great for awareness": "greatAwareness",
  "Good for active seekers": "goodSeekers",
  "Needs optimization": "needsOptimization",
  "High quality, grow this": "highQuality",
}

export function SimpleBestChannel() {
  const { t } = useLanguage()
  const sorted = [...channelPerformance].sort((a, b) =>
    parseFloat(b.conversion) - parseFloat(a.conversion)
  )
  const best = sorted[0]

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          {t("bestChannel")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-green-50 rounded-2xl">
          <p className="text-sm text-muted-foreground">{t("bestPerformingChannel")}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl">{best.channel.split(' ')[0]}</span>
            <p className="text-2xl font-bold text-green-600">{t(channelKeyMap[best.channel.split(' ')[1]] || best.channel.split(' ')[1])}</p>
          </div>
          <p className="text-sm text-green-600 mt-1">
            {best.conversion} {t("conversionRate")} - {t(recKeyMap[best.recommendation] || best.recommendation)}
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold">{t("allChannels")}</p>
          {sorted.map((channel, index) => {
            const Icon = iconMap[channel.channel as keyof typeof iconMap] || TrendingUp
            return (
              <div key={channel.channel} className="flex items-center gap-3 p-3 rounded-xl bg-accent/30">
                <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{channel.channelVi}</span>
                    <Badge
                      className={`rounded-2xl text-xs ${
                        index === 0 ? "bg-green-100 text-green-700" :
                        index === sorted.length - 1 ? "bg-gray-100 text-gray-600" :
                        "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {channel.conversion}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{channel.count} {t("customers")}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="p-4 bg-accent/50 rounded-2xl">
          <p className="text-sm font-medium">{t("recommendation")}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {t(recKeyMap[best.recommendation] || best.recommendation)}. {t("moveMoreBudget")}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
