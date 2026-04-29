"use client"
import { BarChartComponent, PieChartComponent } from "@/components/Charts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { segmentationData } from "@/lib/mock-data"
import { useLanguage } from "@/i18n/LanguageProvider"

export default function AnalyticsPage() {
  const { t } = useLanguage()

  const getSegmentText = (name: string): string => {
    if (name === "High") return t("high")
    if (name === "Medium") return t("medium")
    return t("low")
  }

  const getRecordCount = (name: string): string => {
    if (name === "High") return "1.2M " + t("records")
    if (name === "Medium") return "890K " + t("records")
    return "450K " + t("records")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{t("analytics")}</h1>
        <Select defaultValue="30days">
          <SelectTrigger className="w-40 rounded-2xl">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl">
            <SelectItem value="7days">{t("last7days")}</SelectItem>
            <SelectItem value="30days">{t("last30days")}</SelectItem>
            <SelectItem value="90days">{t("last90days")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {segmentationData.map((seg) => (
          <Card key={seg.name} className="rounded-2xl shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{getSegmentText(seg.name)} {t("segment")}</CardTitle>
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: seg.fill }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{seg.value}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                {getRecordCount(seg.name)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="bar" className="w-full">
        <TabsList className="rounded-2xl">
          <TabsTrigger value="bar" className="rounded-2xl">{t("barChart")}</TabsTrigger>
          <TabsTrigger value="pie" className="rounded-2xl">{t("pieChart")}</TabsTrigger>
        </TabsList>
        <TabsContent value="bar">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader><CardTitle>{t("segmentationBreakdown")}</CardTitle></CardHeader>
            <CardContent><BarChartComponent /></CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pie">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader><CardTitle>{t("segmentationDistribution")}</CardTitle></CardHeader>
            <CardContent><PieChartComponent /></CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
