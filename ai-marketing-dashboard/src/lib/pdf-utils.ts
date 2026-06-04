import html2canvas from "html2canvas"
import jsPDF from "jspdf"

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

export async function generatePDF(
  targetId: string,
  filename: string,
  onProgress?: (pct: number) => void
): Promise<void> {
  const element = document.getElementById(targetId)
  if (!element) throw new Error(`Không tìm thấy phần tử #${targetId}`)

  onProgress?.(10)

  const unsafeRE = /(oklch|oklab|lab|color)\s*\(/gi
  const savedStyles: { el: HTMLStyleElement; text: string }[] = []

  for (const s of Array.from(document.querySelectorAll("style"))) {
    if (unsafeRE.test(s.textContent)) {
      unsafeRE.lastIndex = 0
      savedStyles.push({ el: s, text: s.textContent })
      s.textContent = s.textContent.replace(unsafeRE, "#888 ")
    }
  }

  const safeTag = document.createElement("style")
  safeTag.id = "__pdf_export_safe__"
  safeTag.textContent = `
    *, *::before, *::after {
      color-scheme: light !important;
    }
    :root, :host, html {
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
      --radius: 0.5rem !important;
    }
  `
  document.head.appendChild(safeTag)

  document.documentElement.offsetHeight

  let canvas: HTMLCanvasElement
  try {
    canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: "#ffffff",
      logging: false,
      useCORS: true,
      allowTaint: true,
    })
  } catch (err) {
    throw new Error(`Không thể chụp nội dung: ${err instanceof Error ? err.message : "Lỗi không xác định"}`)
  } finally {
    for (const { el, text } of savedStyles) {
      el.textContent = text
    }
    safeTag.remove()
  }

  onProgress?.(50)

  const imgData = canvas.toDataURL("image/png")
  const imgWidth = 210
  const pageHeight = 297
  const imgHeight = (canvas.height * imgWidth) / canvas.width
  const marginTop = 10

  const pdf = new jsPDF("p", "mm", "a4")
  let heightLeft = imgHeight + marginTop
  let position = -marginTop

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
  heightLeft -= pageHeight

  while (heightLeft > 0) {
    position = -marginTop - (imgHeight - heightLeft - marginTop)
    pdf.addPage()
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight
  }

  onProgress?.(90)

  try {
    pdf.save(filename)
  } catch (err) {
    throw new Error(`Không thể lưu PDF: ${err instanceof Error ? err.message : "Lỗi không xác định"}`)
  }

  onProgress?.(100)
}
