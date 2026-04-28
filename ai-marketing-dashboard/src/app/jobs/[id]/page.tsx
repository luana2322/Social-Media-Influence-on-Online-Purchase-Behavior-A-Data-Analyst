"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import { jobs } from "@/lib/mock-data"

type JobStatus = "completed" | "processing" | "failed"

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const job = jobs.find((j) => j.id === params.id) || jobs[0]

  const getStatusBadge = (status: JobStatus) => {
    const styles = {
      completed: "bg-green-100 text-green-800",
      processing: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
    }
    return (
      <Badge className={`${styles[status]} rounded-2xl`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
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
              <span className="text-sm text-muted-foreground">Dataset</span>
              <span className="text-sm font-medium">{job.dataset}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              {getStatusBadge(job.status as JobStatus)}
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Records</span>
              <span className="text-sm font-medium">{job.records.toLocaleString()}</span>
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
                <span className="text-sm font-medium">{job.progress}%</span>
              </div>
              <Progress value={job.progress} className="rounded-2xl" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="rounded-2xl flex-1">
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </Button>
              <Button className="rounded-2xl flex-1" disabled={job.status !== "completed"}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
