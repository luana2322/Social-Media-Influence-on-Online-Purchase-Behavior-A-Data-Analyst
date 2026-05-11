"use client"

import { Sparkles, TrendingUp, Users, DollarSign } from "lucide-react"

const insights = [
  { icon: TrendingUp, text: "Người dùng TikTok chuyển đổi tốt hơn 31% sau 8PM", color: "text-yellow-500" },
  { icon: Users, text: "Khách quay lại mua gấp 3 lần", color: "text-blue-500" },
  { icon: DollarSign, text: "Email marketing mang lại $4.20 cho mỗi $1 chi tiêu", color: "text-green-500" },
]

export default function DemoPreview() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Xem AI hoạt động</h2>
          <p className="text-muted-foreground mt-2">
            Tải dữ liệu và nhận thông tin ngay
          </p>
        </div>

        <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 border-b bg-accent/30">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />
            </div>
            <span className="text-xs text-muted-foreground ml-2">AI Marketing Copilot — Xem trước</span>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Ý định cao", value: "17,500", change: "+12%" },
                { label: "Doanh thu dự kiến", value: "$2.4M", change: "+22%" },
                { label: "Tỷ lệ chuyển đổi", value: "35%", change: "+8%" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl bg-accent/50 p-4">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className="text-xs text-green-600 mt-1">{stat.change} so với đợt trước</p>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              {insights.map((insight, i) => {
                const Icon = insight.icon
                return (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-accent/30">
                    <Icon className={`h-5 w-5 mt-0.5 ${insight.color}`} />
                    <p className="text-sm">{insight.text}</p>
                  </div>
                )
              })}
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-violet-600 font-medium pt-2">
              <Sparkles className="h-4 w-4" />
              Độ chính xác AI: 95.7%
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
