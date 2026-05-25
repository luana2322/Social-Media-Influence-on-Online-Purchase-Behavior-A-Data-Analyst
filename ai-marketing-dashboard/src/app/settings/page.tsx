"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cài đặt</h1>
        <p className="text-muted-foreground mt-1">
          Quản lý tài khoản và tùy chọn
        </p>
      </div>

      <Tabs defaultValue="api" className="w-full">
        <TabsList className="rounded-xl">
          <TabsTrigger value="api" className="rounded-xl">Cài đặt API</TabsTrigger>
          <TabsTrigger value="profile" className="rounded-xl">Hồ sơ</TabsTrigger>
        </TabsList>

        <TabsContent value="api">
          <Card className="rounded-2xl border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-violet-500" />
                Cài đặt API
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ml-service">URL dịch vụ ML</Label>
                <Input id="ml-service" defaultValue="http://localhost:8000" className="rounded-xl" />
              </div>
              <Button className="rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-600 hover:to-fuchsia-600">Lưu</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <Card className="rounded-2xl border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Hồ sơ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên</Label>
                  <Input id="name" defaultValue="John Doe" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" defaultValue="john@example.com" className="rounded-xl" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl border">
                <div>
                  <p className="font-medium">Chế độ tối</p>
                  <p className="text-sm text-muted-foreground">Bật/tắt giao diện tối</p>
                </div>
                <Switch />
              </div>
              <Button className="rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-600 hover:to-fuchsia-600">Lưu thay đổi</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
