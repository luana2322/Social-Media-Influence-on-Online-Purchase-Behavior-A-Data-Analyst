"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, RefreshCw, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { getJobStatus, getJobResults, downloadResults } from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatProbability, getSegmentColor, getSegmentExplanation, getActionableAdvice } from "@/lib/prediction-helpers";

type JobStatus = "pending" | "processing" | "completed" | "failed";

export default function JobDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [job, setJob] = useState<any>(null);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const jobId = Number(params.id);

  const fetchJob = async () => {
    if (isNaN(jobId)) {
      setError("Invalid job ID");
      setLoading(false);
      return;
    }
    try {
      const jobData = await getJobStatus(jobId);
      setJob(jobData);
      if (jobData.status === "completed") {
        const res = await getJobResults(jobId);
        setResults(res);
      }
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch job:", err);
      setError("Failed to fetch job");
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      await downloadResults(jobId);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Tải xuống thất bại");
    }
  };

  useEffect(() => {
    if (isNaN(jobId)) {
      setError("Invalid job ID");
      setLoading(false);
      return;
    }
    fetchJob();
    const interval = setInterval(() => {
      fetchJob();
    }, 3000);
    return () => clearInterval(interval);
  }, [params.id]);

  const getStatusBadge = (status: JobStatus) => {
    const styles: Record<JobStatus, string> = {
      completed: "bg-green-100 text-green-800",
      processing: "bg-yellow-100 text-yellow-800",
      pending: "bg-blue-100 text-blue-800",
      failed: "bg-red-100 text-red-800",
    };
    return (
      <Badge className={`${styles[status]} rounded-2xl`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading || !job) {
    return <div className="p-8 text-center">Đang tải...</div>;
  }

  const highCount = results.filter((r: any) => r.segment === "High").length;
  const mediumCount = results.filter((r: any) => r.segment === "Medium").length;
  const lowCount = results.filter((r: any) => r.segment === "Low").length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-2xl">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Chi tiết Job #{job.id}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>📊 Thông tin Job</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">ID Job</span>
              <span className="text-sm font-medium">#{job.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Trạng thái</span>
              {getStatusBadge(job.status as JobStatus)}
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Tiến độ</span>
              <span className="text-sm font-medium">{job.progressPercent?.toFixed(0) || 0}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Số bản ghi</span>
              <span className="text-sm font-medium">{job.processedRecords}/{job.totalRecords}</span>
            </div>
            {job.completedAt && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Hoàn thành</span>
                <span className="text-sm font-medium text-green-600">
                  {new Date(job.completedAt).toLocaleString('vi-VN')}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>📈 Tiến độ xử lý</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Tiến độ</span>
                <span className="text-sm font-medium">{job.progressPercent?.toFixed(0) || 0}%</span>
              </div>
              <Progress value={job.progressPercent || 0} className="rounded-2xl" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="rounded-2xl flex-1" onClick={fetchJob}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Làm mới
              </Button>
              <Button className="rounded-2xl flex-1" disabled={job.status !== "completed"} onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Tải xuống
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {job.status === "completed" && results.length > 0 && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="rounded-2xl shadow-sm border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">🔥 Cao (High)</p>
                    <p className="text-2xl font-bold text-red-600">{highCount}</p>
                    <p className="text-xs text-muted-foreground">
                      {((highCount / results.length) * 100).toFixed(0)}% tổng
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm border-yellow-200 bg-yellow-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">⚡ Trung bình (Medium)</p>
                    <p className="text-2xl font-bold text-yellow-600">{mediumCount}</p>
                    <p className="text-xs text-muted-foreground">
                      {((mediumCount / results.length) * 100).toFixed(0)}% tổng
                    </p>
                  </div>
                  <Minus className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">🌱 Thấp (Low)</p>
                    <p className="text-2xl font-bold text-green-600">{lowCount}</p>
                    <p className="text-xs text-muted-foreground">
                      {((lowCount / results.length) * 100).toFixed(0)}% tổng
                    </p>
                  </div>
                  <TrendingDown className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>📋 Kết quả dự đoán chi tiết</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>STT</TableHead>
                    <TableHead>Mã bản ghi</TableHead>
                    <TableHead>Xác suất mua</TableHead>
                    <TableHead>Mức độ</TableHead>
                    <TableHead>Giải thích</TableHead>
                    <TableHead>Hành động nên làm</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((r: any, idx: number) => (
                    <TableRow key={r.id} className="hover:bg-muted/50">
                      <TableCell className="font-mono text-sm text-muted-foreground">
                        #{idx + 1}
                      </TableCell>
                      <TableCell className="font-mono text-sm font-medium">
                        {r.displayId ? (
                          <div>
                            <div>{r.displayId}</div>
                            {r.recordId && !r.recordId.startsWith('row_') && (
                              <div className="text-xs text-muted-foreground">ID: {r.recordId}</div>
                            )}
                          </div>
                        ) : (
                          `Dòng ${idx + 1}`
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {r.probability >= 0.8 ? <TrendingUp className="h-4 w-4 text-red-500" /> :
                           r.probability >= 0.4 ? <Minus className="h-4 w-4 text-yellow-500" /> :
                           <TrendingDown className="h-4 w-4 text-green-500" />}
                          <span className={`font-bold ${r.probability >= 0.8 ? 'text-red-600' : r.probability >= 0.71 ? 'text-orange-500' : 'text-green-600'}`}>
                            {formatProbability(r.probability)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-2xl text-sm font-medium ${getSegmentColor(r.segment)}`}>
                          {r.segment === "High" ? "🔥 Cao" : r.segment === "Medium" ? "⚡ Trung bình" : "🌱 Thấp"} ({r.segment})
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[250px] whitespace-normal break-words">
                        {getSegmentExplanation(r.segment)}
                      </TableCell>
                      <TableCell>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {getActionableAdvice(r.segment).map((advice: string, i: number) => (
                            <li key={i}>{advice}</li>
                          ))}
                        </ul>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}

      {job.status === "completed" && results.length === 0 && (
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="py-8 text-center text-muted-foreground">
            <p>Chưa có kết quả dự đoán. Vui lòng kiểm tra lại dữ liệu đầu vào.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
