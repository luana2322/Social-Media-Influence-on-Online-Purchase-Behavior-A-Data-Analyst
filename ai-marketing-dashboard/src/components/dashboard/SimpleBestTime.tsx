"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Sun, Moon } from "lucide-react"
import { bestTimeData } from "@/lib/mock-data-simple"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/i18n/LanguageProvider"

const levelColor = {
  low: "bg-gray-100 text-gray-500",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-orange-100 text-orange-700",
  highest: "bg-red-100 text-red-700",
}

export function SimpleBestTime() {
  const { t } = useLanguage()

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          {t("bestTimeToSell")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4 p-4 bg-red-50 rounded-2xl">
          <div className="h-12 w-12 rounded-2xl bg-red-100 flex items-center justify-center">
            <Moon className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t("bestTimeToSell")}</p>
            <p className="text-2xl font-bold text-red-600">{bestTimeData.bestHourVi}</p>
            <p className="text-sm text-red-600">{bestTimeData.peakConversion} {t("conversionRate")}</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold mb-3">{t("conversionByTime")}</p>
          <div className="space-y-2">
            {bestTimeData.timeSlots.map((slot) => (
              <div key={slot.time} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-16">{slot.timeVi}</span>
                <div className="flex-1 bg-accent rounded-full h-6 relative">
                  <div
                    className={`h-6 rounded-full ${
                      slot.level === "highest" ? "bg-red-500" :
                      slot.level === "high" ? "bg-orange-400" :
                      slot.level === "medium" ? "bg-yellow-400" : "bg-gray-300"
                    }`}
                    style={{ width: slot.conversion }}
                  />
                </div>
                <Badge className={`rounded-2xl text-xs ${levelColor[slot.level as keyof typeof levelColor]}`}>
                  {slot.conversion}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-accent/50 rounded-2xl">
          <p className="text-sm font-medium">{t("recommendation")}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {t("runAdsEvening")}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
