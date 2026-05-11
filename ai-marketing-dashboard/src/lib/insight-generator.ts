import type { AiInsight, AudienceSegment } from "@/types";

function generateId(): string {
  return "insight-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6);
}

export function generateInsights(segments: AudienceSegment[]): AiInsight[] {
  const insights: AiInsight[] = [];

  const hot = segments.find((s) => s.id === "hot");
  if (hot && hot.percentage > 30) {
    insights.push({
      id: generateId(),
      headline: "Hot buyers are " + hot.percentage + "% of your audience",
      body: hot.count.toLocaleString() + " high-intent customers are ready to purchase. Launch immediate conversion campaigns.",
      impact: "high",
      category: "opportunity",
    });
  }

  const warm = segments.find((s) => s.id === "warm");
  if (warm && warm.percentage > 40) {
    insights.push({
      id: generateId(),
      headline: "Warm audience needs nurturing",
      body: warm.count.toLocaleString() + " interested customers need educational content and social proof to convert.",
      impact: "medium",
      category: "action",
    });
  }

  insights.push({
    id: generateId(),
    headline: "Email marketing delivers highest ROI",
    body: "Email converts at 28% — the highest of any channel. Increase email frequency and invest in automation.",
    impact: "high",
    category: "opportunity",
  });

  return insights.slice(0, 3);
}
