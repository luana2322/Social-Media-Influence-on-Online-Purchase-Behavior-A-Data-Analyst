import type { DashboardData, SegmentData, TrafficSource, TimeDataPoint } from "./types";

export function generateInsights(data: DashboardData): string[] {
  const insights: string[] = [];

  // Rule 1: High-intent trend
  const highIntent = data.segments.find(s => s.minProb >= 0.8);
  if (highIntent && highIntent.value > 30) {
    insights.push(`High-intent users segment is ${highIntent.value}% of your base - prioritize immediate conversion campaigns`);
  }

  // Rule 2: Under-converted segment
  const mediumSegment = data.segments.find(s => s.minProb >= 0.71 && s.maxProb < 0.8);
  if (mediumSegment && mediumSegment.value > 40) {
    insights.push(`Medium-intent users (${mediumSegment.value}%) need nurturing - try educational content and limited-time offers`);
  }

  // Rule 3: Best channel
  const bestChannel = [...data.trafficSources].sort((a, b) => b.conversionRate - a.conversionRate)[0];
  if (bestChannel) {
    insights.push(`Focus budget on ${bestChannel.source} - highest conversion at ${(bestChannel.conversionRate * 100).toFixed(1)}%`);
  }

  // Rule 4: Time-based insight
  const peakHour = [...data.timeData].sort((a, b) => b.conversionRate - a.conversionRate)[0];
  if (peakHour && peakHour.hour !== undefined) {
    const hourStr = `${peakHour.hour}:00 - ${peakHour.hour + 2}:00`;
    insights.push(`Best time to target users: ${hourStr} when conversion peaks at ${(peakHour.conversionRate * 100).toFixed(1)}%`);
  }

  // Rule 5: Revenue opportunity
  const totalUsers = data.kpiStats.find(s => s.title.includes("Users"))?.value;
  if (totalUsers) {
    insights.push(`Revenue opportunity: ${data.segments.filter(s => s.minProb >= 0.71).reduce((sum, s) => sum + s.count, 0).toLocaleString()} high-value users identified`);
  }

  return insights.slice(0, 3);
}

export function generateSegmentInsight(segment: SegmentData): string {
  if (segment.minProb >= 0.8) {
    return `With ${(segment.minProb * 100).toFixed(0)}%+ purchase probability, these users are ready to buy. Immediate action required.`;
  } else if (segment.minProb >= 0.71) {
    return `These users show interest but need persuasion. Content marketing and social proof work best here.`;
  } else {
    return `Low intent users require retargeting. Focus on brand awareness and special discount campaigns.`;
  }
}

export function generateFeatureInsight(feature: { feature: string; importance: number }): string {
  const percentage = (feature.importance * 100).toFixed(0);
  return `${feature.feature} contributes +${percentage}% to purchase probability`;
}
