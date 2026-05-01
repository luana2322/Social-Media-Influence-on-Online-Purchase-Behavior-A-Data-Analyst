const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

export async function uploadDataset(file: File): Promise<{ jobId: number; status: string }> {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch(`${API_BASE}/jobs/upload`, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`)
  }

  const data = await response.json()
  // Backend returns jobId (camelCase)
  return {
    jobId: Number(data.jobId),
    status: data.status
  }
}

export async function getJobStatus(jobId: number): Promise<Job> {
  const response = await fetch(`${API_BASE}/jobs/${jobId}`)

  if (!response.ok) {
    throw new Error(`Failed to get job status: ${response.statusText}`)
  }

  return response.json()
}

export interface Job {
  id: number
  status: string
  progressPercent: number
  totalRecords: number
  processedRecords: number
  createdAt: string
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
  const response = await fetch(`${API_BASE}/jobs/${jobId}/results`)

  if (!response.ok) {
    throw new Error(`Failed to get results: ${response.statusText}`)
  }

  return response.json()
}

export async function askChatbot(question: string, jobId: number): Promise<string> {
  const response = await fetch(`${API_BASE}/chatbot/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, jobId }),
  })

  if (!response.ok) {
    throw new Error(`Chatbot request failed: ${response.statusText}`)
  }

  const data = await response.json()
  return data.answer
}
