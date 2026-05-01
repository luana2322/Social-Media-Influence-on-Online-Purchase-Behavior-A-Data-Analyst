"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, RefreshCw } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { getJobStatus, getJobResults } from "@/lib/api"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type JobStatus = "pending" | "processing" | "completed" | "failed"

export default function JobDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [job, setJob] = useState<any>(null)
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const jobId = Number(params.id)

  const fetchJob = async () => {
    if (isNaN(jobId)) {
      setError("Invalid job ID")
      setLoading(false)
      return
    }
    try {
      const jobData = await getJobStatus(jobId)
      setJob(jobData)
      if (jobData.status === "completed") {
        const res = await getJobResults(jobId)
        setResults(res)
      }
      setLoading(false)
      setError(null)
    } catch (err) {
      console.error("Failed to fetch job:", err)
      setError("Failed to fetch job")
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isNaN(jobId)) {
      setError("Invalid job ID")
      setLoading(false)
      return
    }
    fetchJob()
    const interval = setInterval(() => {
      fetchJob()
    }, 3000)
    return () => clearInterval(interval)
  }, [params.id])

  const getStatusBadge = (status: JobStatus) => {
    const styles = {
      completed: "bg-green-100 text-green-800",
      processing: "bg-yellow-100 text-yellow-800",
      pending: "bg-blue-100 text-blue-800",
      failed: "bg-red-100 text-red-800",
    }
    return (
      <Badge className={`${styles[status]} rounded-2xl`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  if (loading || !job) {
    return <div className="p-8 text-center">Loading...</div>
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-2xl">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Job Details</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Job Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Job ID</span>
              <span className="text-sm font-medium">{job.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              {getStatusBadge(job.status as JobStatus)}
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Progress</span>
              <span className="text-sm font-medium">{job.progressPercent}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Records</span>
              <span className="text-sm font-medium">{job.processedRecords}/{job.totalRecords}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Created</span>
              <span className="text-sm font-medium">
                {new Date(job.createdAt).toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Progress</span>
                <span className="text-sm font-medium">{job.progressPercent}%</span>
              </div>
              <Progress value={job.progressPercent} className="rounded-2xl" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="rounded-2xl flex-1" onClick={fetchJob}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button className="rounded-2xl flex-1" disabled={job.status !== "completed"}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {job.status === "completed" && results.length > 0 && (
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Prediction Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Record ID</TableHead>
                  <TableHead>Probability</TableHead>
                  <TableHead>Segment</TableHead>
                  <TableHead>Model Version</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.recordId}</TableCell>
                    <TableCell>{r.probability.toFixed(4)}</TableCell>
                    <TableCell>
                      <Badge variant={r.segment === "High" ? "default" : "secondary"} className="rounded-2xl">
                        {r.segment}
                      </Badge>
                    </TableCell>
                    <TableCell>{r.modelVersion}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
