"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { enhancedSegmentationData } from "@/lib/mock-data"
import { Users, ArrowRight, Zap, TrendingUp, Eye } from "lucide-react"
import { useLanguage } from "@/i18n/LanguageProvider"

const iconMap = {
  "High (≥0.8)": Zap,
  "Medium (0.71-0.8)": TrendingUp,
  "Low (<0.71)": Eye,
}

const descKeyMap: Record<string, string> = {
  "Users with very high purchase intent. Typically visited 5+ pages, spent 10+ mins, high sentiment.": "highDesc",
  "Interested users who need a nudge. Moderate engagement, positive sentiment, comparison shopping.": "mediumDesc",
  "Low intent users. May be browsing, first-time visitors, or have low engagement scores.": "lowDesc",
}

const actionKeyMap: Record<string, string> = {
  "Send immediate discount or limited-time offer": "sendImmediateDiscount",
  "Nurture with educational content and social proof": "nurtureWithContent",
  "Retargeting ads and brand awareness campaigns": "retargetingAds",
}

export function SegmentationPanel() {
  const { t } = useLanguage()

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{t("customerSegments")}</h3>
      <div className="grid gap-4 sm:grid-cols-3">
        {enhancedSegmentationData.map((segment) => {
          const Icon = iconMap[segment.name as keyof typeof iconMap] || Users
          return (
            <Card key={segment.name} className="rounded-2xl shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge
                    className="rounded-2xl"
                    style={{ backgroundColor: segment.fill, color: "#fff" }}
                  >
                    {t(segment.name === "High (≥0.8)" ? "highSegment" : segment.name === "Medium (0.71-0.8)" ? "mediumSegment" : "lowSegment")}
                  </Badge>
                  <Icon className="h-4 w-4" style={{ color: segment.fill }} />
                </div>
                <CardTitle className="text-2xl">
                  {segment.count.toLocaleString()}
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    ({segment.value}%)
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground">{t(descKeyMap[segment.description] || segment.description)}</p>
                <div className="pt-2 border-t">
                  <p className="text-xs font-medium mb-2">{t("recommendedAction")}</p>
                  <Button size="sm" className="w-full rounded-2xl" variant="outline">
                    {t(actionKeyMap[segment.recommendedAction] || segment.recommendedAction)}
                    <ArrowRight className="h-3 w-3 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
