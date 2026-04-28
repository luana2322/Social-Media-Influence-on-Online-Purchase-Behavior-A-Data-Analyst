"use client"
import { User, Bot } from "lucide-react"
import { cn } from "@/lib/utils"

type MessageRole = "user" | "ai"

export function ChatMessage({ role, content }: { role: MessageRole; content: string }) {
  return (
    <div className={cn(
      "flex gap-3 max-w-[80%]",
      role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
    )}>
      <div className={cn(
        "flex h-8 w-8 items-center justify-center rounded-2xl shrink-0",
        role === "user" ? "bg-primary text-primary-foreground" : "bg-accent"
      )}>
        {role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div className={cn(
        "rounded-2xl p-4 text-sm",
        role === "user"
          ? "bg-primary text-primary-foreground rounded-tr-none"
          : "bg-accent rounded-tl-none"
      )}>
        {content}
      </div>
    </div>
  )
}
