"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"

export default function CTASection() {
  const router = useRouter()

  return (
    <section className="py-20 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <div className="rounded-3xl bg-gradient-to-br from-violet-500 to-fuchsia-500 p-12 shadow-2xl shadow-violet-200 dark:shadow-violet-900/30">
          <h2 className="text-3xl font-bold text-white">
            Bắt đầu dự đoán khách hàng ngay
          </h2>
          <p className="text-violet-100 mt-3 text-lg">
            Tham gia 500+ nhà tiếp thị dùng AI tăng 27% chuyển đổi
          </p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              size="lg"
              variant="secondary"
              className="rounded-xl text-base px-8"
              onClick={() => router.push("/overview")}
            >
              Dùng thử <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-xl text-base px-8 border-white/20 text-white hover:text-white hover:bg-white/10"
              onClick={() => router.push("/analyze")}
            >
              Tải dữ liệu
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
