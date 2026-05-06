"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Send, Bot, User, Lightbulb, BookOpen, Target, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/i18n/LanguageProvider"

type MessageRole = "user" | "ai"
type ResponseType = "insight" | "explanation" | "strategy" | "recommendation"

interface Message {
  role: MessageRole
  content: string
  responseType?: ResponseType
}

export function EmbeddedChatbotSimple() {
  const { t, language } = useLanguage()
  const isVi = language === "vi"

  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: t("greetingMessage"), responseType: "insight" },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [activeType, setActiveType] = useState<ResponseType>("recommendation")

  const responseTypeConfig = {
    insight: { icon: Lightbulb, label: t("quickInsight"), color: "bg-yellow-100 text-yellow-700" },
    explanation: { icon: BookOpen, label: t("whyThisHappens"), color: "bg-blue-100 text-blue-700" },
    strategy: { icon: Target, label: t("actionPlan"), color: "bg-purple-100 text-purple-700" },
    recommendation: { icon: Sparkles, label: t("whatToDo"), color: "bg-green-100 text-green-700" },
  }

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const userQuestion = input
    setMessages((prev) => [...prev, { role: "user", content: userQuestion }])
    setInput("")
    setLoading(true)

    setTimeout(() => {
      const responses: Record<ResponseType, string> = {
        insight: isVi
          ? `Câu hỏi hay! ${userQuestion.toLowerCase().includes("sẵn") || userQuestion.toLowerCase().includes("mua")
              ? "Bạn có 17,500 khách hàng đã sẵn sàng mua ngay bây giờ. Họ đang tích cực mua sắm trên trang web của bạn."
              : "Khách hàng của bạn có nhiều khả năng mua nhất khi họ dành nhiều thời gian trên trang và xem nhiều trang hơn."
            }`
          : `Good question! ${userQuestion.toLowerCase().includes("ready") || userQuestion.toLowerCase().includes("buy")
              ? "You have 17,500 customers ready to buy right now. They're actively shopping on your site."
              : "Your customers are most likely to buy when they spend more time on your site and click around more."
            }`,
        explanation: isVi
          ? `Đây là lý do: ${activeType === "explanation"
              ? "Khách hàng xem nhiều trang và ở lại lâu đang thể hiện tín hiệu mua hàng rõ ràng. Họ đang tìm hiểu trước khi quyết định."
              : "Khi khách hàng tương tác nhiều hơn với trang web, họ đang xây dựng lòng tin và tiến gần hơn đến việc mua hàng."
            }`
          : `Here's why: ${activeType === "explanation"
              ? "Customers who visit more pages and stay longer are showing clear buying signals. They're researching before making a decision."
              : "When customers interact more with your site, they're building trust and getting closer to making a purchase."
            }`,
        strategy: isVi
          ? `Kế hoạch của bạn: ${userQuestion.toLowerCase().includes("hứng") || userQuestion.toLowerCase().includes("cân nhắc")
              ? "Gửi 5 email hữu ích với câu chuyện khách hàng cho 22,500 khách hàng đang cân nhắc. Đính kèm demo sản phẩm."
              : "Gửi mã giảm giá 24 giờ cho 17,500 khách hàng sẵn sàng mua. Dùng email + tin nhắn."
            }`
          : `Here's your plan: ${userQuestion.toLowerCase().includes("interest") || userQuestion.toLowerCase().includes("consider")
              ? "Send 5 helpful emails with customer stories to your 22,500 interested customers. Include product demos."
              : "Send a 24-hour discount code to your 17,500 ready-to-buy customers. Use email + text message."
            }`,
        recommendation: isVi
          ? `Tôi đề xuất: ${activeType === "recommendation"
              ? "Chuyển 30% ngân sách quảng cáo sang email marketing. Email chuyển đổi 28% - cao nhất!"
              : "Lên lịch quảng cáo 7-9 tối. Đó là khi 48% khách hàng thực hiện mua hàng."
            }`
          : `I recommend: ${activeType === "recommendation"
              ? "Move 30% of your ad budget to email marketing. Email converts at 28% - the highest rate!"
              : "Schedule your ads for 7-9 PM. That's when 48% of customers make purchases."
            }`,
      }

      setMessages((prev) => [...prev, {
        role: "ai",
        content: responses[activeType],
        responseType: activeType
      }])
      setLoading(false)
    }, 1000)
  }

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          {t("askMarketingAssistant")}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{t("getAdvice")}</p>
        <div className="flex gap-2 flex-wrap mt-2">
          {(Object.keys(responseTypeConfig) as ResponseType[]).map((type) => {
            const config = responseTypeConfig[type]
            const Icon = config.icon
            return (
              <Badge
                key={type}
                className={cn(
                  "rounded-2xl cursor-pointer transition-colors",
                  activeType === type ? config.color : "bg-accent text-muted-foreground hover:bg-accent/80"
                )}
                onClick={() => setActiveType(type)}
              >
                <Icon className="h-3 w-3 mr-1" />
                {config.label}
              </Badge>
            )
          })}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] overflow-y-auto space-y-3 mb-4 p-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={cn(
                "flex gap-3 max-w-[85%]",
                msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-2xl shrink-0",
                msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-accent"
              )}>
                {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div className="space-y-1">
                {msg.responseType && msg.role === "ai" && (
                  <Badge className={cn("rounded-2xl text-xs", responseTypeConfig[msg.responseType].color)}>
                    {responseTypeConfig[msg.responseType].label}
                  </Badge>
                )}
                <div className={cn(
                  "rounded-2xl p-3 text-sm",
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-none"
                    : "bg-accent rounded-tl-none"
                )}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3 mr-auto">
              <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-accent">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-accent rounded-2xl rounded-tl-none p-3 text-sm">{t("thinking")}</div>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={t("chatPlaceholder")}
            className="rounded-2xl"
            disabled={loading}
          />
          <Button onClick={handleSend} className="rounded-2xl" disabled={loading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
