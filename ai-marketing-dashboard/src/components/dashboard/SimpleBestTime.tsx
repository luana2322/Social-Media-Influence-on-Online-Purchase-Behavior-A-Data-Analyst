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
  const { language } = useLanguage()
  const isVi = language === "vi"

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          {isVi ? "Thời điểm bán hàng tốt nhất" : "Best Time to Sell"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4 p-4 bg-red-50 rounded-2xl">
          <div className="h-12 w-12 rounded-2xl bg-red-100 flex items-center justify-center">
            <Moon className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{isVi ? "Thời điểm bán hàng tốt nhất" : "Best time to sell"}</p>
            <p className="text-2xl font-bold text-red-600">{isVi ? bestTimeData.bestHourVi : bestTimeData.bestHour}</p>
            <p className="text-sm text-red-600">{bestTimeData.peakConversion} {isVi ? "tỷ lệ chuyển đổi" : "conversion rate"}</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold mb-3">{isVi ? "Chuyển đổi theo thời gian:" : "Conversion by time:"}</p>
          <div className="space-y-2">
            {bestTimeData.timeSlots.map((slot) => (
              <div key={slot.time} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-16">{isVi ? slot.timeVi : slot.time}</span>
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
          <p className="text-sm font-medium">{isVi ? "💡 Đề xuất:" : "💡 Recommendation:"}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {isVi
              ? "Chạy quảng cáo và gửi email từ 7-9 tối khi khách hàng có nhiều khả năng mua nhất."
              : "Run ads and send emails between 7-9 PM when customers are most likely to buy."}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
