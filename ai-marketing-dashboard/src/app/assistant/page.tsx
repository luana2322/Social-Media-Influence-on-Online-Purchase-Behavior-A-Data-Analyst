"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, TrendingDown, Users, Clock, BarChart3, Sparkles, Upload, ArrowRight, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { askChatbot } from "@/lib/api"
import { useRouter } from "next/navigation"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

const promptSuggestions = [
  { text: "Tại sao chuyển đổi giảm?", icon: TrendingDown },
  { text: "Nhóm khách nào chuyển đổi tốt nhất?", icon: Users },
  { text: "Thời gian đăng bài tốt nhất?", icon: Clock },
  { text: "Chiến dịch nào hiệu quả nhất?", icon: BarChart3 },
]

function parseResponse(text: string): string {
  const sections = text.split(/### \d+\.\s*/).filter(Boolean)
  if (sections.length === 0) return text

  return sections
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      const lines = s.split("\n").filter(Boolean)
      const header = lines[0]
      const body = lines.slice(1)
        .map((l) => l.replace(/^-\s*/, "• "))
        .join("\n")
      return `**${header}**\n${body}`
    })
    .join("\n\n")
}

export default function AssistantPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "" },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const jobId = typeof window !== "undefined" ? Number(localStorage.getItem("lastJobId")) : null
  const fileName = typeof window !== "undefined" ? localStorage.getItem("lastFileName") : null
  const hasData = jobId && jobId > 0

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async (question?: string) => {
    const text = question || input
    if (!text.trim() || loading || !hasData) return

    setMessages((prev) => [...prev, { role: "user", content: text }])
    setInput("")
    setLoading(true)

    try {
      const answer = await askChatbot(text, jobId)
      const formatted = parseResponse(answer)
      setMessages((prev) => [...prev, { role: "assistant", content: formatted }])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Không thể kết nối đến AI. Vui lòng thử lại sau." },
      ])
    }

    setLoading(false)
  }

  if (!hasData) {
    return (
      <div className="flex flex-col gap-8 max-w-3xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trợ lý Marketing AI</h1>
          <p className="text-muted-foreground mt-1">Đặt câu hỏi về dữ liệu bằng tiếng Việt</p>
        </div>
        <Card className="rounded-2xl border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-20 gap-5">
            <div className="h-16 w-16 rounded-2xl bg-violet-50 dark:bg-violet-950/30 flex items-center justify-center">
              <Database className="h-8 w-8 text-violet-500" />
            </div>
            <div className="text-center max-w-md">
              <p className="text-lg font-medium">Chưa có dữ liệu</p>
              <p className="text-sm text-muted-foreground mt-1">
                Tải lên file CSV khách hàng trước, sau đó quay lại đây để hỏi AI về dữ liệu của bạn.
              </p>
            </div>
            <Button
              className="rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-600 hover:to-fuchsia-600"
              onClick={() => router.push("/analyze")}
            >
              <Upload className="h-4 w-4 mr-2" />
              Tải dữ liệu ngay
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] max-w-4xl mx-auto">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trợ lý Marketing AI</h1>
          <p className="text-muted-foreground mt-1">Đặt câu hỏi về dữ liệu bằng tiếng Việt</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-accent px-3 py-1.5 rounded-lg">
          <Database className="h-3.5 w-3.5" />
          {fileName || `Job #${jobId}`}
        </div>
      </div>

      <div className="flex-1 flex flex-col rounded-2xl border bg-background overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3 border-b bg-accent/30">
          <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
          <span className="text-sm font-medium">Trợ lý AI</span>
          <span className="text-xs text-muted-foreground">Trực tuyến</span>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {messages.length === 1 && !loading && (
            <div className="text-center py-10">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-100 to-fuchsia-100 dark:from-violet-950/30 dark:to-fuchsia-950/30 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-6 w-6 text-violet-500" />
              </div>
              <p className="text-lg font-medium">Tôi có thể giúp gì cho bạn?</p>
              <p className="text-sm text-muted-foreground mt-1">
                Hỏi tôi về dữ liệu khách hàng, chiến dịch marketing, hoặc đề xuất tối ưu
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={cn("flex gap-3", msg.role === "user" ? "justify-end" : "justify-start")}
            >
              {msg.role === "assistant" && (
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              )}
              <div className={cn("max-w-[80%]", msg.role === "user" ? "order-1" : "order-2")}>
                {msg.role === "user" ? (
                  <div className="bg-violet-500 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm">
                    {msg.content}
                  </div>
                ) : (
                  <div className="bg-accent rounded-2xl rounded-tl-sm px-5 py-3.5 text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.content || "Chào bạn! Tôi là Trợ lý Marketing AI. Hãy tải dữ liệu và hỏi tôi về khách hàng, chiến dịch hoặc cách tăng doanh số."}
                  </div>
                )}
              </div>
              {msg.role === "user" && (
                <div className="h-8 w-8 rounded-xl bg-accent flex items-center justify-center shrink-0">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-accent rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1">
                  <div className="h-2 w-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="h-2 w-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="h-2 w-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {messages.length === 1 && !loading && (
          <div className="px-5 pb-3">
            <p className="text-xs text-muted-foreground mb-2">Thử hỏi:</p>
            <div className="flex flex-wrap gap-2">
              {promptSuggestions.map((p, i) => {
                const Icon = p.icon
                return (
                  <button
                    key={i}
                    onClick={() => handleSend(p.text)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {p.text}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Hỏi về marketing..."
              className="flex-1 rounded-xl border bg-accent/50 px-4 py-2.5 text-sm outline-none focus:border-violet-400 transition-colors"
              disabled={loading}
            />
            <Button
              onClick={() => handleSend()}
              className="rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-600 hover:to-fuchsia-600"
              disabled={loading || !input.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
