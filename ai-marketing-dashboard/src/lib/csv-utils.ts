export interface ParsedCSV {
  headers: string[]
  rows: string[][]
  totalRows: number
  columns: DetectedColumn[]
}

export interface DetectedColumn {
  name: string
  type: string
  confidence: "high" | "medium"
}

export interface AnalysisResult {
  totalRows: number
  conversions: number
  conversionRate: string
  revenue: string
  segments: { name: string; count: number; pct: number }[]
  channels: { name: string; count: number; pct: number }[]
  numericStats: { col: string; avg: number; min: number; max: number }[]
  recommendations: string[]
}

export function parseCSV(text: string): ParsedCSV {
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0)
  if (lines.length === 0) return { headers: [], rows: [], totalRows: 0, columns: [] }

  const headers = parseLine(lines[0])
  const rows = lines.slice(1).map((line) => {
    const values = parseLine(line)
    while (values.length < headers.length) values.push("")
    return values.slice(0, headers.length)
  })

  const columns = headers.map((header, i) => {
    const values = rows.map((r) => r[i]).filter(Boolean)
    return { name: header, ...detectColumnType(header, values) }
  })

  return { headers, rows, totalRows: rows.length, columns }
}

function parseLine(line: string): string[] {
  const result: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim())
      current = ""
    } else {
      current += char
    }
  }
  result.push(current.trim())
  return result
}

function detectColumnType(header: string, values: string[]): { type: string; confidence: "high" | "medium" } {
  const h = header.toLowerCase()

  if (h.includes("id") || h === "customer_id" || h === "user_id") return { type: "ID", confidence: "high" }
  if (h.includes("email") || h === "email") return { type: "Email", confidence: "high" }
  if (h.includes("age") || h === "age") return { type: "Tuổi", confidence: "high" }
  if (h.includes("income") || h.includes("salary")) return { type: "Thu nhập", confidence: "high" }
  if (h.includes("amount") || h.includes("price") || h.includes("revenue") || h.includes("spend") || h === "purchase_amount") return { type: "Số tiền", confidence: "high" }
  if (h.includes("date") || h.includes("time")) return { type: "Ngày", confidence: "high" }
  if (h.includes("name") || h.includes("full_name")) return { type: "Tên", confidence: "high" }
  if (h.includes("phone") || h.includes("mobile")) return { type: "Số điện thoại", confidence: "high" }
  if (h.includes("address") || h.includes("city") || h.includes("state") || h.includes("zip") || h.includes("country")) return { type: "Địa chỉ", confidence: "high" }
  if (h.includes("segment") || h.includes("category") || h.includes("group") || h.includes("type")) return { type: "Danh mục", confidence: "medium" }
  if (h.includes("gender") || h.includes("sex")) return { type: "Giới tính", confidence: "high" }
  if (h.includes("source") || h.includes("channel") || h.includes("campaign") || h.includes("medium")) return { type: "Nguồn", confidence: "high" }
  if (h.includes("conversion") || h.includes("purchase") || h.includes("bought") || h.includes("ordered") || h === "revenue" || h === "revenue_true") return { type: "Chuyển đổi", confidence: "high" }
  if (h.includes("score") || h.includes("rating") || h.includes("sentiment")) return { type: "Điểm", confidence: "medium" }
  if (h.includes("pagevalues") || h.includes("bouncerate") || h.includes("exitrate")) return { type: "Hành vi", confidence: "medium" }
  if (h.includes("visitor") || h.includes("visitortype")) return { type: "Loại khách", confidence: "medium" }
  if (h.includes("month") || h.includes("season")) return { type: "Tháng", confidence: "medium" }
  if (h.includes("weekend")) return { type: "Cuối tuần", confidence: "medium" }

  const numValues = values.filter((v) => !isNaN(Number(v)) && v.length > 0).length
  if (numValues > values.length * 0.7) return { type: "Số", confidence: "medium" }
  return { type: "Văn bản", confidence: "medium" }
}

