"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EngagementScatterChart, SentimentLineChart } from "@/components/Charts"
import { Lightbulb } from "lucide-react"

export function BehaviorInsights() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Engagement vs Purchase Probability</CardTitle>
        </CardHeader>
        <CardContent>
          <EngagementScatterChart />
          <div className="mt-4 p-4 bg-accent/50 rounded-2xl">
            <div className="flex items-start gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground">
                Strong correlation: Users with engagement score &gt;60% have 3x higher purchase probability.
                Focus on increasing page views and session duration.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Sentiment vs Conversion Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <SentimentLineChart />
          <div className="mt-4 p-4 bg-accent/50 rounded-2xl">
            <div className="flex items-start gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground">
                Sentiment score &gt;70% drives 55%+ conversion. Address negative sentiment early
                with proactive customer support and satisfaction surveys.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
