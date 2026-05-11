"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const { signup } = useAuth()
  const [fullName, setFullName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await signup({ username, email, password, fullName })
      router.push("/login?registered=true")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Đăng ký thất bại")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-violet-950/10 dark:to-fuchsia-950/10 p-4">
      <Card className="w-full max-w-md rounded-2xl">
        <CardContent className="pt-8 pb-8 px-8">
          <div className="text-center mb-8">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Đăng ký</h1>
            <p className="text-muted-foreground mt-1">Tạo tài khoản AI Marketing Copilot</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1.5">Họ và tên</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl border bg-accent/50 px-4 py-2.5 text-sm outline-none focus:border-violet-400 transition-colors"
                placeholder="Nguyễn Văn A"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Tên đăng nhập</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border bg-accent/50 px-4 py-2.5 text-sm outline-none focus:border-violet-400 transition-colors"
                placeholder="nguyenvan_a"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border bg-accent/50 px-4 py-2.5 text-sm outline-none focus:border-violet-400 transition-colors"
                placeholder="email@example.com"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Mật khẩu</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border bg-accent/50 px-4 py-2.5 text-sm outline-none focus:border-violet-400 transition-colors"
                placeholder="Ít nhất 6 ký tự"
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 rounded-xl px-4 py-2">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-600 hover:to-fuchsia-600"
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Đăng ký"}
            </Button>
          </form>

          <div className="text-center mt-6">
            <span className="text-sm text-muted-foreground">Đã có tài khoản? </span>
            <Link href="/login" className="text-sm text-violet-600 hover:text-violet-700 font-medium">
              Đăng nhập
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
