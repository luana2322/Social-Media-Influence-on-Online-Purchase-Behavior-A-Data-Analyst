"use client"
import { useState } from "react"
import { ChatMessage } from "@/components/ChatMessage"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type MessageRole = "user" | "ai"

interface Message {
  role: MessageRole
  content: string
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "Hello! I'm your AI Marketing Assistant. Ask me about customer segments or prediction insights." },
  ])
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (!input.trim()) return
    setMessages((prev) => [...prev, { role: "user" as MessageRole, content: input }])
    setTimeout(() => {
      setMessages((prev) => [...prev, {
        role: "ai" as MessageRole,
        content: "High-value customers are mostly from the 'Tech Enthusiasts' segment, representing 35% of your base with an average purchase of $1,200. They typically purchase every 45 days and respond well to premium product recommendations."
      }])
    }, 1000)
    setInput("")
  }

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-10rem)]">
      <h1 className="text-2xl font-bold tracking-tight">AI Chatbot</h1>
      <Card className="rounded-2xl shadow-sm flex-1 flex flex-col">
        <CardHeader><CardTitle>Chat with AI Assistant</CardTitle></CardHeader>
        <CardContent className="flex-1 overflow-y-auto flex flex-col gap-4">
          {messages.map((msg, i) => <ChatMessage key={i} {...msg} />)}
        </CardContent>
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about your data..."
              className="rounded-2xl"
            />
            <Button onClick={handleSend} className="rounded-2xl">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
