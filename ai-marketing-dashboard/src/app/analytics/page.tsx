"use client"
import { BarChartComponent, PieChartComponent } from "@/components/Charts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { segmentationData } from "@/lib/mock-data"

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <Select defaultValue="30days">
          <SelectTrigger className="w-40 rounded-2xl">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl">
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="90days">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {segmentationData.map((seg) => (
          <Card key={seg.name} className="rounded-2xl shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{seg.name} Segment</CardTitle>
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: seg.fill }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{seg.value}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                {seg.name === "High" ? "1.2M records" : seg.name === "Medium" ? "890K records" : "450K records"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="bar" className="w-full">
        <TabsList className="rounded-2xl">
          <TabsTrigger value="bar" className="rounded-2xl">Bar Chart</TabsTrigger>
          <TabsTrigger value="pie" className="rounded-2xl">Pie Chart</TabsTrigger>
        </TabsList>
        <TabsContent value="bar">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader><CardTitle>Segmentation Breakdown</CardTitle></CardHeader>
            <CardContent><BarChartComponent /></CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pie">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader><CardTitle>Segmentation Distribution</CardTitle></CardHeader>
            <CardContent><PieChartComponent /></CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
