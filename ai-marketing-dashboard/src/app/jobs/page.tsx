"use client"
import { RecentJobsTable } from "@/components/JobTable"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Upload } from "lucide-react"
import { useLanguage } from "@/i18n/LanguageProvider"
import { useRouter } from "next/navigation"

export default function JobsPage() {
  const { t } = useLanguage()
  const router = useRouter()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{t("jobs") || "Analysis History"}</h1>
        <Button className="rounded-2xl" onClick={() => router.push("/upload")}>
          <Upload className="mr-2 h-4 w-4" />
          {t("newJob") || "New Analysis"}
        </Button>
      </div>

      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>{t("allJobs") || "CSV Analysis History"}</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentJobsTable />
        </CardContent>
      </Card>
    </div>
  )
}
