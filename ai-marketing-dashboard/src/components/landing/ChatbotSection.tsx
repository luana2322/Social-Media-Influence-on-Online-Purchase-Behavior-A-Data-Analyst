"use client";

import { useLanguage } from "@/i18n/LanguageProvider";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Lightbulb, TrendingUp, Target } from "lucide-react";

const exampleQuestions = [
  "Which users should I target?",
  "Why are conversions low?",
  "What strategy should I use?",
];

const viQuestions = [
  "Tôi nên nhắm đến nhóm người dùng nào?",
  "Tại sao tỷ lệ chuyển đổi thấp?",
  "Chiến lược nào tôi nên dùng?",
];

const mockResponse = {
  insight:
    "High-engagement users have 2x conversion rate compared to low-engagement users.",
  explanation:
    "Social media engagement signals (likes, shares, comments) correlate strongly with purchase intent. Users with positive_ratio > 0.7 are 3x more likely to buy.",
  strategy:
    "Target users with engagement_norm > 0.6 and positive_ratio > 0.7. Use personalized email campaigns highlighting product benefits.",
  recommendation:
    "Launch a 3-email sequence to 500 high-engagement users. Expected: 27% conversion increase within 14 days.",
};

const viResponse = {
  insight:
    "Người dùng tương tác cao có tỷ lệ chuyển đổi gấp 2 lần so với nhóm thấp.",
  explanation:
    "Tín hiệu mạng xã hội (lượt thích, chia sẻ, bình luận) tương quan mạnh với ý định mua hàng. Người dùng có positive_ratio > 0.7 có khả năng mua cao gấp 3 lần.",
  strategy:
    "Nhắm đến người dùng có engagement_norm > 0.6 và positive_ratio > 0.7. Sử dụng chiến dịch email cá nhân hóa.",
  recommendation:
    "Triển khai chuỗi 3 email đến 500 người dùng tương tác cao. Dự kiến: Tăng 27% chuyển đổi trong 14 ngày.",
};

export default function ChatbotSection() {
  const { t, language } = useLanguage();
  const response = language === "vi" ? viResponse : mockResponse;
  const questions = language === "vi" ? viQuestions : exampleQuestions;

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left Column: Explanation */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              {t("landing.chatbot.title")}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {language === "vi"
                ? "Nhận thông tin chi tiết từ AI với 4 phần:"
                : "Get instant marketing insights with 4-section responses:"}
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                  <Lightbulb className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {language === "vi" ? "Thông tin" : "Insight"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {language === "vi"
                      ? "Quan sát dựa trên dữ liệu"
                      : "Data-driven observation"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-full bg-purple-100 p-2 text-purple-600">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {language === "vi" ? "Giải thích" : "Explanation"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {language === "vi"
                      ? "Lý do đằng sau thông tin"
                      : "Clear reasoning behind the insight"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-full bg-green-100 p-2 text-green-600">
                  <Target className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {language === "vi" ? "Chiến lược" : "Strategy"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {language === "vi"
                      ? "Kế hoạch hành động"
                      : "Actionable marketing plan"}
                  </p>
                </div>
              </div>
            </div>

            {/* Example Questions */}
            <div className="mt-8">
              <p className="mb-3 font-semibold text-gray-900">
                {language === "vi" ? "Câu hỏi mẫu:" : "Example questions:"}
              </p>
              <ul className="space-y-2">
                {questions.map((q, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <MessageSquare className="h-4 w-4 text-blue-600" />
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Mock Chat Interface */}
          <Card className="rounded-2xl border-0 shadow-lg">
            <CardContent className="p-6">
              {/* Chat Header */}
              <div className="mb-4 flex items-center gap-3 border-b pb-4">
                <div className="rounded-full bg-blue-100 p-2">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {language === "vi" ? "Chatbot AI" : "AI Marketing Chatbot"}
                  </p>
                  <p className="text-xs text-green-600">
                    {language === "vi" ? "Đang hoạt động" : "Online"}
                  </p>
                </div>
              </div>

              {/* Mock Response */}
              <div className="space-y-4">
                <div className="rounded-lg bg-blue-50 p-4">
                  <p className="font-semibold text-blue-900">
                    {language === "vi" ? "Thông tin:" : "Insight:"}
                  </p>
                  <p className="mt-1 text-sm text-blue-800">
                    {response.insight}
                  </p>
                </div>

                <div className="rounded-lg bg-purple-50 p-4">
                  <p className="font-semibold text-purple-900">
                    {language === "vi" ? "Giải thích:" : "Explanation:"}
                  </p>
                  <p className="mt-1 text-sm text-purple-800">
                    {response.explanation}
                  </p>
                </div>

                <div className="rounded-lg bg-green-50 p-4">
                  <p className="font-semibold text-green-900">
                    {language === "vi" ? "Chiến lược:" : "Strategy:"}
                  </p>
                  <p className="mt-1 text-sm text-green-800">
                    {response.strategy}
                  </p>
                </div>

                <div className="rounded-lg bg-orange-50 p-4">
                  <p className="font-semibold text-orange-900">
                    {language === "vi" ? "Đề xuất:" : "Recommendation:"}
                  </p>
                  <p className="mt-1 text-sm text-orange-800">
                    {response.recommendation}
                  </p>
                </div>
              </div>

              {/* Blinking cursor */}
              <div className="mt-4 flex items-center gap-2 text-muted-foreground">
                <div className="h-4 w-0.5 animate-pulse bg-blue-600" />
                <span className="text-sm">
                  {language === "vi" ? "Đang nhập..." : "Typing..."}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
