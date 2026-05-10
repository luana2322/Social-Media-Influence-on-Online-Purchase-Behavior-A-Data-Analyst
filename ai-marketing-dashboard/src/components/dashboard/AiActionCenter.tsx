"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap, Mail, Megaphone, TrendingUp } from "lucide-react"
import { useLanguage } from "@/i18n/LanguageProvider"

export function AiActionCenter() {
  const { t, language } = useLanguage()
  const isVi = language === "vi"

  return (
    <Card className="rounded-2xl shadow-lg border-2 border-red-200 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30">
      <CardContent className="p-6">
        {/* Urgent badge */}
        <div className="flex items-center gap-2 mb-4">
          <Badge className="rounded-full bg-red-500 text-white px-4 py-1.5 text-sm font-semibold animate-pulse">
            <Zap className="h-4 w-4 mr-1" />
            {t("actionCenterTitle")}
          </Badge>
        </div>

        {/* Main headline */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          {t("actionCenterHeadline").replace("{count}", "17,500")}
        </h2>

        {/* Body */}
        <p className="text-lg text-muted-foreground mb-6">
          {t("actionCenterBody")}
        </p>

        {/* Expected impact */}
        <div className="flex items-center gap-3 p-4 bg-white/80 dark:bg-gray-900/50 rounded-xl mb-6 border border-green-200">
          <TrendingUp className="h-6 w-6 text-green-600 shrink-0" />
          <div>
            <p className="text-lg font-semibold text-green-700">
              {isVi ? "💰 Tác động dự kiến: +$324,000 doanh thu trong 14 ngày nếu hành động hôm nay." : "💰 Expected impact: +$324,000 in revenue within 14 days if you act today."}
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <Button size="lg" className="rounded-2xl flex-1 bg-red-600 hover:bg-red-700 text-white h-14 text-lg">
            <Mail className="h-5 w-5 mr-2" />
            {t("actionCenterCtaEmail")}
          </Button>
          <Button size="lg" variant="outline" className="rounded-2xl flex-1 h-14 text-lg border-2">
            <Megaphone className="h-5 w-5 mr-2" />
            {t("actionCenterCtaAd")}
          </Button>
        </div>

        {/* Microcopy */}
        <p className="text-sm text-muted-foreground italic">
          {t("actionCenterMicrocopy")}
        </p>
      </CardContent>
    </Card>
  )
}
