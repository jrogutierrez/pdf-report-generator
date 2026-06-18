"use client"

import { useRef, useState } from "react"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import { FileText, CheckCircle, ArrowLeft } from "lucide-react"
import type { ReportData } from "./evaluation-form"

interface ReportViewProps {
  data: ReportData
  onExported: () => void
}

function formatFecha(value: string) {
  if (!value) return ""
  const [y, m, d] = value.split("-")
  if (!y || !m || !d) return value
  return `${d}/${m}/${y}`
}

function fechaConGuiones(value: string) {
  if (!value) return ""
  const [y, m, d] = value.split("-")
  if (!y || !m || !d) return value
  return `${d}-${m}-${y}`
}

export function ReportView({ data, onExported }: ReportViewProps) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const [generating, setGenerating] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const fecha = formatFecha(data.fecha)

  async function handleExport() {
    if (!sheetRef.current || generating) return
    setGenerating(true)
    try {
      const canvas = await html2canvas(sheetRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        onclone: (clonedDoc) => {
          // Eliminar TODAS las hojas de estilo para evitar oklch
          const links = clonedDoc.querySelectorAll('link[rel="stylesheet"]')
          links.forEach((link) => link.remove())
          const styles = clonedDoc.querySelectorAll('style')
          styles.forEach((style) => style.remove())
        },
      })

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const imgHeight = (canvas.height * pageWidth) / canvas.width
      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, Math.min(imgHeight, pageHeight))

      const fileName = [fechaConGuiones(data.fecha), data.nombre, data.dni]
        .filter(Boolean)
        .join(" ")
        .trim()

      if (window.electronAPI) {
        const pdfArrayBuffer = pdf.output("arraybuffer")
        const suggestedFileName = `${fileName || "evaluacion"}.pdf`
const resultado = await window.electronAPI.guardarPDF(pdfArrayBuffer, suggestedFileName)

        if (resultado.success) {
          setShowNotification(true)
          setTimeout(() => {
            setShowNotification(false)
            onExported()
          }, 2000)
        }
      } else {
        pdf.save(`${fileName || "evaluacion"}.pdf`)
        onExported()
      }
    } catch (error) {
      console.error("Error al generar PDF:", error)
    } finally {
      setGenerating(false)
    }
  }

  // Estilos inline para el PDF (evita oklch)
  const pageStyle: React.CSSProperties = {
    width: "210mm",
    minHeight: "297mm",
    padding: "22mm 18mm 22mm 26mm",
    boxSizing: "border-box",
    backgroundColor: "#ffffff",
    color: "#1a1a2e",
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: "12px",
    lineHeight: "1.6",
  }

  const titleStyle: React.CSSProperties = {
    textAlign: "center",
    fontSize: "18px",
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: "16px",
    color: "#1a1a2e",
  }

  const sectionTitle: React.CSSProperties = {
    fontSize: "13px",
    fontWeight: "bold",
    marginBottom: "4px",
    color: "#1a1a2e",
  }

  const paragraph: React.CSSProperties = {
    fontSize: "12px",
    lineHeight: "1.6",
    marginBottom: "12px",
    textAlign: "justify",
    color: "#1a1a2e",
  }

  const listStyle: React.CSSProperties = {
    fontSize: "12px",
    lineHeight: "1.6",
    marginBottom: "16px",
    paddingLeft: "24px",
    color: "#1a1a2e",
  }

