"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TimeAnalysisLineChart } from "@/components/Charts"
import { timeDataHourly } from "@/lib/mock-data"
import { Clock, Lightbulb } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function TimeAnalysis() {
  const peakHour = [...timeDataHourly].sort((a, b) => b.conversionRate - a.conversionRate)[0]
  const bestHours = timeDataHourly
    .filter(h => h.conversionRate >= 0.4)
    .map(h => `${h.hour}:00`)
    .join(", ")

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Time Analysis (Hourly Conversion)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TimeAnalysisLineChart />
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className="rounded-2xl bg-green-100 text-green-700">
              Peak: {peakHour.hour}:00 ({(peakHour.conversionRate * 100).toFixed(0)}%)
            </Badge>
            <Badge className="rounded-2xl bg-blue-100 text-blue-700">
              Best Window: {bestHours}
            </Badge>
          </div>
          <div className="p-4 bg-accent/50 rounded-2xl">
            <div className="flex items-start gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground">
                Evening hours (6-9 PM) show peak conversion rates up to 48%.
                Schedule email campaigns and push notifications for 7-9 PM window.
                Avoid 2-5 AM when conversion drops below 5%.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
