"use client"

import { useState } from "react"
import { LoadingScreen } from "@/components/loading-screen"
import { EvaluationForm, type ReportData } from "@/components/evaluation-form"
import { ReportView } from "@/components/report-view"

type Stage = "loading" | "form" | "report"

export default function Home() {
  const [stage, setStage] = useState<Stage>("loading")
  const [data, setData] = useState<ReportData | null>(null)

  return (
    <main className="min-h-svh bg-background">
      {stage === "loading" && <LoadingScreen onComplete={() => setStage("form")} />}

      {stage === "form" && (
        <EvaluationForm
          onSubmit={(values) => {
            setData(values)
            setStage("report")
          }}
        />
      )}

      {stage === "report" && data && (
        <ReportView
          data={data}
          onExported={() => {
            setData(null)
            setStage("form")
          }}
        />
      )}
    </main>
  )
}
