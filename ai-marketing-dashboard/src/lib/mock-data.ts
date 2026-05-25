import type {
  KpiCard,
  AiInsight,
  AudienceSegment,
  Recommendation,
  AnalysisResult,
} from "@/types"

export const kpiCards: KpiCard[] = [
  {
    label: "Khách hàng có ý định cao",
    value: "17,500",
    change: "+12%",
    trend: "up",
    subtitle: "35% tổng số khách hàng",
  },
  {
    label: "Doanh thu dự kiến",
    value: "$2.4M",
    change: "+22%",
    trend: "up",
    subtitle: "Dựa trên AOV dự kiến",
  },
  {
    label: "Tiềm năng chuyển đổi",
    value: "35%",
    change: "+8%",
    trend: "up",
    subtitle: "Người dùng sẵn sàng mua",
  },
  {
    label: "Xu hướng tương tác",
    value: "+12%",
    change: "+5%",
    trend: "up",
    subtitle: "Cao hơn đợt trước",
  },
]

export const aiInsights: AiInsight[] = [
  {
    id: "insight-1",
    headline: "Người dùng TikTok chuyển đổi tốt hơn 31% sau 8PM",
    body: "Lượng truy cập buổi tối từ TikTok cho thấy ý định mua hàng cao hơn đáng kể. Cân nhắc chuyển ngân sách quảng cáo buổi tối sang TikTok.",
    impact: "high",
    category: "opportunity",
  },
  {
    id: "insight-2",
    headline: "Khách quay lại mua gấp 3 lần",
    body: "Khách truy cập lại có tỷ lệ chuyển đổi cao hơn nhiều. Hãy triển khai chiến dịch tiếp cận lại.",
    impact: "high",
    category: "opportunity",
  },
  {
    id: "insight-3",
    headline: "Cảm xúc tích cực thúc đẩy mua lại",
    body: "Điểm cảm xúc cao tương quan mạnh với hành vi mua lại. Tập trung vào các sáng kiến hài lòng khách hàng.",
    impact: "medium",
    category: "trend",
  },
  {
    id: "insight-4",
    headline: "Email marketing có tỷ lệ chuyển đổi 28%",
    body: "Email vượt trội hơn tất cả các kênh khác. Phân bổ lại 30% ngân sách quảng cáo sang chiến dịch email.",
    impact: "high",
    category: "opportunity",
  },
  {
    id: "insight-5",
    headline: "Người dùng di động chuyển đổi tốt gấp 2 lần với thanh toán đơn giản",
    body: "Tỷ lệ bỏ giỏ hàng giảm đáng kể khi thanh toán có ít bước hơn. Tối ưu hóa quy trình thanh toán trên di động.",
    impact: "medium",
    category: "action",
  },
]

export const audienceSegments: AudienceSegment[] = [
  {
    id: "hot",
    name: "Khách nóng",
    icon: "flame",
    count: 17500,
    percentage: 35,
    description: "Đang mua sắm tích cực. Đã xem 5+ trang, dành 10+ phút. Sẵn sàng mua trong vài ngày.",
    action: "Gửi flash sale 24h qua email + SMS",
    color: "#ef4444",
    bgColor: "bg-red-50 dark:bg-red-950/20",
  },
  {
    id: "warm",
    name: "Khách ấm",
    icon: "star",
    count: 22500,
    percentage: 45,
    description: "Quan tâm và đang so sánh lựa chọn. Cần thúc đẩy bằng bằng chứng xã hội và nội dung giáo dục.",
    action: "Gửi chuỗi nuôi dưỡng 5 ngày với đánh giá",
    color: "#eab308",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
  },
  {
    id: "cold",
    name: "Khách lạnh",
    icon: "snowflake",
    count: 10000,
    percentage: 20,
    description: "Khách truy cập lần đầu và người dùng ít tương tác. Cần nhận biết thương hiệu trước khi mua.",
    action: "Chạy quảng cáo tiếp cận lại và chiến dịch thương hiệu",
    color: "#6b7280",
    bgColor: "bg-gray-50 dark:bg-gray-950/20",
  },
]

export const recommendations: Recommendation[] = [
  {
    id: "rec-1",
    title: "Nhắm Khách nóng với Flash Sale",
    description: "17,500 khách hàng có ý định cao sẵn sàng mua. Triển khai chiến dịch giảm giá 24h qua email và SMS.",
    impact: "high",
    cta: "Triển khai",
  },
  {
    id: "rec-2",
    title: "Chuyển ngân sách quảng cáo sang tối",
    description: "Chuyển đổi đỉnh 48% vào 7-9 PM. Phân bổ lại 40% ngân sách ban ngày sang khung giờ tối.",
    impact: "high",
    cta: "Điều chỉnh",
  },
  {
    id: "rec-3",
    title: "Tiếp cận lại khách quay lại",
    description: "Khách quay lại chuyển đổi gấp 3 lần. Triển khai chiến dịch tiếp cận lại với ưu đãi cá nhân hóa.",
    impact: "high",
    cta: "Tạo chiến dịch",
  },
  {
    id: "rec-4",
    title: "Tối ưu Email Marketing",
    description: "Email có ROI cao nhất (28% chuyển đổi). Tăng tần suất email và đầu tư vào tự động hóa.",
    impact: "medium",
    cta: "Tối ưu",
  },
]

export const landingFeatures = [
  {
    title: "Dự đoán mua hàng",
    description: "AI dự đoán khách hàng nào sẽ mua với độ chính xác 95.7%. Tập trung ngân sách vào đúng đối tượng.",
    icon: "zap",
  },
  {
    title: "Thông tin khách hàng",
    description: "Tự động phân khúc khách hàng thành nhóm Nóng, Ấm và Lạnh với đề xuất hành động.",
    icon: "users",
  },
  {
    title: "Phân tích thông minh",
    description: "Tự động phát hiện xu hướng và cơ hội trong dữ liệu marketing của bạn.",
    icon: "trending-up",
  },
]

export const allMockData: AnalysisResult = {
  totalCustomers: 50000,
  highIntent: 17500,
  predictedRevenue: "$2.4M",
  conversionPotential: "35%",
  engagementTrend: "+12%",
  segments: audienceSegments,
  insights: aiInsights,
  recommendations: recommendations,
  accuracy: "95.7%",
}