const subTitleStyle: React.CSSProperties = {
  fontSize: "12px",
  fontWeight: "bold",
  marginBottom: "6px",
  color: "#1a1a2e",
}
  const listNone: React.CSSProperties = {
    fontSize: "12px",
    lineHeight: "1.6",
    marginBottom: "16px",
    paddingLeft: "8px",
    listStyle: "none",
    color: "#1a1a2e",

  }

  return (
    <div className="min-h-svh bg-muted px-4 py-8">
      {/* Botón volver al formulario */}
      <button
        type="button"
        onClick={onExported}
        aria-label="Volver al formulario"
        className="fixed left-5 top-5 z-50 flex items-center gap-2 rounded-full px-4 py-3 font-semibold shadow-lg transition-opacity hover:opacity-80"
        style={{ backgroundColor: "#b6e8c0", color: "#1a1a2e" }}
      >
        <ArrowLeft className="size-5" />
        <span className="hidden sm:inline">Volver</span>
      </button>

      {/* Botón flotante para exportar PDF */}
      <button
        type="button"
        onClick={handleExport}
        disabled={generating}
        aria-label="Exportar a PDF"
        className="fixed right-5 top-5 z-50 flex items-center gap-2 rounded-full bg-primary px-4 py-3 font-semibold text-primary-foreground shadow-lg transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        <FileText className="size-5" />
        <span className="hidden sm:inline">{generating ? "Generando..." : "PDF"}</span>
      </button>

      {/* Notificación temporal */}
      {showNotification && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-white shadow-lg transition-all">
          <CheckCircle className="size-5" />
          <span className="font-medium">PDF generado</span>
        </div>
      )}

      {/* Hoja A4 */}
      <div className="mx-auto max-w-[210mm]">
        <div ref={sheetRef} style={pageStyle}>
          <h1 style={titleStyle}>
            Reporte de Evaluación Psicológica
          </h1>

          <p style={paragraph}>
            Se realizó la evaluación psicológica del paciente para determinar si la persona es
            apta realizar el trabajo en la cual se desempeña evaluando habilidades cognitivas,
            rasgos de la personalidad, estabilidad emocional y capacidad psicomotoras en pruebas
            proyectivas.
          </p>
          <p style={paragraph}>
            <strong>Fecha examen:</strong> {fecha}.
          </p>

          <h2 style={sectionTitle}>DATOS DEL EVALUADO</h2>
          <p style={{ ...paragraph, marginBottom: "4px" }}>
            <strong>Apellido y Nombres:</strong> {data.nombre}.
          </p>
          <p style={paragraph}>
            <strong>DNI:</strong> {data.dni}
          </p>

          <h2 style={sectionTitle}>METODOLOGÍA DE EVALUACIÓN:</h2>
          <ul style={{ ...listStyle, marginBottom: "8px" }}>
            <li>Entrevista Psicológica Estructurada (EPE)</li>
          </ul>

          <h3 style={subTitleStyle}>Batería de Test Proyectivo</h3>
          <ul style={listStyle}>
            <li>Test de la Figura Humana (DFH)</li>
            <li>Test de Persona Bajo la Lluvia (PBLL)</li>
            <li>Test Gestáltico Visomotor de Bender</li>
            <li>Cuestionario Desiderativo (CD)</li>
          </ul>

          <h2 style={sectionTitle}>CONCLUSIONES DE LA EVALUACIÓN:</h2>
          <p style={paragraph}>
            El evaluado se muestra dispuesto y colaborativo con el proceso de evaluación.
            Manteniendo una actitud psicoactiva y apropiada y logrando completar exitosamente la
            evaluación.
          </p>
          <p style={paragraph}>
            No manifiesta consumo de sustancias psicoactivas, trastornos mentales o síntomas
            psicopatológicos. Demuestra adaptación adecuada a su rol laboral. Demuestra
            consciencia de responsabilidad profesional.
          </p>
          <p style={{ ...paragraph, marginBottom: "4px" }}>
            El evaluado, {data.tratamiento} {data.nombre} presenta:
          </p>
          <ul style={listNone}>
            <li>
              <strong>Estado mental:</strong> Lúcido y orientado.
            </li>
            <li>
              <strong>Juicio de realidad:</strong> Conservado.
            </li>
            <li>
              <strong>Funciones cognitivas:</strong> Preservadas.
            </li>
            <li>
              <strong>Estabilidad emocional:</strong> Adecuada.
            </li>
          </ul>

          <h2 style={sectionTitle}>APTITUD:</h2>
          <p style={paragraph}>
            Se determina que el evaluado se encuentra APTO para la conducción de vehículos
            Categoría Profesional.
          </p>

          <h2 style={sectionTitle}>OBSERVACIONES:</h2>
          <p style={{ ...paragraph, marginBottom: "24px" }}>
            Se deja constancia que esta evaluación refleja el estado actual del evaluado, pudiendo
            modificarse con el transcurrir del tiempo y con las experiencias o situaciones que
            atraviese la persona en su rutina diaria.
          </p>

          <div style={{ display: "flex", justifyContent: "center", paddingTop: "32px" }}>
            <img
              src="/sello.png"
              alt="Sello de evaluación psicológica"
              crossOrigin="anonymous"
              style={{ height: "120px", width: "120px", objectFit: "contain" }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}