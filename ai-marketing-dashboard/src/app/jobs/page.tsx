"use client"
import { RecentJobsTable } from "@/components/JobTable"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function JobsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Jobs</h1>
        <Button className="rounded-2xl">
          <Plus className="mr-2 h-4 w-4" />
          New Job
        </Button>
      </div>
      
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>All Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentJobsTable />
        </CardContent>
      </Card>
    </div>
  )
}
