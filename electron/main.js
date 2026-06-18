// electron/main.js
const { app, BrowserWindow, dialog, ipcMain } = require("electron")
const path = require("path")
const fs = require("fs/promises")
const http = require("http")

let server
const PORT = 3456

function startServer() {
  return new Promise((resolve, reject) => {
    server = http.createServer(async (req, res) => {
      const requestPath = (req.url || "/").split("?")[0]
      const filePath = path.join(
        __dirname,
        "..",
        "out",
        requestPath === "/" ? "index.html" : requestPath
      )

      try {
        const data = await fs.readFile(filePath)
        const ext = path.extname(filePath).toLowerCase()

        const mimeTypes = {
          ".html": "text/html",
          ".js": "application/javascript",
          ".css": "text/css",
          ".json": "application/json",
          ".png": "image/png",
          ".jpg": "image/jpeg",
          ".jpeg": "image/jpeg",
          ".gif": "image/gif",
          ".svg": "image/svg+xml",
          ".ico": "image/x-icon",
          ".woff": "font/woff",
          ".woff2": "font/woff2",
        }

        res.writeHead(200, {
          "Content-Type": mimeTypes[ext] || "application/octet-stream",
        })
        res.end(data)
      } catch (error) {
        res.writeHead(404)
        res.end("Not Found")
      }
    })

    server.listen(PORT, "127.0.0.1", () => {
      console.log(`Server running at http://127.0.0.1:${PORT}/`)
      resolve()
    })

    server.on("error", reject)
  })
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  win.loadURL(`http://127.0.0.1:${PORT}/`)
}

function sanitizeFileName(fileName = "evaluacion.pdf") {
  let safeName = fileName
    .replace(/[\\/:*?"<>|.,]/g, "")
    .replace(/\s+/g, " ")
    .trim()

  if (!safeName.toLowerCase().endsWith(".pdf")) {
    safeName += ".pdf"
  }

  return safeName
}

app.whenReady().then(async () => {
  await startServer()
  createWindow()
})

ipcMain.handle("guardar-pdf", async (_event, arrayBuffer, fileName) => {
  const safeFileName = sanitizeFileName(fileName)

  const { canceled, filePath } = await dialog.showSaveDialog({
    title: "Guardar reporte como PDF",
    defaultPath: safeFileName,
    filters: [{ name: "PDF", extensions: ["pdf"] }],
  })

  if (!canceled && filePath) {
    await fs.writeFile(filePath, Buffer.from(arrayBuffer))
    return { success: true, filePath }
  }

  return { success: false }
})

app.on("window-all-closed", () => {
  if (server) server.close()
  if (process.platform !== "darwin") app.quit()
})