// Existing data
export const dashboardStats = [
  { title: "Total Jobs", value: "142", icon: "Brain", change: "+12%", changeType: "positive" },
  { title: "Processed Records", value: "1.2M", icon: "Database", change: "+8%", changeType: "positive" },
  { title: "Model Accuracy", value: "94.7%", icon: "TrendingUp", change: "+2.1%", changeType: "positive" },
  { title: "Active Users", value: "89", icon: "Users", change: "-3%", changeType: "negative" },
];

export const segmentationData = [
  { name: "High", value: 35, fill: "#4f46e5" },
  { name: "Medium", value: 45, fill: "#818cf8" },
  { name: "Low", value: 20, fill: "#c7d2fe" },
];

export const predictionOverTime = [
  { month: "Jan", predictions: 120 },
  { month: "Feb", predictions: 210 },
  { month: "Mar", predictions: 180 },
  { month: "Apr", predictions: 240 },
  { month: "May", predictions: 320 },
  { month: "Jun", predictions: 280 },
];

export const fileColumns = [
  { name: "customer_id", type: "string" },
  { name: "age", type: "number" },
  { name: "annual_income", type: "number" },
  { name: "purchase_amount", type: "number" },
  { name: "segment", type: "string" },
  { name: "last_purchase_date", type: "date" },
  { name: "email", type: "string" },
  { name: "phone", type: "string" },
];

export const sampleData = [
  { customer_id: "CUST_001", age: 34, annual_income: 85000, purchase_amount: 1200, segment: "High", last_purchase_date: "2026-04-15", email: "john@example.com", phone: "555-0100" },
  { customer_id: "CUST_002", age: 28, annual_income: 52000, purchase_amount: 450, segment: "Medium", last_purchase_date: "2026-04-10", email: "jane@example.com", phone: "555-0101" },
  { customer_id: "CUST_003", age: 45, annual_income: 120000, purchase_amount: 2100, segment: "High", last_purchase_date: "2026-04-20", email: "bob@example.com", phone: "555-0102" },
  { customer_id: "CUST_004", age: 22, annual_income: 38000, purchase_amount: 180, segment: "Low", last_purchase_date: "2026-03-28", email: "alice@example.com", phone: "555-0103" },
  { customer_id: "CUST_005", age: 31, annual_income: 67000, purchase_amount: 780, segment: "Medium", last_purchase_date: "2026-04-18", email: "charlie@example.com", phone: "555-0104" },
  { customer_id: "CUST_006", age: 39, annual_income: 95000, purchase_amount: 1500, segment: "High", last_purchase_date: "2026-04-22", email: "diana@example.com", phone: "555-0105" },
  { customer_id: "CUST_007", age: 26, annual_income: 45000, purchase_amount: 320, segment: "Low", last_purchase_date: "2026-04-05", email: "eve@example.com", phone: "555-0106" },
  { customer_id: "CUST_008", age: 42, annual_income: 78000, purchase_amount: 920, segment: "Medium", last_purchase_date: "2026-04-19", email: "frank@example.com", phone: "555-0107" },
  { customer_id: "CUST_009", age: 29, annual_income: 58000, purchase_amount: 510, segment: "Medium", last_purchase_date: "2026-04-12", email: "grace@example.com", phone: "555-0108" },
  { customer_id: "CUST_010", age: 51, annual_income: 135000, purchase_amount: 2800, segment: "High", last_purchase_date: "2026-04-25", email: "henry@example.com", phone: "555-0109" },
];

// ==================== NEW DASHBOARD DATA ====================

// KPI Stats with insights
export const kpiStats = [
  {
    title: "Total Users Analyzed",
    value: "50,000",
    icon: "Users",
    change: "+12%",
    changeType: "positive" as const,
    insight: "12% more than last batch"
  },
  {
    title: "Predicted Buyers",
    value: "17,500",
    icon: "TrendingUp",
    change: "+8%",
    changeType: "positive" as const,
    insight: "35% conversion rate projected"
  },
  {
    title: "High-Intent Users",
    value: "12,250",
    icon: "Target",
    change: "+15%",
    changeType: "positive" as const,
    insight: "Best segment for flash sales"
  },
  {
    title: "Revenue Opportunity",
    value: "$2.4M",
    icon: "DollarSign",
    change: "+22%",
    changeType: "positive" as const,
    insight: "Based on predicted AOV × users"
  }
];

