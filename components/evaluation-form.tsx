"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export interface ReportData {
  tratamiento: string // Sr. / Sra.
  fecha: string
  nombre: string
  dni: string
}

interface EvaluationFormProps {
  onSubmit: (data: ReportData) => void
}

export function EvaluationForm({ onSubmit }: EvaluationFormProps) {
  const [tratamiento, setTratamiento] = useState("Sr.")
  const [fecha, setFecha] = useState("")
  const [nombre, setNombre] = useState("")
  const [dni, setDni] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit({ tratamiento, fecha, nombre, dni })
  }

  const inputClass =
    "w-full rounded-lg border border-border bg-card px-4 py-2.5 text-card-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"

  return (
    <div className="flex min-h-svh items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl bg-[var(--celeste)] p-6 shadow-sm sm:p-8"
      >
        <h1 className="mb-1 text-balance text-center text-2xl font-semibold text-foreground">
          Evaluación Psicológica
        </h1>
        <p className="mb-6 text-center text-sm text-muted-foreground">
          Complete los datos del evaluado
        </p>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="tratamiento" className="text-sm font-medium text-foreground">
              Sr./Sra.
            </label>
            <select
              id="tratamiento"
              value={tratamiento}
              onChange={(e) => setTratamiento(e.target.value)}
              className={inputClass}
            >
              <option value="Sr.">Sr.</option>
              <option value="Sra.">Sra.</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="fecha" className="text-sm font-medium text-foreground">
              Fecha
            </label>
            <input
              id="fecha"
              type="date"
              required
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="nombre" className="text-sm font-medium text-foreground">
              Nombre
            </label>
            <input
              id="nombre"
              type="text"
              required
              placeholder="Apellido y Nombres"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="dni" className="text-sm font-medium text-foreground">
              DNI
            </label>
            <input
              id="dni"
              type="text"
              required
              inputMode="numeric"
              placeholder="00000000"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <Button type="submit" className="mt-6 w-full text-base font-semibold" size="lg">
          ENVIAR
        </Button>
      </form>
    </div>
  )
}
