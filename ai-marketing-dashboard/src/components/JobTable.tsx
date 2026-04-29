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
import { jobs } from "@/lib/mock-data"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export function RecentJobsTable() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      completed: "bg-green-100 text-green-800 hover:bg-green-100",
      processing: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      failed: "bg-red-100 text-red-800 hover:bg-red-100",
    }
    return (
      <Badge className={`${styles[status] || ""} rounded-2xl`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const formatDate = (dateStr: string) => {
    if (!mounted) return ""
    return new Date(dateStr).toLocaleDateString("en-US")
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Job ID</TableHead>
          <TableHead>Dataset</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Progress</TableHead>
          <TableHead>Created At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {jobs.map((job) => (
          <TableRow
            key={job.id}
            className="cursor-pointer hover:bg-accent/50"
            onClick={() => router.push(`/jobs/${job.id}`)}
          >
            <TableCell className="font-medium">{job.id}</TableCell>
            <TableCell>{job.dataset}</TableCell>
            <TableCell>{getStatusBadge(job.status)}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Progress value={job.progress} className="w-32 rounded-2xl" />
                <span className="text-sm">{job.progress}%</span>
              </div>
            </TableCell>
            <TableCell suppressHydrationWarning>
              {mounted ? formatDate(job.createdAt) : ""}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
