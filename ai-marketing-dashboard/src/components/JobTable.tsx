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

export function RecentJobsTable() {
  const router = useRouter()
  const getStatusBadge = (status: string) => {
    const styles = {
      completed: "bg-green-100 text-green-800 hover:bg-green-100",
      processing: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      failed: "bg-red-100 text-red-800 hover:bg-red-100",
    }
    return (
      <Badge className={`${styles[status as keyof typeof styles]} rounded-2xl`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
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
            <TableCell>{new Date(job.createdAt).toLocaleDateString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
