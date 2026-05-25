import { ExternalLink, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { SearchArticle } from "@/lib/recommendation-search"

interface ArticleCardProps {
  articles: SearchArticle[]
  loading?: boolean
}

export function ArticleCard({ articles, loading }: ArticleCardProps) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2 pl-9">
        <Loader2 className="h-3 w-3 animate-spin" />
        Đang tìm bài viết tham khảo...
      </div>
    )
  }

  if (articles.length === 0) return null

  return (
    <div className="mt-2 pl-9 space-y-2">
      {articles.slice(0, 2).map((a, i) => (
        <a
          key={i}
          href={a.url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "flex items-start gap-2 p-2 rounded-lg text-xs",
            "hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors",
            "group"
          )}
        >
          <ExternalLink className="h-3 w-3 text-violet-400 mt-0.5 shrink-0 group-hover:text-violet-600" />
          <div className="min-w-0">
            <p className="font-medium text-violet-700 dark:text-violet-300 truncate group-hover:underline">
              {a.title}
            </p>
            <p className="text-muted-foreground line-clamp-1 mt-0.5">{a.snippet}</p>
            <p className="text-[10px] text-muted-foreground/60 mt-0.5">{a.source}</p>
          </div>
        </a>
      ))}
    </div>
  )
}
