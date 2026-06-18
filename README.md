Report Generator (Desktop App)

> A desktop application built with Next.js, TypeScript, and Electron that automates the generation of psychological evaluation reports, saving hours of manual administrative work.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)
![Electron](https://img.shields.io/badge/Electron-34-47848F?logo=electron)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2-38B2AC?logo=tailwindcss)
![jsPDF](https://img.shields.io/badge/jsPDF-PDF_Generation-red)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

## 💡 The Problem
Psychologists and HR professionals were spending hours manually copying and pasting patient data (Name, ID, Date) into Word templates to generate evaluation reports. This repetitive task was prone to human error and wasted valuable time.

## 🚀 The Solution
A streamlined, native desktop application that provides a clean form interface. With a single click, it generates a perfectly formatted PDF, prompts the user with a native OS "Save As" dialog, auto-names the file, and instantly resets for the next patient.

**Result:** What used to take 15 minutes per report now takes 30 seconds.

---

## ✨ Key Features
- **Native Desktop Experience:** Packaged as a Windows `.exe` installer with custom icons and shortcuts.
- **Automated PDF Generation:** Converts HTML/CSS to high-quality A4 PDF documents.
- **Smart File Naming:** Automatically generates filenames based on form data (e.g., `25-06-2025 Juan Perez 12345678.pdf`).
- **Input Sanitization:** Prevents OS-level errors by stripping invalid characters (`,`, `.`, `/`, etc.) from filenames.
- **Seamless UX Flow:** State machine architecture (`Loading` → `Form` → `Report` → `Form`) that automatically resets after a successful export.
- **Native OS Integration:** Uses Electron's native `dialog.showSaveDialog` for a familiar file-saving experience.

---

## 🏗️ Architecture & Technical Highlights

This project was an excellent opportunity to bridge the gap between modern web frameworks and desktop environments.

### 1. Next.js + Electron Integration
Next.js is designed for the server, while Electron runs locally. 
- **Solution:** Configured Next.js with `output: 'export'` to generate static HTML/JS/CSS. 
- Implemented a local HTTP server within the Electron Main Process (port 3456) to serve the static files, bypassing the strict CORS and routing limitations of the `file://` protocol.

### 2. Secure IPC Communication
Security is critical in Electron. 
- **Solution:** Disabled `nodeIntegration` and enabled `contextIsolation`. 
- Created a secure bridge using `preload.js` and `contextBridge` to expose only the necessary `fs` (File System) and `dialog` APIs to the React renderer process.

### 3. Overcoming CSS Limitations in PDF Rendering
The UI uses modern CSS `oklch()` color spaces (via Tailwind), which `html2canvas` cannot parse, causing the PDF generation to crash.
- **Solution:** Implemented an `onclone` callback in `html2canvas` to strip external stylesheets from the cloned DOM before capture. Applied explicit inline styles (hex colors) to the report container to ensure 100% rendering reliability.

### 4. State Management
Used a Finite State Machine (FSM) approach with React's `useState` in the parent component to control the application flow, lifting state up and passing callbacks (`onSubmit`, `onExported`) to child components.

---

## 🛠️ Tech Stack
- **Frontend:** React 19, Next.js 16, TypeScript, Tailwind CSS, shadcn/ui
- **Desktop:** Electron, electron-builder (NSIS)
- **PDF Engine:** jsPDF, html2canvas
- **Runtime:** Node.js

---

## 🏃‍♂️ Getting Started (Local Development)

### Prerequisites
- Node.js (v18+)
- npm or pnpm

### Installation
```bash
git clone https://github.com/jrogutierrez/pdf-report-generator.git
cd pdf-report-generator
npm install
Run in Development Mode
This will start the Next.js development server and open the Electron window.

Bash

npm run dev
# In another terminal:
npm run electron:dev

📦 Building for Production
To generate the standalone Windows installer (.exe):

Bash

npm run electron:build
This command will:

Build the Next.js static export (out/ folder).
Package the app using electron-builder.
Output the installer in the dist/ directory.
🔮 Future Roadmap
 Implement Dark Mode toggle.
 Add a local SQLite database to keep a history of generated reports.
 Support multiple report templates.
 Implement auto-updates using electron-updater.
 
👤 Author & Contact
Built with 💻 and ☕ by José Roberto Gutiérrez (Replace with your actual name).

I built this project to solve a real-world problem for a real user. I'm currently looking for new opportunities as a Frontend/Fullstack Developer. If you're looking for someone who focuses on pragmatic solutions, clean architecture, and user experience, let's connect!

⚠️ The seal image included is a generic placeholder. 
 In production, it is replaced with the professional's official seal.

## 📄 License

This project is licensed under the MIT License. 
See the [LICENSE](./LICENSE) file for details.

LinkedIn: https://www.linkedin.com/in/jrogutierrez/
Portfolio: https://claramente.pro/
Email: roberto@claramente.pro
