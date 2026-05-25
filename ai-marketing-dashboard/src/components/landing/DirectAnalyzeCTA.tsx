"use client"

import { Upload, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function DirectAnalyzeCTA() {
  const router = useRouter()

  return (
    <section className="py-20 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <div className="h-16 w-16 rounded-2xl bg-violet-50 dark:bg-violet-950/30 flex items-center justify-center mx-auto mb-6">
          <Upload className="h-8 w-8 text-violet-500" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight mb-4">
          Sẵn sàng phân tích dữ liệu của bạn?
        </h2>
        <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
          Tải file CSV lên — AI sẽ tự động phân tích khách hàng, phân khúc và đưa ra đề xuất marketing ngay lập tức.
        </p>
        <Button
          size="lg"
          className="rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-600 hover:to-fuchsia-600 shadow-lg shadow-violet-200 dark:shadow-violet-900/30 text-base"
          onClick={() => router.push("/analyze")}
        >
          Bắt đầu phân tích <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </section>
  )
}
