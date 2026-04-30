"use client";
import { StatsCard } from "@/components/StatsCard";
import { PredictionLineChart, PieChartComponent } from "@/components/Charts";
import { RecentJobsTable } from "@/components/JobTable";
import { dashboardStats } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/i18n/LanguageProvider";

export default function DashboardPage() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold tracking-tight">{t("dashboard")}</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>{t("dashboard")} Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <PredictionLineChart />
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Segmentation Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChartComponent />
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Recent Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentJobsTable />
        </CardContent>
      </Card>
    </div>
  );
}
