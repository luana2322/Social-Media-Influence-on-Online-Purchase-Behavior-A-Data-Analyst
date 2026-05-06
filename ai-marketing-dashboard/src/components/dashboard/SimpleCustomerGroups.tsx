"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { customerGroups } from "@/lib/mock-data-simple"
import { Zap, Mail, Eye, ArrowRight } from "lucide-react"
import { useLanguage } from "@/i18n/LanguageProvider"

const iconMap = {
  Zap: Zap,
  Mail: Mail,
  Eye: Eye,
}

export function SimpleCustomerGroups() {
  const { t } = useLanguage()

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{t("customerGroups")}</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {customerGroups.map((group, idx) => {
          const ActionIcon = iconMap[group.actionIcon as keyof typeof iconMap] || Eye
          const nameKey = idx === 0 ? "readyToBuy" : idx === 1 ? "considering" : "notInterested"
          const descKey = idx === 0 ? "activelyShopping" : idx === 1 ? "interestedNudge" : "justBrowsing"
          const actionKey = idx === 0 ? "sendDiscountToday" : idx === 1 ? "sendHelpfulContent" : "runAwarenessAds"

          return (
            <Card key={group.name} className="rounded-2xl shadow-sm border-t-4" style={{ borderTopColor: group.fill }}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{t(nameKey)}</CardTitle>
                  <Badge className="rounded-2xl text-white" style={{ backgroundColor: group.fill }}>
                    {group.value}%
                  </Badge>
                </div>
                <p className="text-3xl font-bold" style={{ color: group.fill }}>
                  {group.count.toLocaleString()}
                  <span className="text-sm font-normal text-muted-foreground ml-2">{t("customers")}</span>
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{t(descKey)}</p>
                <div className="pt-3 border-t">
                  <p className="text-xs font-semibold mb-2 text-foreground">{t("recommendedAction")}</p>
                  <Button
                    className="w-full rounded-2xl"
                    style={{ backgroundColor: group.fill, color: "#fff" }}
                  >
                    <ActionIcon className="h-4 w-4 mr-2" />
                    {t(actionKey)}
                    <ArrowRight className="h-3 w-3 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
