"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Megaphone, Download, MessageSquare, Calendar } from "lucide-react"
import { useLanguage } from "@/i18n/LanguageProvider"

const actions = [
  {
    icon: Mail,
    titleKey: "qaSendEmail",
    subKey: "qaSendEmailSub",
    variant: "default" as const,
    color: "bg-red-600 hover:bg-red-700",
  },
  {
    icon: Megaphone,
    titleKey: "qaRunAds",
    subKey: "qaRunAdsSub",
    variant: "outline" as const,
    color: "",
  },
  {
    icon: Download,
    titleKey: "qaExportUsers",
    subKey: "qaExportUsersSub",
    variant: "outline" as const,
    color: "",
  },
  {
    icon: MessageSquare,
    titleKey: "qaAskAI",
    subKey: "qaAskAISub",
    variant: "outline" as const,
    color: "",
  },
  {
    icon: Calendar,
    titleKey: "qaSchedule",
    subKey: "qaScheduleSub",
    variant: "outline" as const,
    color: "",
  },
]

export function QuickActions() {
  const { t } = useLanguage()

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{t("quickActionsTitle")}</h2>
      <div className="grid gap-4 sm:grid-cols-5">
        {actions.map((action, i) => {
          const Icon = action.icon
          return (
            <Card key={i} className="rounded-2xl shadow-sm">
              <CardContent className="p-4">
                <Button
                  variant={action.variant}
                  className={`w-full h-auto py-3 px-4 rounded-2xl flex flex-col items-center gap-2 ${action.color}`}
                >
                  <Icon className="h-6 w-6" />
                  <div className="text-center">
                    <p className="text-sm font-semibold">{t(action.titleKey)}</p>
                    <p className="text-xs text-muted-foreground">{t(action.subKey)}</p>
                  </div>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
