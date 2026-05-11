"use client"

import { Bot, Sparkles, Search, Target } from "lucide-react"

const sections = [
  { icon: Search, label: "Thông tin", color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-950/20", content: "Người dùng TikTok chuyển đổi tốt hơn 31% sau 8PM" },
  { icon: Target, label: "Chiến lược", color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950/20", content: "Chuyển 40% ngân sách quảng cáo buổi sáng sang khung giờ 7-9 PM." },
  { icon: Sparkles, label: "Đề xuất", color: "text-green-500", bg: "bg-green-50 dark:bg-green-950/20", content: "Chạy flash sale Thứ Tư lúc 8PM nhắm khách nóng." },
]

export default function ChatbotPreview() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Hỏi dữ liệu như ChatGPT</h2>
          <p className="text-muted-foreground mt-2">
            Nhận thông tin, giải thích, chiến lược và đề xuất
          </p>
        </div>

        <div className="rounded-2xl border bg-card shadow-sm overflow-hidden max-w-2xl mx-auto">
          <div className="flex items-center gap-2 px-5 py-3 border-b bg-accent/30">
            <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
            <span className="text-sm font-medium">Trợ lý AI</span>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-accent rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm">
                Chào bạn! Hãy hỏi tôi về dữ liệu marketing.
              </div>
            </div>

            <div className="flex justify-end">
              <div className="bg-violet-500 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm max-w-[75%]">
                Tại sao chuyển đổi giảm tuần này?
              </div>
            </div>

            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="space-y-3 flex-1">
                {sections.map((section, i) => {
                  const Icon = section.icon
                  return (
                    <div key={i} className={`rounded-xl border ${section.bg} p-4 space-y-1`}>
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${section.color}`} />
                        <span className={`text-xs font-semibold ${section.color}`}>{section.label}</span>
                      </div>
                      <p className="text-sm">{section.content}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
