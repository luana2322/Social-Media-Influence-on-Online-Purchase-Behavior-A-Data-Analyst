"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { UploadCloud, FileText, CheckCircle, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { uploadDataset } from "@/lib/api"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/i18n/LanguageProvider"

export function UploadDropzone() {
  const router = useRouter()
  const { t, language } = useLanguage()
  const isVi = language === "vi"
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log(acceptedFiles)
  }, [])

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
  })

  const handleRunPrediction = async () => {
    if (acceptedFiles.length === 0) return

    setUploading(true)
    setError(null)

    try {
      const result = await uploadDataset(acceptedFiles[0])
      router.push(`/jobs/${result.jobId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : t("uploadFailed"))
    } finally {
      setUploading(false)
    }
  }

  return (
    <Card className="rounded-2xl">
      <CardContent className="p-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${
            isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
          }`}
        >
          <input {...getInputProps()} />
          <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          {isDragActive ? (
            <p className="text-primary font-medium">{t("dropHere")}</p>
          ) : (
            <>
              <p className="font-medium mb-1">{t("dragDrop")}</p>
              <p className="text-sm text-muted-foreground">{t("orClick")}</p>
            </>
          )}
        </div>
        {acceptedFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            {acceptedFiles.map((file) => (
              <div key={file.name} className="flex items-center gap-3 p-3 bg-accent rounded-2xl">
                <FileText className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
            ))}
          </div>
        )}
        {error && (
          <p className="text-sm text-red-500 mt-2">{error}</p>
        )}
        <Button
          className="w-full mt-4 rounded-2xl"
          disabled={acceptedFiles.length === 0 || uploading}
          onClick={handleRunPrediction}
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("uploading")}
            </>
          ) : (
            t("runPrediction")
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
