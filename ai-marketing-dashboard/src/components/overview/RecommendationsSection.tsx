"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Target, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { recommendations } from "@/lib/mock-data"

const impactStyles = {
  high: "border-l-violet-500 bg-gradient-to-r from-violet-50/50 to-transparent dark:from-violet-950/10",
  medium: "border-l-yellow-500 bg-gradient-to-r from-yellow-50/50 to-transparent dark:from-yellow-950/10",
}

const impactLabels: Record<string, string> = {
  high: "Tác động cao",
  medium: "Tác động trung bình",
}

export function RecommendationsSection() {
  return (
    <Card className="rounded-2xl border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-violet-500" />
          Đề xuất
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className={cn(
                "rounded-xl border border-l-4 p-5",
                impactStyles[rec.impact]
              )}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h4 className="font-semibold text-sm">{rec.title}</h4>
                <span className={cn(
                  "text-xs font-medium px-2 py-0.5 rounded-md shrink-0",
                  rec.impact === "high"
                    ? "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300"
                    : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                )}>
                  {impactLabels[rec.impact]}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{rec.description}</p>
              <Button size="sm" variant="outline" className="mt-4 rounded-xl w-full">
                {rec.cta} <ArrowRight className="h-3 w-3 ml-2" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
