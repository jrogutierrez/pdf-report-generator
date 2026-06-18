// electron/preload.js
const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("electronAPI", {
  guardarPDF: (arrayBuffer, fileName) =>
    ipcRenderer.invoke("guardar-pdf", arrayBuffer, fileName),
})