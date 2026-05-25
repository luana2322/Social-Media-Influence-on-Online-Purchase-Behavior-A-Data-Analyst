export interface SearchArticle {
  title: string
  url: string
  snippet: string
  source: string
}

interface AnalysisSnapshot {
  segments?: { name: string; count: number; pct: number }[]
  channels?: { name: string; count: number; pct: number }[]
  channelPerformance?: { name: string; totalCount: number; conversions: number; conversionRate: string }[]
  conversions?: number
  conversionRate?: string
}

export function generateSearchQueries(analysis: AnalysisSnapshot): string[] {
  const queries: string[] = []
  const hot = analysis.segments?.find((s) => s.name === "hot" || s.name.toLowerCase().includes("hot"))
  if (hot && hot.pct > 15) queries.push("chiến lược marketing cho khách hàng tiềm năng")
  const warm = analysis.segments?.find((s) => s.name === "warm" || s.name.toLowerCase().includes("warm"))
  if (warm && warm.pct > 30) queries.push("cách nuôi dưỡng khách hàng tiềm năng email marketing")
  const cold = analysis.segments?.find((s) => s.name === "cold" || s.name.toLowerCase().includes("cold"))
  if (cold && cold.pct > 40) queries.push("chiến lược retargeting khách hàng cũ")
  if (analysis.channelPerformance && analysis.channelPerformance.length > 0) {
    queries.push(`tối ưu ${analysis.channelPerformance[0].name} marketing tỷ lệ chuyển đổi`)
  } else if (analysis.channels && analysis.channels.length > 0) {
    queries.push(`chiến lược marketing ${analysis.channels[0].name} hiệu quả`)
  }
  if (analysis.conversions !== undefined && analysis.conversions > 0) {
    const rate = parseFloat(analysis.conversionRate || "0")
    queries.push(rate < 15 ? "cách cải thiện tỷ lệ chuyển đổi website" : "tối ưu tỷ lệ chuyển đổi bán hàng")
  }
  queries.push("marketing automation best practices 2024", "customer segmentation strategy")
  return [...new Set(queries)].slice(0, 4)
}

export async function fetchArticles(query: string): Promise<SearchArticle[]> {
  try {
    const res = await fetch("/api/recommendations/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    })
    const data = await res.json()
    return data.articles || []
  } catch {
    return []
  }
}

export async function pickRelevantArticles(analysis: AnalysisSnapshot, count = 4): Promise<SearchArticle[]> {
  const queries = generateSearchQueries(analysis)
  const results: SearchArticle[] = []
  const seen = new Set<string>()

  for (const q of queries) {
    if (results.length >= count) break
    const articles = await fetchArticles(q)
    for (const a of articles) {
      if (results.length >= count) break
      if (!seen.has(a.url)) {
        seen.add(a.url)
        results.push(a)
      }
    }
  }

  return results
}
