"use client"
import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { ChatMessage } from "@/components/ChatMessage"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/i18n/LanguageProvider"
import { askChatbot } from "@/lib/api"

type MessageRole = "user" | "ai"

interface Message {
  role: MessageRole
  content: string
}

function ChatbotContent() {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const jobId = searchParams.get("jobId")
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: t("helloMessage") },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userQuestion = input
    setMessages((prev) => [...prev, { role: "user" as MessageRole, content: userQuestion }])
    setInput("")
    setLoading(true)

    try {
      const answer = await askChatbot(userQuestion, jobId ? parseInt(jobId) : 1)
      setMessages((prev) => [...prev, { role: "ai" as MessageRole, content: answer }])
    } catch (error) {
      setMessages((prev) => [...prev, {
        role: "ai" as MessageRole,
        content: "Error: Unable to get response from chatbot."
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-10rem)]">
      <h1 className="text-2xl font-bold tracking-tight">
        {t("aiChatbot")} {jobId ? `- Job #${jobId}` : ""}
      </h1>
      <Card className="rounded-2xl shadow-sm flex-1 flex flex-col">
        <CardHeader><CardTitle>{t("chatWithAI")}</CardTitle></CardHeader>
        <CardContent className="flex-1 overflow-y-auto flex flex-col gap-4">
          {messages.map((msg, i) => <ChatMessage key={i} {...msg} />)}
        </CardContent>
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={t("askAboutData")}
              className="rounded-2xl"
              disabled={loading}
            />
            <Button onClick={handleSend} className="rounded-2xl" disabled={loading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default function ChatbotPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-[calc(100vh-10rem)]">Loading...</div>}>
      <ChatbotContent />
    </Suspense>
  )
}
