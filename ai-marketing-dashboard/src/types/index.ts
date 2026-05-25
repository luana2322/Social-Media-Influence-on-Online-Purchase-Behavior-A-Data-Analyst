export interface KpiCard {
  label: string
  value: string
  change: string
  trend: "up" | "down"
  subtitle: string
}

export interface AiInsight {
  id: string
  headline: string
  body: string
  impact: "high" | "medium" | "low"
  category: "opportunity" | "trend" | "action"
}

export interface AudienceSegment {
  id: string
  name: string
  icon: string
  count: number
  percentage: number
  description: string
  action: string
  color: string
  bgColor: string
}

export interface Recommendation {
  id: string
  title: string
  description: string
  impact: "high" | "medium"
  cta: string
}

export interface AnalysisResult {
  totalCustomers: number
  highIntent: number
  predictedRevenue: string
  conversionPotential: string
  engagementTrend: string
  segments: AudienceSegment[]
  insights: AiInsight[]
  recommendations: Recommendation[]
  accuracy: string
}


