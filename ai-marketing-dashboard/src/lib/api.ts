const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

function authHeaders(): Record<string, string> {
  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function uploadDataset(file: File): Promise<{ jobId: number; status: string }> {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch(`${API_BASE}/jobs/upload`, {
    method: "POST",
    headers: { ...authHeaders() },
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`)
  }

  const data = await response.json()
  return {
    jobId: Number(data.jobId),
    status: data.status
  }
}

export async function getJobStatus(jobId: number): Promise<Job> {
  const response = await fetch(`${API_BASE}/jobs/${jobId}`, {
    headers: { ...authHeaders() },
  })

  if (!response.ok) {
    throw new Error(`Failed to get job status: ${response.statusText}`)
  }

  return response.json()
}

export interface Job {
  id: number
  userId: number
  status: string
  progressPercent: number
  totalRecords: number
  processedRecords: number
  datasetPath?: string
  datasetType?: string
  datasetColumns?: string
  createdAt: string
}

export async function getMyJobs(): Promise<Job[]> {
  const response = await fetch(`${API_BASE}/jobs/my-jobs`, {
    headers: { ...authHeaders() },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch my jobs: ${response.statusText}`)
  }

  return response.json()
}

export async function listJobs(limit: number = 50): Promise<Job[]> {
  const response = await fetch(`${API_BASE}/jobs/list?limit=${limit}`, {
    headers: { ...authHeaders() },
  })

  if (!response.ok) {
    throw new Error(`Failed to list jobs: ${response.statusText}`)
  }

  return response.json()
}

export interface PredictionResult {
  id: number
  jobId: number
  recordId: string
  probability: number
  segment: string
  modelVersion: string
}

export async function getJobResults(jobId: number): Promise<PredictionResult[]> {
  const response = await fetch(`${API_BASE}/jobs/${jobId}/results`, {
    headers: { ...authHeaders() },
  })

  if (!response.ok) {
    throw new Error(`Failed to get results: ${response.statusText}`)
  }

  return response.json()
}

export interface AnalysisSummaryData {
  totalRows: number
  conversions: number
  conversionRate: string
  revenue: string
  segments: { name: string; count: number; pct: number }[]
  channels: { name: string; count: number; pct: number }[]
  recommendations: string[]
  channelPerformance?: { name: string; totalCount: number; conversions: number; conversionRate: string }[]
  completenessScore?: number
}

export async function saveAnalysisSummary(jobId: number, data: AnalysisSummaryData): Promise<void> {
  const response = await fetch(`${API_BASE}/jobs/${jobId}/analysis-summary`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to save analysis summary")
}

export async function getAnalysisSummary(jobId: number): Promise<AnalysisSummaryData | null> {
  const response = await fetch(`${API_BASE}/jobs/${jobId}/analysis-summary`, {
    headers: { ...authHeaders() },
  })
  if (!response.ok) return null
  const data = await response.json()
  if (data.message) return null
  if (typeof data.segments === "string") {
    try { data.segments = JSON.parse(data.segments) } catch { data.segments = [] }
  }
  if (typeof data.channels === "string") {
    try { data.channels = JSON.parse(data.channels) } catch { data.channels = [] }
  }
  if (typeof data.recommendations === "string") {
    try { data.recommendations = JSON.parse(data.recommendations) } catch { data.recommendations = [] }
  }
  return data
}

export async function downloadResults(jobId: number): Promise<void> {
  const response = await fetch(`${API_BASE}/jobs/${jobId}/download`, {
    headers: { ...authHeaders() },
  })

  if (!response.ok) {
    throw new Error(`Download failed: ${response.statusText}`)
  }

  const blob = await response.blob()
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `job_${jobId}_results.csv`
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
}
