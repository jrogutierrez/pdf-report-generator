"use client"

import { useEffect, useState } from "react"

interface LoadingScreenProps {
  onComplete: () => void
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const start = Date.now()
    const duration = 2600
    const interval = setInterval(() => {
      const elapsed = Date.now() - start
      const pct = Math.min(100, Math.round((elapsed / duration) * 100))
      setProgress(pct)
      if (pct >= 100) {
        clearInterval(interval)
        // trigger the grow + fade transition
        setExiting(true)
        setTimeout(onComplete, 900)
      }
    }, 30)
    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-8 bg-background px-6">
      <div
        className="relative transition-all duration-[900ms] ease-in-out"
        style={{
          transform: exiting ? "scale(2.2)" : "scale(1)",
          opacity: exiting ? 0 : 1,
        }}
      >
        <img
          src="/perro-salchicha-secretario.png"
          alt="Perro salchicha vestido de secretario"
          width={260}
          height={260}
          
          className="size-56 rounded-3xl object-contain drop-shadow-sm sm:size-64"
        />
      </div>

      <div
        className="flex w-full max-w-xs flex-col items-center gap-3 transition-opacity duration-500"
        style={{ opacity: exiting ? 0 : 1 }}
      >
        <h1 className="text-balance text-center text-xl font-semibold text-foreground">
          Salchicretario
        </h1>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-sm text-muted-foreground">{progress}%</span>
      </div>
    </div>
  )
}