// Enhanced Segmentation Data
export const enhancedSegmentationData = [
  {
    name: "High (≥0.8)",
    value: 35,
    fill: "#4f46e5",
    count: 17500,
    minProb: 0.8,
    maxProb: 1.0,
    description: "Users with very high purchase intent. Typically visited 5+ pages, spent 10+ mins, high sentiment.",
    recommendedAction: "Send immediate discount or limited-time offer"
  },
  {
    name: "Medium (0.71-0.8)",
    value: 45,
    fill: "#818cf8",
    count: 22500,
    minProb: 0.71,
    maxProb: 0.79,
    description: "Interested users who need a nudge. Moderate engagement, positive sentiment, comparison shopping.",
    recommendedAction: "Nurture with educational content and social proof"
  },
  {
    name: "Low (<0.71)",
    value: 20,
    fill: "#c7d2fe",
    count: 10000,
    minProb: 0.0,
    maxProb: 0.70,
    description: "Low intent users. May be browsing, first-time visitors, or have low engagement scores.",
    recommendedAction: "Retargeting ads and brand awareness campaigns"
  }
];

// SHAP Feature Importance
export const shapData = [
  { feature: "Engagement Score", importance: 0.32, description: "+32% to purchase probability" },
  { feature: "Page Views", importance: 0.28, description: "+28% to purchase probability" },
  { feature: "Session Duration", importance: 0.24, description: "+24% to purchase probability" },
  { feature: "Sentiment Score", importance: 0.21, description: "+21% to purchase probability" },
  { feature: "Previous Purchases", importance: 0.18, description: "+18% to purchase probability" },
  { feature: "Income Level", importance: 0.15, description: "+15% to purchase probability" },
  { feature: "Age Group", importance: 0.12, description: "+12% to purchase probability" },
  { feature: "Traffic Source", importance: 0.10, description: "+10% to purchase probability" },
  { feature: "Time on Site", importance: 0.08, description: "+8% to purchase probability" },
  { feature: "Device Type", importance: 0.05, description: "+5% to purchase probability" }
];

// Engagement vs Purchase Probability Data
export interface EngagementDataPoint {
  engagementScore: number;
  purchaseProbability: number;
  converted: boolean;
}

export const engagementData: EngagementDataPoint[] = Array.from({ length: 50 }, (_, i) => {
  const engagement = 0.1 + Math.random() * 0.9;
  const prob = engagement * 0.6 + Math.random() * 0.3;
  return {
    engagementScore: Math.round(engagement * 100) / 100,
    purchaseProbability: Math.round(prob * 100) / 100,
    converted: prob > 0.71
  };
});

// Sentiment vs Conversion Rate
export const sentimentData = [
  { sentimentScore: 0.1, conversionRate: 0.08 },
  { sentimentScore: 0.2, conversionRate: 0.12 },
  { sentimentScore: 0.3, conversionRate: 0.18 },
  { sentimentScore: 0.4, conversionRate: 0.22 },
  { sentimentScore: 0.5, conversionRate: 0.28 },
  { sentimentScore: 0.6, conversionRate: 0.35 },
  { sentimentScore: 0.7, conversionRate: 0.42 },
  { sentimentScore: 0.8, conversionRate: 0.55 },
  { sentimentScore: 0.9, conversionRate: 0.68 },
  { sentimentScore: 1.0, conversionRate: 0.75 },
];

// Traffic Source Analysis
export const trafficSourceData = [
  { source: "Social Media", conversionRate: 0.23, count: 5000, revenue: 450000 },
  { source: "Direct", conversionRate: 0.18, count: 3000, revenue: 320000 },
  { source: "Organic Search", conversionRate: 0.15, count: 2500, revenue: 280000 },
  { source: "Email", conversionRate: 0.28, count: 1500, revenue: 180000 },
  { source: "Paid Ads", conversionRate: 0.12, count: 4000, revenue: 350000 },
  { source: "Referral", conversionRate: 0.20, count: 1000, revenue: 120000 },
];

