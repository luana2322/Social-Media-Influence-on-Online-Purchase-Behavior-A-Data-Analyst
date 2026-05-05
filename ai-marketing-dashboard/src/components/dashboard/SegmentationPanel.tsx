"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { enhancedSegmentationData } from "@/lib/mock-data"
import { Users, ArrowRight, Zap, TrendingUp, Eye } from "lucide-react"

const iconMap = {
  "High (≥0.8)": Zap,
  "Medium (0.71-0.8)": TrendingUp,
  "Low (<0.71)": Eye,
}

export function SegmentationPanel() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Customer Segments</h3>
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
                    {segment.name}
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
                <p className="text-xs text-muted-foreground">{segment.description}</p>
                <div className="pt-2 border-t">
                  <p className="text-xs font-medium mb-2">Recommended Action:</p>
                  <Button size="sm" className="w-full rounded-2xl" variant="outline">
                    {segment.recommendedAction}
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
