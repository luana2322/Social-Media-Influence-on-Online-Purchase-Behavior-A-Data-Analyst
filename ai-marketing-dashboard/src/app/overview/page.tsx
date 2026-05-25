"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Upload, Sparkles, BarChart3, Brain, Lightbulb, Target, TrendingUp, Users, Clock, Zap } from "lucide-react"
import { useRouter } from "next/navigation"
import { KpiCards } from "@/components/overview/KpiCards"
import { InsightsFeed } from "@/components/overview/InsightsFeed"
import { RecommendationsSection } from "@/components/overview/RecommendationsSection"
import { AudienceSegments } from "@/components/overview/AudienceSegments"
import { ExportButton } from "@/components/export/ExportButton"

const workflowSteps = [
  { icon: Upload, title: "Tải dữ liệu", desc: "Tải CSV khách hàng, chiến dịch hoặc dữ liệu mạng xã hội" },
  { icon: Brain, title: "AI phân tích", desc: "AI xử lý hàng ngàn bản ghi để tìm mẫu hình hành vi" },
  { icon: BarChart3, title: "Dự đoán ý định", desc: "AI xác định khách hàng nào có khả năng mua cao nhất" },
  { icon: Lightbulb, title: "Đề xuất thông minh", desc: "AI đưa ra đề xuất marketing có thể hành động ngay" },
  { icon: TrendingUp, title: "Tối ưu chiến lược", desc: "Áp dụng đề xuất để tăng chuyển đổi và doanh thu" },
]

const exampleInsights = [
  { icon: TrendingUp, text: "Khách từ quảng cáo TikTok chuyển đổi tốt hơn 31% sau 8PM", color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-950/20" },
  { icon: Users, text: "Khách quay lại có ý định mua hàng cao gấp 3 lần khách mới", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/20" },
  { icon: Clock, text: "Khung giờ tối 7-9 PM chiếm 48% tổng lượng chuyển đổi", color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950/20" },
  { icon: Target, text: "Email marketing có ROI cao nhất — $4.20 cho mỗi $1 chi tiêu", color: "text-green-500", bg: "bg-green-50 dark:bg-green-950/20" },
]

export default function OverviewPage() {
  const router = useRouter()

  return (
    <div id="print-overview" className="flex flex-col gap-8">
      <div className="flex justify-end no-print">
        <ExportButton targetId="print-overview" fileName="tong-quan-marketing" />
      </div>

      {/* Demo Banner */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20 p-5 flex items-start gap-4">
        <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center shrink-0">
          <Sparkles className="h-5 w-5 text-amber-600" />
        </div>
        <div>
          <p className="font-semibold text-amber-800 dark:text-amber-300">Dữ liệu demo — không phải phân tích thật</p>
          <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
            Các thông tin bên dưới là dữ liệu mẫu để trình bày. Tải dữ liệu thật của bạn để nhận phân tích AI cá nhân hóa và đề xuất hành động cụ thể.
          </p>
          <Button
            size="sm"
            className="mt-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white"
            onClick={() => router.push("/analyze")}
          >
            Tải dữ liệu ngay <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </div>

      {/* Hero Welcome */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 p-8 sm:p-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative">
          <h1 className="text-3xl sm:text-4xl font-bold text-white max-w-2xl">
            Tải dữ liệu marketing, AI sẽ tìm ai sẽ mua hàng
          </h1>
          <p className="text-violet-100 mt-3 text-lg max-w-xl">
            Phân tích hành vi khách hàng, dự đoán ý định mua và nhận đề xuất marketing có thể hành động ngay.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Button
              size="lg"
              className="rounded-xl bg-white text-violet-700 hover:bg-violet-50 shadow-lg text-base"
              onClick={() => router.push("/analyze")}
            >
              <Upload className="h-4 w-4 mr-2" />
              Tải dữ liệu
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-xl border-white/30 text-white hover:bg-white/10 text-base"
              onClick={() => router.push("/analyze")}
            >
              Dùng thử phân tích AI
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* AI Workflow */}
      <Card className="rounded-2xl border-0 shadow-sm">
        <CardContent className="pt-8 pb-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold tracking-tight">Cách AI Marketing Copilot hoạt động</h2>
            <p className="text-muted-foreground mt-2">Từ dữ liệu thô đến chiến lược hành động — trong vài phút</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-5">
            {workflowSteps.map((step, i) => {
              const Icon = step.icon
              return (
                <div key={i} className="text-center">
                  <div className="relative mx-auto h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-violet-950/30 dark:to-fuchsia-950/30 flex items-center justify-center mb-3">
                    <Icon className="h-6 w-6 text-violet-600" />
                    <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-violet-500 text-white text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </div>
                  </div>
                  <h3 className="font-semibold text-sm">{step.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{step.desc}</p>
                </div>
              )
            })}
          </div>
          <div className="text-center mt-8">
            <Button
              className="rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-600 hover:to-fuchsia-600"
              onClick={() => router.push("/analyze")}
            >
              Bắt đầu phân tích <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Demo Insights — wrapped in muted section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-amber-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Dữ liệu mẫu — không phải dữ liệu thật</span>
        </div>
        <div className="opacity-80">
          <KpiCards />
        </div>
        <div className="opacity-80">
          <AudienceSegments />
        </div>
        <div className="opacity-80">
          <InsightsFeed />
        </div>
      </div>

      {/* AI Recommendations Preview */}
      <Card className="rounded-2xl border-0 shadow-sm">
        <CardContent className="pt-8 pb-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-950/30 text-xs font-medium text-violet-600 mb-3">
              <Sparkles className="h-3 w-3" />
              Ví dụ đề xuất AI
            </div>
            <h2 className="text-2xl font-bold tracking-tight">AI có thể tạo ra những thông tin như thế này</h2>
            <p className="text-muted-foreground mt-2">Sau khi tải dữ liệu, AI sẽ phân tích và đưa ra đề xuất cụ thể</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {exampleInsights.map((item, i) => {
              const Icon = item.icon
              return (
                <div key={i} className={`flex items-start gap-3 p-4 rounded-xl ${item.bg} border`}>
                  <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${item.color}`} />
                  <p className="text-sm">{item.text}</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations demo */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-amber-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ví dụ đề xuất AI — dữ liệu mẫu</span>
        </div>
        <div className="opacity-80">
          <RecommendationsSection />
        </div>
      </div>

      {/* Next Actions */}
      <Card className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-violet-950/20 dark:to-fuchsia-950/20">
        <CardContent className="pt-8 pb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight">Sẵn sàng phân tích dữ liệu thật?</h2>
          <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
            AI Marketing Copilot sẽ phân tích dữ liệu của bạn và trả lời: ai sẽ mua? kênh nào hiệu quả nhất? nên hành động thế nào?
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <Button
              size="lg"
              className="rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-600 hover:to-fuchsia-600 shadow-lg shadow-violet-200 dark:shadow-violet-900/30"
              onClick={() => router.push("/analyze")}
            >
              <Upload className="h-4 w-4 mr-2" />
              Tải dữ liệu ngay
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-xl"
              onClick={() => router.push("/overview")}
            >
              Xem tổng quan
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
