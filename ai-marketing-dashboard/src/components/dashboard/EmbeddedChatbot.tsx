"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Send, Bot, User, Lightbulb, BookOpen, Target, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

type MessageRole = "user" | "ai"
type ResponseType = "insight" | "explanation" | "strategy" | "recommendation"

interface Message {
  role: MessageRole
  content: string
  responseType?: ResponseType
}

const responseTypeConfig = {
  insight: { icon: Lightbulb, label: "Insight", color: "bg-yellow-100 text-yellow-700" },
  explanation: { icon: BookOpen, label: "Explanation", color: "bg-blue-100 text-blue-700" },
  strategy: { icon: Target, label: "Strategy", color: "bg-purple-100 text-purple-700" },
  recommendation: { icon: Sparkles, label: "Recommendation", color: "bg-green-100 text-green-700" },
}

export function EmbeddedChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "Hello! I'm your AI Marketing Assistant. Ask me about your data, and I'll provide insights, explanations, strategies, or recommendations.", responseType: "insight" },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [activeType, setActiveType] = useState<ResponseType>("insight")

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const userQuestion = input
    setMessages((prev) => [...prev, { role: "user", content: userQuestion }])
    setInput("")
    setLoading(true)

    // Simulate AI response based on type
    setTimeout(() => {
      const responses = {
        insight: `Based on your data, ${userQuestion.toLowerCase().includes("high") ? "high-intent users (35%) are your best opportunity" : "you have 17,500 high-intent users ready to convert"}. Focus on immediate conversion campaigns.`,
        explanation: `The model predicts purchase probability using ${activeType === "explanation" ? "engagement score (32% importance), page views (28%), and session duration (24%)" : "multiple behavioral and demographic features"}. SHAP values show these are the top drivers.`,
        strategy: `For ${userQuestion.toLowerCase().includes("medium") ? "medium-intent users: Deploy 5-email nurture sequence with testimonials" : "high-intent users: Send flash sale with 24h expiration"}. This can increase conversion by 15%.`,
        recommendation: `I recommend ${activeType === "recommendation" ? "reallocating 30% of paid ads budget to email marketing (28% conversion rate)" : "scheduling campaigns for 7-9 PM when conversion peaks at 48%"}`,
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
          AI Marketing Assistant
        </CardTitle>
        <div className="flex gap-2 flex-wrap">
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
              <div className="bg-accent rounded-2xl rounded-tl-none p-3 text-sm">Thinking...</div>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={`Ask for ${activeType}...`}
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
