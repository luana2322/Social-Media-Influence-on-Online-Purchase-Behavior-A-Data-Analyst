"use client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { TrendingUp, Users, DollarSign } from "lucide-react"
import { useLanguage } from "@/i18n/LanguageProvider"

const iconMap = {
  Users: Users,
  TrendingUp: TrendingUp,
  DollarSign: DollarSign,
}

export function BusinessOverview() {
  const { t, language } = useLanguage()
  const isVi = language === "vi"

  const metrics = [
    {
      icon: "Users",
      title: t("totalUsers"),
      value: "50,000",
      change: "+12%",
      status: isVi ? "Tuyệt!" : "Great!",
      statusColor: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/30",
      borderColor: "border-green-200",
      explanation: isVi ? "Bạn đã phân tích nhiều khách hàng hơn tháng trước" : "You've analyzed more customers than last month",
      microcopy: isVi ? "Nhiều khách hàng = Nhiều cơ hội" : "More customers = More opportunities",
    },
    {
      icon: "TrendingUp",
      title: t("readyToBuy"),
      value: "17,500",
      subvalue: "(35%)",
      change: "+8%",
      status: isVi ? "Xuất sắc!" : "Excellent!",
      statusColor: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-950/30",
      borderColor: "border-red-200",
      explanation: isVi ? "35% người dùng sẵn sàng mua ngay bây giờ" : "35% of users are ready to buy right now",
      microcopy: isVi ? "Họ sẽ mua trong 48 giờ" : "They'll likely buy in 48 hours",
    },
    {
      icon: "DollarSign",
      title: t("estRevenue"),
      value: "$2.4M",
      change: "+22%",
      status: isVi ? "Mạnh mẽ!" : "Strong!",
      statusColor: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
      borderColor: "border-blue-200",
      explanation: isVi ? "Nhiều hơn $680K so với tháng trước" : "$680K more potential than last month",
      microcopy: isVi ? "Hành động ngay để nắm bắt cơ hội" : "Act now to capture this revenue",
    },
  ]

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{t("businessOverview")}</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {metrics.map((metric) => {
          const Icon = iconMap[metric.icon as keyof typeof iconMap] || Users
          return (
            <Card key={metric.title} className={`rounded-2xl shadow-sm ${metric.bgColor} ${metric.borderColor} border`}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">{metric.title}</span>
                  <Icon className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-bold">{metric.value}</span>
                  {metric.subvalue && <span className="text-lg text-muted-foreground">{metric.subvalue}</span>}
                </div>
                <div className="flex items-center gap-1 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-green-600">{metric.change}</span>
                  <span className={`text-sm font-semibold ${metric.statusColor} ml-2`}>{metric.status}</span>
                </div>
                <p className="text-sm text-muted-foreground">{metric.explanation}</p>
                <p className="text-xs text-muted-foreground mt-2 italic">{metric.microcopy}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
