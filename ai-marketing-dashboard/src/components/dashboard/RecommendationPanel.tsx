"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { recommendations } from "@/lib/mock-data"
import { Zap, ArrowRight, Target, Mail, Bell } from "lucide-react"
import { useLanguage } from "@/i18n/LanguageProvider"

const impactColorMap = {
  High: "bg-red-100 text-red-700 border-red-200",
  Medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Low: "bg-green-100 text-green-700 border-green-200",
}

const iconMap = {
  Zap: Zap,
  Target: Target,
  Mail: Mail,
  Bell: Bell,
}

const recTitleMap: Record<string, string> = {
  "Target High-Intent with Flash Sale": "rec1Title",
  "Nurture Medium-Intent via Content": "rec2Title",
  "Optimize Email Channel Budget": "rec3Title",
  "Evening Push Notification Campaign": "rec4Title",
}

const recDescMap: Record<string, string> = {
  "17,500 users with ≥80% purchase probability are ready to buy. Send limited-time 24h discount offer via email and SMS.": "rec1Desc",
  "22,500 medium-intent users need persuasion. Deploy 5-email educational series with customer testimonials and product demos.": "rec2Desc",
  "Email has 28% conversion rate (highest). Reallocate 30% of paid ads budget to email marketing automation tools.": "rec3Desc",
  "Peak conversion at 8-9 PM (48%). Schedule app push notifications and social media ads during 7-9 PM window.": "rec4Desc",
}

export function RecommendationPanel() {
  const { t } = useLanguage()
  const sorted = [...recommendations].sort((a, b) => a.priority - b.priority)

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          {t("actionableRecommendations")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {sorted.map((rec) => (
            <Card key={rec.id} className="rounded-xl border-l-4" style={{ borderLeftColor: rec.expectedImpact === "High" ? "#ef4444" : rec.expectedImpact === "Medium" ? "#eab308" : "#22c55e" }}>
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-sm">{t(recTitleMap[rec.title] || rec.title)}</h4>
                  <Badge className={`rounded-2xl shrink-0 ${impactColorMap[rec.expectedImpact]}`}>
                    {t(rec.expectedImpact === "High" ? "highImpact" : rec.expectedImpact === "Medium" ? "mediumImpact" : "lowImpact")}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{t(recDescMap[rec.description] || rec.description)}</p>
                <div className="flex items-center gap-2 pt-2 border-t">
                  {rec.segment && (
                    <Badge variant="outline" className="rounded-2xl text-xs">
                      {t("segmentLabel")}: {t(rec.segment === "High" ? "highSegment" : rec.segment === "Medium" ? "mediumSegment" : "lowSegment")}
                    </Badge>
                  )}
                  {rec.channel && (
                    <Badge variant="outline" className="rounded-2xl text-xs">
                      {t("channelLabel")}: {rec.channel}
                    </Badge>
                  )}
                </div>
                <Button size="sm" variant="outline" className="w-full rounded-2xl mt-2">
                  {t("applyStrategy")}
                  <ArrowRight className="h-3 w-3 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
