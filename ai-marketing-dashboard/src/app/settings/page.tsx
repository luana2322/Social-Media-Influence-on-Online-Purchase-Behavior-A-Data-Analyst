"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/i18n/LanguageProvider"
import { Globe } from "lucide-react"

export default function SettingsPage() {
  const { t, language, setLanguage } = useLanguage()

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold tracking-tight">{t("settingsTitle")}</h1>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="rounded-2xl">
          <TabsTrigger value="profile" className="rounded-2xl">{t("profile")}</TabsTrigger>
          <TabsTrigger value="api" className="rounded-2xl">API Keys</TabsTrigger>
          <TabsTrigger value="appearance" className="rounded-2xl">{t("settingsTitle")}</TabsTrigger>
          <TabsTrigger value="language" className="rounded-2xl">{t("language")}</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>{t("profile")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <Button variant="outline" className="rounded-2xl">Change Avatar</Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue="John Doe" className="rounded-2xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" defaultValue="john@example.com" className="rounded-2xl" />
                </div>
              </div>
              <Button className="rounded-2xl">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="openai-key">OpenAI API Key</Label>
                <Input id="openai-key" type="password" placeholder="sk-..." className="rounded-2xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ml-service">ML Service URL</Label>
                <Input id="ml-service" defaultValue="http://localhost:8000" className="rounded-2xl" />
              </div>
              <Button className="rounded-2xl">Save API Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>{t("settingsTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t("darkMode")}</p>
                  <p className="text-sm text-muted-foreground">{t("darkModeDesc")}</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="language">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                {t("language")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-colors ${language === "en" ? "bg-accent border-primary" : "hover:bg-accent"}`}
                onClick={() => setLanguage("en")}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🇺🇸</span>
                  <div>
                    <p className="font-medium">{t("english")}</p>
                    <p className="text-sm text-muted-foreground">{t("englishDesc")}</p>
                  </div>
                </div>
                {language === "en" && <span className="text-primary">✓</span>}
              </div>
              <div
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-colors ${language === "vi" ? "bg-accent border-primary" : "hover:bg-accent"}`}
                onClick={() => setLanguage("vi")}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🇻🇳</span>
                  <div>
                    <p className="font-medium">{t("vietnamese")}</p>
                    <p className="text-sm text-muted-foreground">{t("vietnameseDesc")}</p>
                  </div>
                </div>
                {language === "vi" && <span className="text-primary">✓</span>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
