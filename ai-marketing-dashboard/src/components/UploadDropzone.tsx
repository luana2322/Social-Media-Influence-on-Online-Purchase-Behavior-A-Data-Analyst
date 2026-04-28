"use client"
import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { UploadCloud, FileText, CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function UploadDropzone() {
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
            <p className="text-primary font-medium">Drop the CSV file here...</p>
          ) : (
            <>
              <p className="font-medium mb-1">Drag & drop a CSV file here</p>
              <p className="text-sm text-muted-foreground">or click to browse (max 1M rows)</p>
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
        <Button className="w-full mt-4 rounded-2xl" disabled={acceptedFiles.length === 0}>
          Run Prediction
        </Button>
      </CardContent>
    </Card>
  )
}
