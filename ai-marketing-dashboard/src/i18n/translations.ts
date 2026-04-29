export const translations = {
  en: {
    title: "AI Marketing Assistant",
    description: "SaaS platform for AI-driven marketing predictions",
    searchPlaceholder: "Search jobs, datasets...",
    myAccount: "My Account",
    profile: "Profile",
    settings: "Settings",
    logout: "Logout",
    dashboard: "Dashboard",
    upload: "Upload",
    jobs: "Jobs",
    analytics: "Analytics",
    chatbot: "Chatbot",
    settingsTitle: "Settings",
    language: "Language",
    english: "English",
    vietnamese: "Tiếng Việt",
    // Analytics page
    last7days: "Last 7 days",
    last30days: "Last 30 days",
    last90days: "Last 90 days",
    segment: "Segment",
    records: "records",
    barChart: "Bar Chart",
    pieChart: "Pie Chart",
    segmentationBreakdown: "Segmentation Breakdown",
    segmentationDistribution: "Segmentation Distribution",
    high: "High",
    medium: "Medium",
    low: "Low",
    // Chatbot page
    aiChatbot: "AI Chatbot",
    chatWithAI: "Chat with AI Assistant",
    helloMessage: "Hello! I'm your AI Marketing Assistant. Ask me about customer segments or prediction insights.",
    askAboutData: "Ask about your data...",
    // Jobs page
    newJob: "New Job",
    allJobs: "All Jobs",
    // Upload page
    uploadData: "Upload Data",
    filePreview: "File Preview (First 10 Rows)",
    columnMapping: "Column Mapping",
    autoDetected: "Auto-detected",
    runPrediction: "Run Prediction",
    // Settings page
    darkMode: "Dark Mode",
    darkModeDesc: "Toggle dark mode theme",
    englishDesc: "English",
    vietnameseDesc: "Tiếng Việt",
  },
  vi: {
    title: "Trợ lý Marketing AI",
    description: "Nền tảng SaaS cho dự đoán marketing bằng AI",
    searchPlaceholder: "Tìm kiếm công việc, tập dữ liệu...",
    myAccount: "Tài khoản của tôi",
    profile: "Hồ sơ",
    settings: "Cài đặt",
    logout: "Đăng xuất",
    dashboard: "Bảng điều khiển",
    upload: "Tải lên",
    jobs: "Công việc",
    analytics: "Phân tích",
    chatbot: "Trò chuyện",
    settingsTitle: "Cài đặt",
    language: "Ngôn ngữ",
    english: "English",
    vietnamese: "Tiếng Việt",
    // Analytics page
    last7days: "7 ngày qua",
    last30days: "30 ngày qua",
    last90days: "90 ngày qua",
    segment: "Phân khúc",
    records: "bản ghi",
    barChart: "Biểu đồ cột",
    pieChart: "Biểu đồ tròn",
    segmentationBreakdown: "Phân bố phân khúc",
    segmentationDistribution: "Phân bố phân khúc",
    high: "Cao",
    medium: "Trung bình",
    low: "Thấp",
    // Chatbot page
    aiChatbot: "Trò chuyện AI",
    chatWithAI: "Trò chuyện với trợ lý AI",
    helloMessage: "Xin chào! Tôi là Trợ lý Marketing AI của bạn. Hãy hỏi tôi về phân khúc khách hàng hoặc dự đoán.",
    askAboutData: "Hỏi về dữ liệu của bạn...",
    // Jobs page
    newJob: "Công việc mới",
    allJobs: "Tất cả công việc",
    // Upload page
    uploadData: "Tải dữ liệu lên",
    filePreview: "Xem trước tệp (10 hàng đầu)",
    columnMapping: "Ánh xạ cột",
    autoDetected: "Tự động phát hiện",
    runPrediction: "Chạy dự đoán",
    // Settings page
    darkMode: "Chế độ tối",
    darkModeDesc: "Bật tắt giao diện tối",
    englishDesc: "Tiếng Anh",
    vietnameseDesc: "Tiếng Việt",
  },
}

export type Language = keyof typeof translations
export type TranslationKey = keyof typeof translations.en

export function getTranslation(lang: Language, key: TranslationKey): string {
  return translations[lang][key]
}
