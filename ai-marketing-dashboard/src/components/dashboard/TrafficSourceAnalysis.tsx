"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrafficSourceBarChart } from "@/components/Charts"
import { trafficSourceData } from "@/lib/mock-data"
import { Lightbulb, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function TrafficSourceAnalysis() {
  const bestChannel = [...trafficSourceData].sort((a, b) => b.conversionRate - a.conversionRate)[0]
  const worstChannel = [...trafficSourceData].sort((a, b) => a.conversionRate - b.conversionRate)[0]

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Traffic Source Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TrafficSourceBarChart />
        <div className="mt-6 space-y-4">
          <div className="p-4 bg-accent/50 rounded-2xl">
            <div className="flex items-start gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{bestChannel.source}</span> performs best
                  with {(bestChannel.conversionRate * 100).toFixed(0)}% conversion rate.
                  Allocate 40% more budget here for maximum ROI.
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{worstChannel.source}</span> underperforms
                  at {(worstChannel.conversionRate * 100).toFixed(0)}%. Consider pausing or optimizing campaigns.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {trafficSourceData.map((source) => (
              <div key={source.source} className="p-3 rounded-xl bg-accent/30 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{source.source}</span>
                  <Badge variant={source.conversionRate > 0.2 ? "default" : "secondary"} className="rounded-2xl text-xs">
                    {(source.conversionRate * 100).toFixed(0)}%
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{source.count.toLocaleString()} visitors</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