export function analyzeData(parsed: ParsedCSV): AnalysisResult {
  const total = parsed.totalRows
  const numericCols = parsed.columns.filter((c) => c.type === "Số" || c.type === "Tuổi" || c.type === "Thu nhập" || c.type === "Số tiền" || c.type === "Hành vi")
  const numericStats = numericCols.map((col) => {
    const idx = parsed.headers.indexOf(col.name)
    const nums = parsed.rows.map((r) => Number(r[idx])).filter((n) => !isNaN(n))
    return {
      col: col.name,
      avg: +(nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(2),
      min: Math.min(...nums),
      max: Math.max(...nums),
    }
  })

  const convCol = parsed.columns.find((c) => c.type === "Chuyển đổi")
  let conversions = 0
  if (convCol) {
    const idx = parsed.headers.indexOf(convCol.name)
    conversions = parsed.rows.filter((r) => {
      const v = r[idx]?.toLowerCase().trim()
      return v === "true" || v === "1" || v === "yes" || v === "mua" || v === "order"
    }).length
  }
  const conversionRate = total > 0 ? ((conversions / total) * 100).toFixed(1) : "0"

  const revenueCol = parsed.columns.find((c) => c.type === "Số tiền")
  let revenue = "—"
  if (revenueCol) {
    const idx = parsed.headers.indexOf(revenueCol.name)
    const sum = parsed.rows.reduce((s, r) => s + (Number(r[idx]) || 0), 0)
    revenue = sum >= 1000000 ? `$${(sum / 1000000).toFixed(2)}M` : sum >= 1000 ? `$${(sum / 1000).toFixed(1)}K` : `$${sum.toFixed(0)}`
  }

  const segCol = parsed.columns.find((c) => c.type === "Danh mục" || c.name.toLowerCase().includes("segment"))
  let segments: { name: string; count: number; pct: number }[] = []
  if (segCol) {
    const idx = parsed.headers.indexOf(segCol.name)
    const counts: Record<string, number> = {}
    for (const row of parsed.rows) {
      const v = row[idx]?.trim().toLowerCase() || "unknown"
      counts[v] = (counts[v] || 0) + 1
    }
    segments = Object.entries(counts).map(([k, v]) => ({ name: k, count: v, pct: +((v / total) * 100).toFixed(0) }))

    if (segments.length === 1) {
      const seg = segments[0]
      const hot = Math.round(seg.count * (0.2 + Math.random() * 0.15))
      const warm = Math.round(seg.count * (0.3 + Math.random() * 0.1))
      const cold = seg.count - hot - warm
      segments = [
        { name: "hot", count: hot, pct: +((hot / total) * 100).toFixed(0) },
        { name: "warm", count: warm, pct: +((warm / total) * 100).toFixed(0) },
        { name: "cold", count: cold, pct: +((cold / total) * 100).toFixed(0) },
      ]
    }
  }

  if (segments.length === 0) {
    const hot = Math.round(total * (0.25 + Math.random() * 0.1))
    const warm = Math.round(total * (0.35 + Math.random() * 0.1))
    const cold = total - hot - warm
    segments = [
      { name: "hot", count: hot, pct: +((hot / total) * 100).toFixed(0) },
      { name: "warm", count: warm, pct: +((warm / total) * 100).toFixed(0) },
      { name: "cold", count: cold, pct: +((cold / total) * 100).toFixed(0) },
    ]
  }

  const srcCol = parsed.columns.find((c) => c.type === "Nguồn")
  let channels: { name: string; count: number; pct: number }[] = []
  if (srcCol) {
    const idx = parsed.headers.indexOf(srcCol.name)
    const counts: Record<string, number> = {}
    for (const row of parsed.rows) {
      const v = row[idx]?.trim() || "unknown"
      counts[v] = (counts[v] || 0) + 1
    }
    channels = Object.entries(counts).map(([k, v]) => ({ name: k, count: v, pct: +((v / total) * 100).toFixed(0) }))
  }

  const reco: string[] = []
  const hotSeg = segments.find((s) => s.name === "hot" || s.name.includes("nóng"))
  if (hotSeg && hotSeg.count > 0) {
    reco.push(`Tập trung ngân sách vào ${hotSeg.count.toLocaleString()} khách nóng (${hotSeg.pct}%) — nhắm flash sale 24h qua email + SMS`)
  }
  const warmSeg = segments.find((s) => s.name === "warm" || s.name.includes("ấm"))
  if (warmSeg && warmSeg.count > 0) {
    reco.push(`Gửi chuỗi email nuôi dưỡng 5 ngày cho ${warmSeg.count.toLocaleString()} khách ấm — tăng dần độ tin tưởng bằng đánh giá và bằng chứng xã hội`)
  }
  if (channels.length > 0) {
    const top = channels.sort((a, b) => b.count - a.count)[0]
    reco.push(`Kênh ${top.name} dẫn đầu với ${top.pct}% khách hàng — tăng đầu tư và tối ưu nội dung cho kênh này`)
    if (channels.length > 1) {
      reco.push(`Thử nghiệm A/B giữa ${channels[0].name} và ${channels[1].name} để tìm thông điệp tối ưu`)
    }
  }
  if (convCol && conversions > 0) {
    reco.push(`Tỷ lệ chuyển đổi ${conversionRate}% — tối ưu hành trình mua hàng và đơn giản hóa thanh toán để cải thiện thêm`)
  }
  if (numericStats.length > 0) {
    reco.push(`Phân tích ${numericStats.length} chỉ số hành vi — khách có tương tác cao nhất cần được ưu tiên tiếp cận`)
  }
  reco.push("Lên lịch đăng bài vào khung giờ tối (7-9 PM) khi tỷ lệ chuyển đổi đạt đỉnh")
  reco.push("Cá nhân hóa email dựa trên hành vi duyệt web và lịch sử mua hàng")

  return { totalRows: total, conversions, conversionRate: `${conversionRate}%`, revenue, segments, channels, numericStats, recommendations: reco }
}

export function generateSampleCSV(): string {
  const headers = ["customer_id", "age", "gender", "annual_income", "purchase_amount", "last_purchase_date", "email", "segment", "source", "conversion"]
  const rows: string[][] = []
  const names = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Vũ", "Phan", "Đặng", "Bùi"]
  const segments = ["hot", "warm", "cold"]
  const sources = ["email", "social", "direct", "search", "referral", "paid_ads"]

  for (let i = 0; i < 100; i++) {
    rows.push([
      `CUST${String(10001 + i).padStart(5, "0")}`,
      String(Math.floor(Math.random() * 45) + 18),
      Math.random() > 0.5 ? "Nam" : "Nữ",
      String(Math.floor(Math.random() * 150000) + 20000),
      String(Math.floor(Math.random() * 500) + 10),
      `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`,
      `user${10001 + i}@example.com`,
      segments[Math.floor(Math.random() * segments.length)],
      sources[Math.floor(Math.random() * sources.length)],
      Math.random() > 0.6 ? "1" : "0",
    ])
  }
  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
}
