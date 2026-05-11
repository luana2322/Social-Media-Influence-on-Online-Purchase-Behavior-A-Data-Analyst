"use client"

import { useState } from "react"
import { Upload, CheckCircle2, BarChart3, Sparkles, ArrowRight, ArrowLeft, UploadCloud, ShoppingCart, Users, DollarSign, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { parseCSV, generateSampleCSV, analyzeData, type ParsedCSV, type AnalysisResult } from "@/lib/csv-utils"
import { uploadDataset, saveAnalysisSummary } from "@/lib/api"

const steps = [
  { id: "upload", label: "Tải CSV", icon: UploadCloud },
  { id: "mapping", label: "Xem cột", icon: CheckCircle2 },
  { id: "processing", label: "AI Phân tích", icon: BarChart3 },
  { id: "results", label: "Kết quả", icon: Sparkles },
]

export default function AnalyzePage() {
  const [step, setStep] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [parsed, setParsed] = useState<ParsedCSV | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [results, setResults] = useState<AnalysisResult | null>(null)

  function ensureJobId(fileName: string): number {
    const existing = localStorage.getItem("lastJobId")
    if (existing && Number(existing) > 0) return Number(existing)
    const localId = -Date.now()
    localStorage.setItem("lastJobId", String(localId))
    localStorage.setItem("lastFileName", fileName)
    localStorage.setItem(`analysis_name_${localId}`, fileName)
    return localId
  }

  const handleUpload = async (f: File) => {
    setUploading(true)
    const text = await f.text()
    const result = parseCSV(text)
    setParsed(result)

    try {
      const job = await uploadDataset(f)
      localStorage.setItem("lastJobId", String(job.jobId))
      localStorage.setItem("lastFileName", f.name)
    } catch {
      ensureJobId(f.name)
      console.warn("API unavailable, using client-side only")
    }

    setUploading(false)
    setStep(1)
  }

  const handleProcess = async () => {
    if (!parsed) return
    setStep(2)
    setAnalyzing(true)

    await new Promise((r) => setTimeout(r, 1500))

    const analysis = analyzeData(parsed)
    setResults(analysis)

    const jobId = ensureJobId(localStorage.getItem("lastFileName") || "data.csv")
    const payload = {
      totalRows: analysis.totalRows,
      conversions: analysis.conversions,
      conversionRate: analysis.conversionRate,
      revenue: analysis.revenue,
      segments: analysis.segments,
      channels: analysis.channels,
      recommendations: analysis.recommendations,
    }

    localStorage.setItem(`analysis_${jobId}`, JSON.stringify(payload))

    if (jobId > 0) {
      saveAnalysisSummary(jobId, payload).catch(() => console.warn("Failed to save analysis summary"))
    }

    setAnalyzing(false)
    setStep(3)
  }

  const handleDemo = async () => {
    setUploading(true)
    const csvText = generateSampleCSV()
    const result = parseCSV(csvText)
    setParsed(result)

    try {
      const blob = new Blob([csvText], { type: "text/csv" })
      const demoFile = new File([blob], "sample_customers.csv", { type: "text/csv" })
      const job = await uploadDataset(demoFile)
      localStorage.setItem("lastJobId", String(job.jobId))
      localStorage.setItem("lastFileName", "sample_customers.csv")
    } catch {
      ensureJobId("sample_customers.csv")
      console.warn("Demo upload to API failed, using client-side only")
    }

    await new Promise((r) => setTimeout(r, 500))
    setUploading(false)
    setStep(1)
  }

  const resetAll = () => {
    setStep(0)
    setParsed(null)
    setResults(null)
    setUploading(false)
    setAnalyzing(false)
  }

  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Phân tích dữ liệu</h1>
        <p className="text-muted-foreground mt-1">
          Tải dữ liệu khách hàng, AI sẽ tìm khách hàng tiềm năng
        </p>
      </div>

      <div className="flex items-center justify-between">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2">
            <div
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                step === i
                  ? "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300"
                  : step > i
                  ? "text-green-600"
                  : "text-muted-foreground"
              )}
            >
              <s.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "h-px w-12 sm:w-20",
                  step > i ? "bg-green-400" : "bg-border"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {step === 0 && (
        <Card className="rounded-2xl border-2 border-dashed border-border hover:border-violet-300 transition-colors">
          <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="h-16 w-16 rounded-2xl bg-violet-50 dark:bg-violet-950/30 flex items-center justify-center">
              <Upload className="h-8 w-8 text-violet-500" />
            </div>
            <div className="text-center">
              <p className="text-lg font-medium">Tải CSV khách hàng</p>
              <p className="text-sm text-muted-foreground mt-1">
                Kéo thả hoặc nhấp để duyệt (CSV, tối đa 1M dòng)
              </p>
            </div>
            <input
              type="file"
              accept=".csv"
              className="hidden"
              id="csv-upload"
              onChange={async (e) => {
                const f = e.target.files?.[0]
                if (f) await handleUpload(f)
                e.target.value = ""
              }}
            />
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => document.getElementById("csv-upload")?.click()}
                disabled={uploading}
              >
                {uploading ? "Đang tải lên..." : "Chọn file CSV"}
              </Button>
              <Button
                className="rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-600 hover:to-fuchsia-600"
                onClick={handleDemo}
                disabled={uploading}
              >
                Dùng thử Demo
              </Button>
            </div>
            {uploading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
                Đang xử lý...
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {step === 1 && parsed && (
        <div className="flex flex-col gap-4">
          <Card className="rounded-2xl">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Cột tự động phát hiện</h3>
                <span className="text-sm text-muted-foreground">
                  {parsed.totalRows.toLocaleString()} dòng
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {parsed.columns.map((col) => (
                  <div
                    key={col.name}
                    className="flex items-center justify-between p-3 bg-accent rounded-xl"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">{col.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground bg-background px-2 py-0.5 rounded-md">
                      {col.type}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-between">
            <Button variant="outline" className="rounded-xl" onClick={resetAll}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại
            </Button>
            <Button
              className="rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-600 hover:to-fuchsia-600"
              onClick={handleProcess}
            >
              Bắt đầu phân tích AI <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <Card className="rounded-2xl border-violet-200 dark:border-violet-800">
          <CardContent className="flex flex-col items-center justify-center py-16 gap-6">
            <div className="relative">
              <div className="h-20 w-20 rounded-full border-4 border-violet-100 dark:border-violet-900 flex items-center justify-center">
                <BarChart3 className="h-8 w-8 text-violet-500" />
              </div>
              <div className="absolute inset-0 h-20 w-20 rounded-full border-4 border-transparent border-t-violet-500 animate-spin" />
            </div>
            <div className="text-center">
              {analyzing ? (
                <>
                  <p className="text-lg font-medium">AI đang phân tích dữ liệu</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Đang xử lý {parsed?.totalRows.toLocaleString()} bản ghi để tìm thông tin giá trị
                  </p>
                </>
              ) : (
                <p className="text-lg font-medium">Đang chuẩn bị...</p>
              )}
            </div>
            {analyzing && (
              <>
                <div className="w-64 h-2 bg-accent rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full animate-pulse"
                    style={{ width: "60%" }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-8 text-center text-sm">
                  <div>
                    <p className="font-medium text-violet-600">Đang xác định</p>
                    <p className="text-muted-foreground">Phân khúc</p>
                  </div>
                  <div>
                    <p className="font-medium text-violet-600">Đang phân tích</p>
                    <p className="text-muted-foreground">Hành vi</p>
                  </div>
                  <div>
                    <p className="font-medium text-violet-600">Đang tạo</p>
                    <p className="text-muted-foreground">Thông tin</p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {step === 3 && results && parsed && (
        <div className="flex flex-col gap-4">
          {/* Summary */}
          <Card className="rounded-2xl border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Hoàn tất phân tích</h3>
                  <p className="text-sm text-muted-foreground">
                    Đã phân tích {results.totalRows.toLocaleString()} bản ghi
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                <div className="bg-background rounded-xl p-4">
                  <ShoppingCart className="h-5 w-5 text-violet-500 mb-2" />
                  <p className="text-sm text-muted-foreground">Chuyển đổi</p>
                  <p className="text-2xl font-bold mt-1">{results.conversions.toLocaleString()}</p>
                  <p className="text-xs text-green-600">{results.conversionRate}</p>
                </div>
                <div className="bg-background rounded-xl p-4">
                  <DollarSign className="h-5 w-5 text-emerald-500 mb-2" />
                  <p className="text-sm text-muted-foreground">Doanh thu</p>
                  <p className="text-2xl font-bold mt-1">{results.revenue}</p>
                  <p className="text-xs text-green-600">Dự kiến</p>
                </div>
                <div className="bg-background rounded-xl p-4">
                  <Users className="h-5 w-5 text-blue-500 mb-2" />
                  <p className="text-sm text-muted-foreground">Tổng khách</p>
                  <p className="text-2xl font-bold mt-1">{results.totalRows.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Bản ghi</p>
                </div>
                <div className="bg-background rounded-xl p-4">
                  <TrendingUp className="h-5 w-5 text-orange-500 mb-2" />
                  <p className="text-sm text-muted-foreground">Kênh tốt nhất</p>
                  <p className="text-2xl font-bold mt-1 truncate">
                    {results.channels[0]?.name || "—"}
                  </p>
                  <p className="text-xs text-green-600">
                    {results.channels[0]?.pct || 0}% khách
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Segments */}
          <Card className="rounded-2xl">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Phân khúc khách hàng</h3>
              <div className="flex flex-col gap-3">
                {results.segments.map((seg) => (
                  <div key={seg.name} className="flex items-center gap-4">
                    <span className="text-sm font-medium w-16 capitalize">{seg.name}</span>
                    <div className="flex-1 h-6 bg-accent rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          seg.name === "hot"
                            ? "bg-red-500"
                            : seg.name === "warm"
                            ? "bg-amber-400"
                            : "bg-slate-300 dark:bg-slate-600"
                        )}
                        style={{ width: `${seg.pct}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-24 text-right">
                      {seg.count.toLocaleString()} ({seg.pct}%)
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="rounded-2xl border-violet-200 dark:border-violet-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-violet-500" />
                <h3 className="font-semibold">Đề xuất phát triển</h3>
              </div>
              <ul className="space-y-3">
                {results.recommendations.map((r, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-violet-600">{i + 1}</span>
                    </div>
                    <p className="text-sm">{r}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-between">
            <Button variant="outline" className="rounded-xl" onClick={resetAll}>
              Phân tích file khác
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
