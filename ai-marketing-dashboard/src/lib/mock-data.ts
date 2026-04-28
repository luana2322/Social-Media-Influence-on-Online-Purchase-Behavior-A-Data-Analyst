export const dashboardStats = [
  { title: "Total Jobs", value: "142", icon: "Brain", change: "+12%", changeType: "positive" },
  { title: "Processed Records", value: "1.2M", icon: "Database", change: "+8%", changeType: "positive" },
  { title: "Model Accuracy", value: "94.7%", icon: "TrendingUp", change: "+2.1%", changeType: "positive" },
  { title: "Active Users", value: "89", icon: "Users", change: "-3%", changeType: "negative" },
];

export const jobs = [
  {
    id: "job_12345",
    dataset: "customer_segments_march.csv",
    status: "completed",
    progress: 100,
    createdAt: "2026-04-28T10:00:00Z",
    records: 150000,
  },
  {
    id: "job_12346",
    dataset: "q1_campaign_data.csv",
    status: "processing",
    progress: 65,
    createdAt: "2026-04-27T14:30:00Z",
    records: 89000,
  },
  {
    id: "job_12347",
    dataset: "user_behavior_q2.csv",
    status: "completed",
    progress: 100,
    createdAt: "2026-04-26T09:15:00Z",
    records: 234000,
  },
  {
    id: "job_12348",
    dataset: "churn_prediction_march.csv",
    status: "failed",
    progress: 45,
    createdAt: "2026-04-25T16:45:00Z",
    records: 67000,
  },
  {
    id: "job_12349",
    dataset: "customer_lifetime_value.csv",
    status: "completed",
    progress: 100,
    createdAt: "2026-04-24T11:20:00Z",
    records: 312000,
  },
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
