// Simple, marketer-friendly mock data (NO technical terms)
import { useLanguage } from "@/i18n/LanguageProvider"

// Overview Stats
export const simpleOverview = [
  {
    title: "Customers Analyzed",
    titleVi: "Khách hàng đã phân tích",
    value: "50,000",
    icon: "Users",
    change: "+12%",
    changeType: "positive" as const,
    insight: "More customers this month",
    insightVi: "Nhiều khách hàng hơn trong tháng này",
  },
  {
    title: "Likely to Buy",
    titleVi: "Có khả năng mua",
    value: "17,500",
    icon: "TrendingUp",
    change: "+8%",
    changeType: "positive" as const,
    insight: "35% are ready to purchase",
    insightVi: "35% đã sẵn sàng mua hàng",
  },
  {
    title: "Revenue Opportunity",
    titleVi: "Cơ hội doanh thu",
    value: "$2.4M",
    icon: "DollarSign",
    change: "+22%",
    changeType: "positive" as const,
    insight: "Potential sales if you act now",
    insightVi: "Doanh thu tiềm năng nếu hành động ngay",
  }
];

// Customer Groups (NO technical terms)
export const customerGroups = [
  {
    name: "🔥 Ready to Buy",
    nameVi: "🔥 Sẵn sàng mua",
    value: 35,
    fill: "#ef4444",
    count: 17500,
    description: "These customers are actively shopping and will likely purchase within days. They visit many pages and spend time on your site.",
    descriptionVi: "Những khách hàng này đang tích cực mua sắm và có thể sẽ mua trong vài ngày tới. Họ xem nhiều trang và dành thời gian trên trang web của bạn.",
    action: "Send a discount code today",
    actionVi: "Gửi mã giảm giá ngay hôm nay",
    actionIcon: "Zap"
  },
  {
    name: "🟡 Considering",
    nameVi: "🟡 Đang cân nhắc",
    value: 45,
    fill: "#eab308",
    count: 22500,
    description: "These customers are interested but need a nudge. They're comparing options and reading reviews.",
    descriptionVi: "Những khách hàng này có hứng thú nhưng cần một tác động. Họ đang so sánh các lựa chọn và đọc đánh giá.",
    action: "Send helpful content and reviews",
    actionVi: "Gửi nội dung hữu ích và đánh giá",
    actionIcon: "Mail"
  },
  {
    name: "⚪ Not Interested Yet",
    nameVi: "⚪ Chưa hứng thú",
    value: 20,
    fill: "#6b7280",
    count: 10000,
    description: "These customers are just browsing. They need to learn more about your brand before buying.",
    descriptionVi: "Những khách hàng này đang chỉ xem qua. Họ cần tìm hiểu thêm về thương hiệu của bạn trước khi mua.",
    action: "Run awareness ads",
    actionVi: "Chạy quảng cáo nhận diện",
    actionIcon: "Eye"
  }
];

// Why Customers Buy (Simple insights, NO technical terms)
export const whyCustomersBuy = [
  { reason: "More site activity", reasonVi: "Hoạt động tích cực hơn", impact: "High", description: "Customers who click more and visit more pages buy 3x more", descriptionVi: "Khách hàng nhấp nhiều hơn và xem nhiều trang mua gấp 3 lần" },
  { reason: "Longer visits", reasonVi: "Lưu lại lâu hơn", impact: "High", description: "Customers who stay 10+ minutes are very likely to purchase", descriptionVi: "Khách hàng ở lại 10+ phút rất có khả năng mua hàng" },
  { reason: "Positive feedback", reasonVi: "Phản hồi tích cực", impact: "Medium", description: "Customers with good experience buy 2x more than unhappy ones", descriptionVi: "Khách hàng có trải nghiệm tốt mua gấp 2 lần người không hài lòng" },
  { reason: "Repeat visitors", reasonVi: "Khách hàng quay lại", impact: "Medium", description: "Customers who bought before are easier to sell to again", descriptionVi: "Khách hàng từng mua trước đó dễ bán lại hơn" },
  { reason: "Mobile-friendly", reasonVi: "Thân thiện với di động", impact: "Low", description: "Customers on mobile devices convert well with simple checkout", descriptionVi: "Khách hàng dùng di động chuyển đổi tốt với thanh toán đơn giản" },
];

