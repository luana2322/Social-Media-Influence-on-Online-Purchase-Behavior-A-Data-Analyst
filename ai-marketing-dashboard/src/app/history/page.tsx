"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, Sparkles, BarChart3, Clock, ArrowRight, Database, ShoppingCart, DollarSign, Users, TrendingUp, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { getMyJobs, getAnalysisSummary, type Job, type AnalysisSummaryData } from "@/lib/api"
import { useAuth } from "@/context/AuthContext"
import { ExportButton } from "@/components/export/ExportButton"

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "Đang chờ", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300" },
  processing: { label: "Đang xử lý", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
  completed: { label: "Hoàn tất", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" },
  failed: { label: "Thất bại", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" },
}

export default function HistoryPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState<number | null>(null)
  const [jobDetail, setJobDetail] = useState<AnalysisSummaryData | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  useEffect(() => {
    getMyJobs()
      .then((remoteJobs) => {
        const localKeys = Object.keys(localStorage).filter((k) => k.startsWith("analysis_"))
        const localJobIds = localKeys.map((k) => Number(k.replace("analysis_", ""))).filter((id) => id < 0)
        const localJobs = localJobIds.map((id) => ({
          id,
          userId: 0,
          status: "completed" as const,
          progressPercent: 100,
          totalRecords: 0,
          processedRecords: 0,
          datasetPath: localStorage.getItem(`analysis_name_${id}`) || "Dữ liệu cục bộ",
          createdAt: new Date(Math.abs(id)).toISOString(),
        }))
        const merged = [...remoteJobs, ...localJobs]
        merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        setJobs(merged)
      })
      .catch(() => {
        const localKeys = Object.keys(localStorage).filter((k) => k.startsWith("analysis_"))
        const localJobIds = localKeys.map((k) => Number(k.replace("analysis_", "")))
        const localJobs = localJobIds
          .filter((id) => id < 0)
          .map((id) => ({
            id,
            userId: 0,
            status: "completed" as const,
            progressPercent: 100,
            totalRecords: 0,
            processedRecords: 0,
            datasetPath: localStorage.getItem(`analysis_name_${id}`) || "Dữ liệu cục bộ",
            createdAt: new Date(Math.abs(id)).toISOString(),
          }))
        localJobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        setJobs(localJobs)
      })
      .finally(() => setLoading(false))
  }, [])

  const fileName = (path?: string): string => {
    if (!path) return "—"
    const parts = path.split("_")
    return parts.length > 1 ? parts.slice(1).join("_") : path.split("/").pop() || "—"
  }

  const openDetail = async (job: Job) => {
    if (selectedJob === job.id) {
      setSelectedJob(null)
      setJobDetail(null)
      return
    }
    setSelectedJob(job.id)
    setDetailLoading(true)
    setJobDetail(null)
    localStorage.setItem("lastJobId", String(job.id))
    localStorage.setItem("lastFileName", fileName(job.datasetPath))

    try {
      const summary = await getAnalysisSummary(job.id)
      if (summary) {
        setJobDetail(summary)
        setDetailLoading(false)
        return
      }
    } catch {
      // fallback to localStorage
    }

    const local = localStorage.getItem(`analysis_${job.id}`)
    if (local) {
      try { setJobDetail(JSON.parse(local)) } catch { setJobDetail(null) }
    } else {
      setJobDetail(null)
    }
    setDetailLoading(false)
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lịch sử phân tích</h1>
          <p className="text-muted-foreground mt-1">
            {user?.fullName ? `${user.fullName} — ` : ""}Các job đã xử lý trước đây
          </p>
        </div>
        <Button
          className="rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-600 hover:to-fuchsia-600"
          onClick={() => router.push("/analyze")}
        >
          <Upload className="h-4 w-4 mr-2" />
          Phân tích mới
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
        </div>
      ) : jobs.length === 0 ? (
        <Card className="rounded-2xl border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-20 gap-5">
            <div className="h-16 w-16 rounded-2xl bg-violet-50 dark:bg-violet-950/30 flex items-center justify-center">
              <Database className="h-8 w-8 text-violet-500" />
            </div>
            <div className="text-center max-w-md">
              <p className="text-lg font-medium">Chưa có phân tích nào</p>
              <p className="text-sm text-muted-foreground mt-1">
                Tải lên file CSV để bắt đầu phân tích dữ liệu khách hàng
              </p>
            </div>
            <Button
              className="rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-600 hover:to-fuchsia-600"
              onClick={() => router.push("/analyze")}
            >
              <Upload className="h-4 w-4 mr-2" />
              Tải dữ liệu ngay
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {jobs.map((job) => {
            const status = statusConfig[job.status] || statusConfig.pending
            const isOpen = selectedJob === job.id
            return (
              <div key={job.id}>
                <Card
                  className={cn(
                    "rounded-2xl transition-shadow cursor-pointer",
                    isOpen ? "shadow-md border-violet-200 dark:border-violet-800" : "hover:shadow-md"
                  )}
                  onClick={() => openDetail(job)}
                >
                  <CardContent className="pt-5 pb-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0", status.color)}>
                          {job.status === "completed" ? (
                            <Sparkles className="h-5 w-5" />
                          ) : job.status === "failed" ? (
                            <BarChart3 className="h-5 w-5" />
                          ) : (
                            <Clock className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">Job #{job.id}</p>
                            <span className={cn("text-xs font-medium px-2 py-0.5 rounded-md", status.color)}>
                              {status.label}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {fileName(job.datasetPath)}
                          </p>
                          <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                            <span>
                              {new Date(job.createdAt).toLocaleDateString("vi-VN", {
                                hour: "2-digit", minute: "2-digit", day: "numeric", month: "numeric", year: "numeric",
                              })}
                            </span>
                            {job.totalRecords > 0 && (
                              <span>{job.totalRecords.toLocaleString()} bản ghi</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className={cn("h-4 w-4 text-muted-foreground transition-transform", isOpen && "rotate-90")} />
                    </div>
                  </CardContent>
                </Card>

                {isOpen && (
                  <div className="ml-12 mt-2 space-y-3">
                    {detailLoading ? (
                      <Card className="rounded-2xl">
                        <CardContent className="flex items-center justify-center py-10">
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
                        </CardContent>
                      </Card>
                    ) : jobDetail ? (
                      <div id={`print-job-${job.id}`} className="space-y-3">
                        <Card className="rounded-2xl border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20">
                          <CardContent className="pt-5 pb-5">
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                              <div className="bg-background rounded-xl p-3">
                                <ShoppingCart className="h-4 w-4 text-violet-500 mb-1" />
                                <p className="text-xs text-muted-foreground">Chuyển đổi</p>
                                <p className="text-lg font-bold">{jobDetail.conversions.toLocaleString()}</p>
                                <p className="text-xs text-green-600">{jobDetail.conversionRate}</p>
                              </div>
                              <div className="bg-background rounded-xl p-3">
                                <DollarSign className="h-4 w-4 text-emerald-500 mb-1" />
                                <p className="text-xs text-muted-foreground">Doanh thu</p>
                                <p className="text-lg font-bold">{jobDetail.revenue}</p>
                              </div>
                              <div className="bg-background rounded-xl p-3">
                                <Users className="h-4 w-4 text-blue-500 mb-1" />
                                <p className="text-xs text-muted-foreground">Tổng khách</p>
                                <p className="text-lg font-bold">{jobDetail.totalRows.toLocaleString()}</p>
                              </div>
                              <div className="bg-background rounded-xl p-3">
                                <TrendingUp className="h-4 w-4 text-orange-500 mb-1" />
                                <p className="text-xs text-muted-foreground">Kênh tốt nhất</p>
                                <p className="text-lg font-bold truncate">
                                  {jobDetail.channelPerformance?.[0]?.name || jobDetail.channels[0]?.name || "—"}
                                </p>
                                <p className="text-xs text-green-600">
                                  {jobDetail.channelPerformance?.[0]?.conversionRate || (jobDetail.channels[0]?.pct ? `${jobDetail.channels[0].pct}%` : "")}
                                </p>
                              </div>
                              <div className="bg-background rounded-xl p-3">
                                <Database className="h-4 w-4 text-cyan-500 mb-1" />
                                <p className="text-xs text-muted-foreground">Đầy đủ</p>
                                <p className="text-lg font-bold">
                                  {jobDetail.completenessScore != null ? `${jobDetail.completenessScore}%` : "—"}
                                </p>
                                <p className="text-xs text-green-600">Dữ liệu</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {jobDetail.segments.length > 0 && (
                          <Card className="rounded-2xl">
                            <CardContent className="pt-5 pb-5">
                              <h4 className="text-sm font-semibold mb-3">Phân khúc khách hàng</h4>
                              <div className="flex flex-col gap-2">
                                {jobDetail.segments.map((seg) => (
                                  <div key={seg.name} className="flex items-center gap-3 text-sm">
                                    <span className="w-14 capitalize font-medium">{seg.name}</span>
                                    <div className="flex-1 h-5 bg-accent rounded-full overflow-hidden">
                                      <div
                                        className={cn(
                                          "h-full rounded-full",
                                          seg.name === "hot" ? "bg-red-500" : seg.name === "warm" ? "bg-amber-400" : "bg-slate-300 dark:bg-slate-600"
                                        )}
                                        style={{ width: `${seg.pct}%` }}
                                      />
                                    </div>
                                    <span className="text-muted-foreground w-24 text-right text-xs">
                                      {seg.count.toLocaleString()} ({seg.pct}%)
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {jobDetail.channelPerformance && jobDetail.channelPerformance.length > 0 && (
                          <Card className="rounded-2xl border-blue-200 dark:border-blue-800">
                            <CardContent className="pt-5 pb-5">
                              <h4 className="text-sm font-semibold mb-3">Chuyển đổi theo kênh</h4>
                              <div className="space-y-2">
                                {jobDetail.channelPerformance.map((ch) => (
                                  <div key={ch.name} className="flex items-center gap-3 text-sm">
                                    <span className="text-sm font-medium w-24 truncate capitalize">{ch.name}</span>
                                    <div className="flex-1 h-5 bg-accent rounded-full overflow-hidden">
                                      <div
                                        className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-500"
                                        style={{ width: `${parseFloat(ch.conversionRate)}%` }}
                                      />
                                    </div>
                                    <span className="text-xs text-muted-foreground w-20 text-right">
                                      {ch.conversions}/{ch.totalCount} ({ch.conversionRate})
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {jobDetail.recommendations.length > 0 && (
                          <Card className="rounded-2xl border-violet-200 dark:border-violet-800">
                            <CardContent className="pt-5 pb-5">
                              <div className="flex items-center gap-2 mb-3">
                                <Sparkles className="h-4 w-4 text-violet-500" />
                                <h4 className="text-sm font-semibold">Đề xuất phát triển</h4>
                              </div>
                              <ul className="space-y-2">
                                {jobDetail.recommendations.map((r, i) => (
                                  <li key={i} className="flex items-start gap-2 text-sm">
                                    <div className="h-5 w-5 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center shrink-0 mt-0.5">
                                      <span className="text-[10px] font-bold text-violet-600">{i + 1}</span>
                                    </div>
                                    <p>{r}</p>
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        )}

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl"
                            onClick={() => {
                              setSelectedJob(null)
                              setJobDetail(null)
                            }}
                          >
                            <ArrowLeft className="h-3 w-3 mr-1" /> Thu gọn
                          </Button>
                          <ExportButton
                            targetId={`print-job-${job.id}`}
                            fileName={`ket-qua-job-${job.id}`}
                          />
                          <Button
                            size="sm"
                            className="rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-600 hover:to-fuchsia-600"
                            onClick={() => router.push("/analyze")}
                          >
                            <Upload className="h-3 w-3 mr-1" /> Phân tích mới
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Card className="rounded-2xl">
                        <CardContent className="flex flex-col items-center py-8 gap-3">
                          <Database className="h-8 w-8 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Chưa có dữ liệu phân tích cho job này</p>
                          <Button
                            size="sm"
                            className="rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-600 hover:to-fuchsia-600"
                            onClick={() => router.push("/analyze")}
                          >
                            Phân tích ngay
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
