export {}

declare global {
  interface Window {
    electronAPI?: {
      guardarPDF: (
        arrayBuffer: ArrayBuffer,
        fileName: string
      ) => Promise<{ success: boolean; filePath?: string }>
    }
  }
}