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
  const { language } = useLanguage()
  const isVi = language === "vi"

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{isVi ? "Nhóm khách hàng" : "Customer Groups"}</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {customerGroups.map((group) => {
          const ActionIcon = iconMap[group.actionIcon as keyof typeof iconMap] || Eye
          return (
            <Card key={group.name} className="rounded-2xl shadow-sm border-t-4" style={{ borderTopColor: group.fill }}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{isVi ? group.nameVi : group.name}</CardTitle>
                  <Badge className="rounded-2xl text-white" style={{ backgroundColor: group.fill }}>
                    {group.value}%
                  </Badge>
                </div>
                <p className="text-3xl font-bold" style={{ color: group.fill }}>
                  {group.count.toLocaleString()}
                  <span className="text-sm font-normal text-muted-foreground ml-2">{isVi ? "khách hàng" : "customers"}</span>
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{isVi ? group.descriptionVi : group.description}</p>
                <div className="pt-3 border-t">
                  <p className="text-xs font-semibold mb-2 text-foreground">{isVi ? "Hành động đề xuất:" : "Recommended Action:"}</p>
                  <Button
                    className="w-full rounded-2xl"
                    style={{ backgroundColor: group.fill, color: "#fff" }}
                  >
                    <ActionIcon className="h-4 w-4 mr-2" />
                    {isVi ? group.actionVi : group.action}
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
