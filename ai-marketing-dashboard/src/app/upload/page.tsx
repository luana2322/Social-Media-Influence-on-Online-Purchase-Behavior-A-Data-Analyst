"use client"
import { UploadDropzone } from "@/components/UploadDropzone"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { sampleData, fileColumns } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

export default function UploadPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold tracking-tight">Upload Data</h1>
      
      <UploadDropzone />

      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>File Preview (First 10 Rows)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-2xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  {fileColumns.map((col) => (
                    <TableHead key={col.name}>{col.name}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleData.map((row, i) => (
                  <TableRow key={i}>
                    {fileColumns.map((col) => (
                      <TableCell key={col.name}>{String(row[col.name as keyof typeof row])}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Column Mapping</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {fileColumns.map((col) => (
              <div key={col.name} className="flex items-center justify-between p-3 bg-accent rounded-2xl">
                <div>
                  <p className="text-sm font-medium">{col.name}</p>
                  <p className="text-xs text-muted-foreground">{col.type}</p>
                </div>
                <Badge variant="secondary" className="rounded-2xl">Auto-detected</Badge>
              </div>
            ))}
          </div>
          <Button className="mt-6 rounded-2xl w-full" size="lg">
            <Play className="mr-2 h-4 w-4" />
            Run Prediction
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
