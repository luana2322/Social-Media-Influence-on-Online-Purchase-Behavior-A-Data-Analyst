import html2canvas from "html2canvas"
import jsPDF from "jspdf"

const UNSUPPORTED_COLORS = /oklch\(|oklab\(|lab\(|color\(/gi

export function formatDate(date?: Date): string {
  const d = date || new Date()
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function getFileName(base: string): string {
  const timestamp = Date.now()
  const safe = base.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase()
  return `${safe}_${timestamp}.pdf`
}

function stripUnsupportedColors(doc: Document): void {
  for (const sheet of Array.from(doc.styleSheets)) {
    try {
      for (let i = sheet.cssRules.length - 1; i >= 0; i--) {
        const rule = sheet.cssRules[i] as CSSStyleRule
        if (rule.cssText && UNSUPPORTED_COLORS.test(rule.cssText)) {
          const safeCss = rule.cssText.replace(
            /(oklch|oklab|lab|color)\s*\([^)]+\)/gi,
            "rgb(128,128,128)"
          )
          sheet.deleteRule(i)
          try {
            sheet.insertRule(safeCss, i)
          } catch {
            /* re-insert failed — rule omitted, safe fallback */
          }
        }
      }
    } catch {
      /* cross-origin or inaccessible stylesheet */
    }
  }
}

const HEX_OVERRIDES = `
  :root {
    --background: #ffffff !important;
    --foreground: #0f0f0f !important;
    --card: #ffffff !important;
    --card-foreground: #0f0f0f !important;
    --popover: #ffffff !important;
    --popover-foreground: #0f0f0f !important;
    --primary: #0f0f0f !important;
    --primary-foreground: #ffffff !important;
    --secondary: #f5f5f5 !important;
    --secondary-foreground: #0f0f0f !important;
    --muted: #f5f5f5 !important;
    --muted-foreground: #737373 !important;
    --accent: #f5f5f5 !important;
    --accent-foreground: #0f0f0f !important;
    --destructive: #ef4444 !important;
    --border: #e5e5e5 !important;
    --input: #e5e5e5 !important;
    --ring: #d4d4d4 !important;
    --chart-1: #e5e5e5 !important;
    --chart-2: #737373 !important;
    --chart-3: #525252 !important;
    --chart-4: #404040 !important;
    --chart-5: #262626 !important;
    --sidebar: #fafafa !important;
    --sidebar-foreground: #0f0f0f !important;
    --sidebar-primary: #4f46e5 !important;
    --sidebar-primary-foreground: #ffffff !important;
    --sidebar-accent: #f5f5f5 !important;
    --sidebar-accent-foreground: #0f0f0f !important;
    --sidebar-border: #e5e5e5 !important;
    --sidebar-ring: #d4d4d4 !important;
  }
  * { color-scheme: light !important; }
`

export async function generatePDF(
  targetId: string,
  filename: string,
  onProgress?: (pct: number) => void
): Promise<void> {
  const element = document.getElementById(targetId)
  if (!element) throw new Error(`Element #${targetId} not found`)

  onProgress?.(10)

  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: "#ffffff",
    logging: false,
    useCORS: true,
    allowTaint: false,
    onclone: (doc) => {
      stripUnsupportedColors(doc)
      const style = doc.createElement("style")
      style.textContent = HEX_OVERRIDES
      doc.head.appendChild(style)
    },
  })

  onProgress?.(50)

  const imgData = canvas.toDataURL("image/png")
  const imgWidth = 210
  const pageHeight = 297
  const imgHeight = (canvas.height * imgWidth) / canvas.width

  const pdf = new jsPDF("p", "mm", "a4")
  let heightLeft = imgHeight
  let position = 0

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
  heightLeft -= pageHeight

  while (heightLeft > 0) {
    position = heightLeft - imgHeight
    pdf.addPage()
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight
  }

  onProgress?.(90)

  pdf.save(filename)

  onProgress?.(100)
}