// Time Analysis (Hourly)
export const timeDataHourly = [
  { hour: 0, conversionRate: 0.05, transactionCount: 120 },
  { hour: 1, conversionRate: 0.03, transactionCount: 80 },
  { hour: 2, conversionRate: 0.02, transactionCount: 50 },
  { hour: 3, conversionRate: 0.02, transactionCount: 40 },
  { hour: 4, conversionRate: 0.03, transactionCount: 60 },
  { hour: 5, conversionRate: 0.04, transactionCount: 90 },
  { hour: 6, conversionRate: 0.08, transactionCount: 200 },
  { hour: 7, conversionRate: 0.12, transactionCount: 350 },
  { hour: 8, conversionRate: 0.18, transactionCount: 520 },
  { hour: 9, conversionRate: 0.22, transactionCount: 680 },
  { hour: 10, conversionRate: 0.25, transactionCount: 750 },
  { hour: 11, conversionRate: 0.28, transactionCount: 820 },
  { hour: 12, conversionRate: 0.30, transactionCount: 900 },
  { hour: 13, conversionRate: 0.32, transactionCount: 950 },
  { hour: 14, conversionRate: 0.35, transactionCount: 1050 },
  { hour: 15, conversionRate: 0.38, transactionCount: 1150 },
  { hour: 16, conversionRate: 0.36, transactionCount: 1100 },
  { hour: 17, conversionRate: 0.34, transactionCount: 1020 },
  { hour: 18, conversionRate: 0.40, transactionCount: 1200 },
  { hour: 19, conversionRate: 0.42, transactionCount: 1250 },
  { hour: 20, conversionRate: 0.45, transactionCount: 1350 },
  { hour: 21, conversionRate: 0.48, transactionCount: 1400 },
  { hour: 22, conversionRate: 0.35, transactionCount: 1050 },
  { hour: 23, conversionRate: 0.15, transactionCount: 450 },
];

// Time Analysis (Daily)
export const timeDataDaily = [
  { day: "Mon", conversionRate: 0.32, transactionCount: 5000 },
  { day: "Tue", conversionRate: 0.38, transactionCount: 5800 },
  { day: "Wed", conversionRate: 0.35, transactionCount: 5400 },
  { day: "Thu", conversionRate: 0.36, transactionCount: 5600 },
  { day: "Fri", conversionRate: 0.42, transactionCount: 6500 },
  { day: "Sat", conversionRate: 0.48, transactionCount: 7500 },
  { day: "Sun", conversionRate: 0.28, transactionCount: 4200 },
];

// AI Insights
export const aiInsights = [
  "High-intent users increased by 12% compared to last batch - scale up retargeting budget",
  "Users with high engagement but low sentiment are under-converted - improve post-purchase experience",
  "Email marketing shows 28% conversion rate - highest ROI channel, increase frequency",
];

// Recommendations
export const recommendations = [
  {
    id: "rec-1",
    title: "Target High-Intent with Flash Sale",
    description: "17,500 users with ≥80% purchase probability are ready to buy. Send limited-time 24h discount offer via email and SMS.",
    expectedImpact: "High" as const,
    priority: 1,
    segment: "High"
  },
  {
    id: "rec-2",
    title: "Nurture Medium-Intent via Content",
    description: "22,500 medium-intent users need persuasion. Deploy 5-email educational series with customer testimonials and product demos.",
    expectedImpact: "Medium" as const,
    priority: 2,
    segment: "Medium"
  },
  {
    id: "rec-3",
    title: "Optimize Email Channel Budget",
    description: "Email has 28% conversion rate (highest). Reallocate 30% of paid ads budget to email marketing automation tools.",
    expectedImpact: "High" as const,
    priority: 1,
    channel: "Email"
  },
  {
    id: "rec-4",
    title: "Evening Push Notification Campaign",
    description: "Peak conversion at 8-9 PM (48%). Schedule app push notifications and social media ads during 7-9 PM window.",
    expectedImpact: "Medium" as const,
    priority: 3
  }
];
