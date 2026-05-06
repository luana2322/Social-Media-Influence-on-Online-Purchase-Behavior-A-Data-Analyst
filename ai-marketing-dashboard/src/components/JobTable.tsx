"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { listJobs, Job } from "@/lib/api"
import { MessageSquare, BarChart3 } from "lucide-react"
import { useLanguage } from "@/i18n/LanguageProvider"

const statusKeyMap: Record<string, string> = {
  completed: "completed",
  processing: "processing",
  failed: "failed",
  pending: "pending",
}

export function RecentJobsTable() {
  const router = useRouter()
  const { t, language } = useLanguage()
  const isVi = language === "vi"
  const [mounted, setMounted] = useState(false)
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    loadJobs()
  }, [])

  const loadJobs = async () => {
    try {
      const data = await listJobs(50)
      setJobs(data)
    } catch (error) {
      console.error("Failed to load jobs:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      completed: "bg-green-100 text-green-800 hover:bg-green-100",
      processing: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      failed: "bg-red-100 text-red-800 hover:bg-red-100",
      pending: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    }
    return (
      <Badge className={`${styles[status] || ""} rounded-2xl`}>
        {t(statusKeyMap[status] || status)}
      </Badge>
    )
  }

  const formatDate = (dateStr: string) => {
    if (!mounted) return ""
    return new Date(dateStr).toLocaleDateString(isVi ? "vi-VN" : "en-US")
  }

  const getDatasetName = (job: Job) => {
    if (job.datasetPath) {
      const parts = job.datasetPath.split("/")
      return parts[parts.length - 1]
    }
    return `job_${job.id}`
  }

  if (loading) {
    return <div className="text-center py-4">{t("loadingJobs")}</div>
  }

  if (jobs.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">{t("noJobsFound")}</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("jobID")}</TableHead>
          <TableHead>{t("dataset")}</TableHead>
          <TableHead>{t("status")}</TableHead>
          <TableHead>{t("progress")}</TableHead>
          <TableHead>{t("records")}</TableHead>
          <TableHead>{t("createdAt")}</TableHead>
          <TableHead>{t("actions")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {jobs.map((job) => (
          <TableRow
            key={job.id}
            className="cursor-pointer hover:bg-accent/50"
            onClick={() => router.push(`/jobs/${job.id}`)}
          >
            <TableCell className="font-medium">#{job.id}</TableCell>
            <TableCell>{getDatasetName(job)}</TableCell>
            <TableCell>{getStatusBadge(job.status)}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Progress value={job.progressPercent} className="w-32 rounded-2xl" />
                <span className="text-sm">{job.progressPercent}%</span>
              </div>
            </TableCell>
            <TableCell>
              {job.totalRecords ? job.totalRecords.toLocaleString() : "-"}
            </TableCell>
            <TableCell suppressHydrationWarning>
              {mounted ? formatDate(job.createdAt) : ""}
            </TableCell>
            <TableCell>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push(`/jobs/${job.id}`)
                  }}
                >
                  <BarChart3 className="h-4 w-4" />
                </Button>
                {job.status === "completed" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/chatbot?jobId=${job.id}`)
                    }}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
