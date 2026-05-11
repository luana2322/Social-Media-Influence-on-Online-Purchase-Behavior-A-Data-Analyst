"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Flame, Star, Snowflake, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { audienceSegments } from "@/lib/mock-data"

const iconMap: Record<string, typeof Flame> = {
  flame: Flame,
  star: Star,
  snowflake: Snowflake,
}

const actionLabels: Record<string, string> = {
  hot: "Hành động ngay",
  warm: "Nuôi dưỡng",
  cold: "Tương tác",
}

export function AudienceSegments() {
  return (
    <Card className="rounded-2xl border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Phân khúc khách hàng
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-3">
          {audienceSegments.map((seg) => {
            const Icon = iconMap[seg.icon] || Flame
            return (
              <div key={seg.id} className={cn("rounded-xl border p-5 space-y-4", seg.bgColor)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5" style={{ color: seg.color }} />
                    <h4 className="font-semibold">{seg.name}</h4>
                  </div>
                  <span className="text-2xl font-bold">{seg.percentage}%</span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{seg.description}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-sm font-medium">{seg.count.toLocaleString()} người dùng</span>
                  <Button size="sm" variant="outline" className="rounded-xl text-xs h-8">
                    {actionLabels[seg.id] || "Tương tác"}
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
