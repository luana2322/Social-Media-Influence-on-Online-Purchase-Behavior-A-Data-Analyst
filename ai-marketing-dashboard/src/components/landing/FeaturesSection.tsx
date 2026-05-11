"use client"

import { Zap, Users, Bot, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

const iconMap: Record<string, typeof Zap> = {
  zap: Zap,
  users: Users,
  bot: Bot,
}

const features = [
  { icon: "zap", title: "Dự đoán mua hàng", desc: "AI dự đoán khách hàng nào sẽ mua với độ chính xác 95.7%. Tập trung ngân sách vào đúng đối tượng." },
  { icon: "users", title: "Thông tin khách hàng", desc: "Tự động phân khúc khách hàng thành nhóm Nóng, Ấm và Lạnh với đề xuất hành động." },
  { icon: "bot", title: "Trợ lý Marketing AI", desc: "Hỏi dữ liệu bằng tiếng Việt. Nhận thông tin, giải thích, chiến lược và đề xuất." },
]

export default function FeaturesSection() {
  const router = useRouter()

  return (
    <section className="py-20 px-6 bg-accent/30">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Mọi thứ bạn cần để bán hàng thông minh hơn</h2>
          <p className="text-muted-foreground mt-2">
            Không cần kiến thức ML. Chỉ cần tải dữ liệu và nhận câu trả lời.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {features.map((feature) => {
            const Icon = iconMap[feature.icon] || Zap
            return (
              <div
                key={feature.title}
                className="rounded-2xl border bg-card p-6 hover:shadow-md transition-shadow"
              >
                <div className="h-12 w-12 rounded-xl bg-violet-50 dark:bg-violet-950/30 flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-violet-500" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            )
          })}
        </div>

        <div className="text-center mt-10">
          <Button
            className="rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-600 hover:to-fuchsia-600"
            onClick={() => router.push("/overview")}
          >
            Dùng thử miễn phí <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  )
}
