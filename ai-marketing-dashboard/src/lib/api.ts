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

  return response.json()
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
  dataset: string
  status: "pending" | "processing" | "completed" | "failed"
  progress: number
  createdAt: string
}
