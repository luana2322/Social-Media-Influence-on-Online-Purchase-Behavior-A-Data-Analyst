"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ArrowRight, Upload, Sparkles } from "lucide-react"

export default function HeroSection() {
  const router = useRouter()

  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-violet-50 via-white to-white dark:from-violet-950/20 dark:via-background dark:to-background" />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-200/30 dark:bg-violet-800/10 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border bg-background/80 text-sm mb-8">
          <Sparkles className="h-4 w-4 text-violet-500" />
          <span>AI Marketing Copilot</span>
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.1]">
          Ngừng lãng phí tiền vào{" "}
          <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
            khách hàng sai
          </span>
        </h1>

        <p className="text-lg text-muted-foreground mt-6 max-w-2xl mx-auto leading-relaxed">
          Dự đoán hành vi mua hàng và khám phá khách hàng tiềm năng bằng AI.
        </p>

        <div className="flex items-center justify-center gap-4 mt-10">
          <Button
            size="lg"
            className="rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-600 hover:to-fuchsia-600 shadow-lg shadow-violet-200 dark:shadow-violet-900/30 text-base px-8"
            onClick={() => router.push("/overview")}
          >
            Dùng thử <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-xl text-base px-8"
            onClick={() => router.push("/analyze")}
          >
            <Upload className="h-4 w-4 mr-2" />
            Tải dữ liệu
          </Button>
        </div>

        <p className="text-sm text-muted-foreground mt-8">
          Không cần thẻ tín dụng · Demo miễn phí · 500+ nhà tiếp thị tin dùng
        </p>
      </div>
    </section>
  )
}