// Best Time to Sell
export const bestTimeData = {
  bestHour: "8:00 PM",
  bestHourVi: "8:00 Tối",
  bestDay: "Saturday",
  bestDayVi: "Thứ Bảy",
  peakConversion: "48%",
  timeSlots: [
    { time: "6:00 AM", timeVi: "6:00 Sáng", conversion: "5%", level: "low" },
    { time: "9:00 AM", timeVi: "9:00 Sáng", conversion: "22%", level: "medium" },
    { time: "12:00 PM", timeVi: "12:00 Trưa", conversion: "30%", level: "medium" },
    { time: "3:00 PM", timeVi: "3:00 Chiều", conversion: "35%", level: "high" },
    { time: "6:00 PM", timeVi: "6:00 Tối", conversion: "40%", level: "high" },
    { time: "8:00 PM", timeVi: "8:00 Tối", conversion: "48%", level: "highest" },
    { time: "10:00 PM", timeVi: "10:00 Tối", conversion: "35%", level: "high" },
    { time: "2:00 AM", timeVi: "2:00 Sáng", conversion: "3%", level: "low" },
  ]
};

// Best Marketing Channel
export const channelPerformance = [
  { channel: "📧 Email", channelVi: "📧 Email", conversion: "28%", count: "1,500", recommendation: "Best ROI - send more emails", recommendationVi: "ROI tốt nhất - gửi thêm email" },
  { channel: "📱 Social Media", channelVi: "📱 Mạng xã hội", conversion: "23%", count: "5,000", recommendation: "Great for awareness", recommendationVi: "Tốt cho nhận diện thương hiệu" },
  { channel: "🔍 Search", channelVi: "🔍 Tìm kiếm", conversion: "15%", count: "2,500", recommendation: "Good for active seekers", recommendationVi: "Tốt cho người tìm kiếm chủ động" },
  { channel: "📢 Ads", channelVi: "📢 Quảng cáo", conversion: "12%", count: "4,000", recommendation: "Needs optimization", recommendationVi: "Cần tối ưu hóa" },
  { channel: "👥 Referral", channelVi: "👥 Giới thiệu", conversion: "20%", count: "1,000", recommendation: "High quality, grow this", recommendationVi: "Chất lượng cao, hãy phát triển" },
];

// AI Suggestions (Simple, actionable)
export const aiSuggestions = [
  {
    emoji: "🎯",
    text: "Focus on 17,500 ready-to-buy customers today",
    textVi: "Tập trung vào 17,500 khách hàng sẵn sàng mua ngay hôm nay",
    action: "Send flash sale emails now",
    actionVi: "Gửi email flash sale ngay"
  },
  {
    emoji: "📈",
    text: "Interested customers need follow-up content",
    textVi: "Khách hàng hứng thú cần nội dung theo dõi",
    action: "Start 5-day email nurture series",
    actionVi: "Bắt đầu chuỗi email 5 ngày"
  },
  {
    emoji: "⏰",
    text: "Evening promotions get 48% more sales",
    textVi: "Khuyến mãi buổi tối tăng 48% doanh số",
    action: "Schedule ads for 7-9 PM",
    actionVi: "Lên lịch quảng cáo 7-9 tối"
  }
];

// Simple Recommendations
export const simpleRecommendations = [
  {
    id: "rec-1",
    title: "Target Ready Customers Today",
    titleVi: "Nhắm đến khách hàng sẵn sàng ngay",
    description: "Send a 24-hour discount to 17,500 customers who are ready to buy. Use email + SMS for best results.",
    descriptionVi: "Gửi giảm giá 24 giờ cho 17,500 khách hàng sẵn sàng mua. Dùng email + SMS để có kết quả tốt nhất.",
    priority: 1,
    impact: "High",
    color: "red"
  },
  {
    id: "rec-2",
    title: "Nurture Interested Customers",
    titleVi: "Nuôi dưỡng khách hàng hứng thú",
    description: "Send 5 helpful emails with customer stories and product demos to 22,500 considering customers.",
    descriptionVi: "Gửi 5 email hữu ích với câu chuyện khách hàng và demo sản phẩm cho 22,500 khách hàng đang cân nhắc.",
    priority: 2,
    impact: "Medium",
    color: "yellow"
  },
  {
    id: "rec-3",
    title: "Boost Email Marketing",
    titleVi: "Tăng cường Email Marketing",
    description: "Email converts at 28% - the highest! Move 30% of ad budget to email automation tools.",
    descriptionVi: "Email chuyển đổi 28% - cao nhất! Chuyển 30% ngân sách quảng cáo sang công cụ tự động hóa email.",
    priority: 1,
    impact: "High",
    color: "red"
  },
  {
    id: "rec-4",
    title: "Evening Push Notifications",
    titleVi: "Thông báo đẩy buổi tối",
    description: "Sales peak at 8 PM (48%). Schedule app notifications and social ads for 7-9 PM window.",
    descriptionVi: "Doanh số đạt đỉnh lúc 8 tối (48%). Lên lịch thông báo ứng dụng và quảng cáo mạng xã hội khung giờ 7-9 tối.",
    priority: 3,
    impact: "Medium",
    color: "yellow"
  }
];
