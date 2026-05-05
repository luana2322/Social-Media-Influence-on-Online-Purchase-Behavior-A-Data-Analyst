export interface KpiStat {
  title: string;
  value: string;
  icon: string;
  change: string;
  changeType: "positive" | "negative";
  insight: string;
}

export interface SegmentData {
  name: string;
  value: number;
  fill: string;
  count: number;
  minProb: number;
  maxProb: number;
  description: string;
  recommendedAction: string;
}

export interface ShapFeature {
  feature: string;
  importance: number;
  description: string;
}

export interface EngagementDataPoint {
  engagementScore: number;
  purchaseProbability: number;
  converted: boolean;
}

export interface SentimentDataPoint {
  sentimentScore: number;
  conversionRate: number;
}

export interface TrafficSource {
  source: string;
  conversionRate: number;
  count: number;
  revenue: number;
}

export interface TimeDataPoint {
  hour?: number;
  day?: string;
  month?: string;
  conversionRate: number;
  transactionCount: number;
}

export interface AiInsight {
  text: string;
  type: "opportunity" | "warning" | "trend";
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  expectedImpact: "High" | "Medium" | "Low";
  priority: number;
  segment?: string;
  channel?: string;
}

export interface DashboardData {
  kpiStats: KpiStat[];
  segments: SegmentData[];
  shapFeatures: ShapFeature[];
  engagementData: EngagementDataPoint[];
  sentimentData: SentimentDataPoint[];
  trafficSources: TrafficSource[];
  timeData: TimeDataPoint[];
  aiInsights: AiInsight[];
  recommendations: Recommendation[];
}
