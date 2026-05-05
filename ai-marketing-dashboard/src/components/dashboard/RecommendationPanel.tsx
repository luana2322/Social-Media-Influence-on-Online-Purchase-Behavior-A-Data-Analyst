"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { recommendations } from "@/lib/mock-data"
import { Zap, ArrowRight, Target, Mail, Bell } from "lucide-react"

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

export function RecommendationPanel() {
  const sorted = [...recommendations].sort((a, b) => a.priority - b.priority)

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Actionable Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {sorted.map((rec) => (
            <Card key={rec.id} className="rounded-xl border-l-4" style={{ borderLeftColor: rec.expectedImpact === "High" ? "#ef4444" : rec.expectedImpact === "Medium" ? "#eab308" : "#22c55e" }}>
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-sm">{rec.title}</h4>
                  <Badge className={`rounded-2xl shrink-0 ${impactColorMap[rec.expectedImpact]}`}>
                    {rec.expectedImpact} Impact
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{rec.description}</p>
                <div className="flex items-center gap-2 pt-2 border-t">
                  {rec.segment && (
                    <Badge variant="outline" className="rounded-2xl text-xs">
                      {rec.segment} Segment
                    </Badge>
                  )}
                  {rec.channel && (
                    <Badge variant="outline" className="rounded-2xl text-xs">
                      {rec.channel} Channel
                    </Badge>
                  )}
                </div>
                <Button size="sm" variant="outline" className="w-full rounded-2xl mt-2">
                  Apply Strategy
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
