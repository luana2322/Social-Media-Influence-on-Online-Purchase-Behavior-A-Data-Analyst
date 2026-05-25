"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileDown, Loader2 } from "lucide-react"
import { generatePDF, getFileName, formatDate } from "@/lib/pdf-utils"

interface ExportButtonProps {
  targetId: string
  fileName?: string
  label?: string
  variant?: "default" | "outline"
}

export function ExportButton({
  targetId,
  fileName = "bao-cao",
  label = "Xuất PDF",
  variant = "outline",
}: ExportButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    setLoading(true)
    try {
      const name = getFileName(fileName)
      await generatePDF(targetId, name)
    } catch (err) {
      console.error("PDF export failed:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant={variant}
      size="sm"
      className="rounded-xl"
      onClick={handleExport}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
      ) : (
        <FileDown className="h-4 w-4 mr-1.5" />
      )}
      {loading ? "Đang xuất..." : label}
    </Button>
  )
}
