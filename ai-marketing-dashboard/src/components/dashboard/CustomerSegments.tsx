"use client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Zap, Mail, Eye } from "lucide-react"
import { useLanguage } from "@/i18n/LanguageProvider"

const iconMap = {
  hot: Zap,
  warm: Mail,
  cold: Eye,
}

export function CustomerSegments() {
  const { t } = useLanguage()

  const segments = [
    {
      type: "hot" as const,
      name: t("segmentHot"),
      count: "17,500",
      pct: "35%",
      color: "#ef4444",
      bgColor: "bg-red-50 dark:bg-red-950/30",
      borderColor: "border-red-200",
      behavior: t("segmentHotBehavior"),
      why: t("segmentHotWhy"),
      action: t("segmentHotAction"),
      cta: t("segmentHotCta"),
    },
    {
      type: "warm" as const,
      name: t("segmentWarm"),
      count: "22,500",
      pct: "45%",
      color: "#eab308",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/30",
      borderColor: "border-yellow-200",
      behavior: t("segmentWarmBehavior"),
      why: t("segmentWarmWhy"),
      action: t("segmentWarmAction"),
      cta: t("segmentWarmCta"),
    },
    {
      type: "cold" as const,
      name: t("segmentCold"),
      count: "10,000",
      pct: "20%",
      color: "#6b7280",
      bgColor: "bg-gray-50 dark:bg-gray-950/30",
      borderColor: "border-gray-200",
      behavior: t("segmentColdBehavior"),
      why: t("segmentColdWhy"),
      action: t("segmentColdAction"),
      cta: t("segmentColdCta"),
    },
  ]

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{t("customerSegmentsTitle")}</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {segments.map((seg) => {
          const Icon = iconMap[seg.type]
          return (
            <Card key={seg.type} className={`rounded-2xl shadow-sm ${seg.bgColor} ${seg.borderColor} border`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold">{seg.name}</span>
                  <span className="text-2xl font-bold" style={{ color: seg.color }}>{seg.pct}</span>
                </div>
                <p className="text-3xl font-bold" style={{ color: seg.color }}>
                  {seg.count}
                  <span className="text-sm font-normal text-muted-foreground ml-2">users</span>
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* What they're doing */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                    They're doing:
                  </p>
                  <p className="text-sm">{seg.behavior}</p>
                </div>

                {/* Why it matters */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                    Why it matters:
                  </p>
                  <p className="text-sm font-medium text-foreground">{seg.why}</p>
                </div>

                {/* Action */}
                <div className="pt-3 border-t">
                  <p className="text-xs font-semibold mb-2 text-foreground">
                    👉 Action:
                  </p>
                  <Button
                    className="w-full rounded-2xl"
                    style={{ backgroundColor: seg.color, color: "#fff" }}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {seg.action}
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
