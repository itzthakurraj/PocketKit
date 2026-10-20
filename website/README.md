# MultiTools - All-in-One Online Developer & Utility Tools

A comprehensive, privacy-first suite of **70+ online utilities** for text manipulation, code formatting, image editing, PDF conversion, cryptography, and financial calculations. All operations execute 100% locally in the browser with zero server uploads.

---

## 🚀 Running Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (version 18 or higher) installed on your machine.

### 1. Clone the Repository
```bash
git clone https://github.com/itzthakurraj/MultiTools.git
cd MultiTools
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Development Server
```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:3000
```

---

## 🛠️ Available Scripts

- **`npm run dev`** — Starts the local Vite development server on port 3000 with hot module reloading.
- **`npm run build`** — Type-checks TypeScript and compiles the production-optimized build into the `dist/` directory.
- **`npm run preview`** — Serves the production build locally to test performance before deploying.
- **`npm run lint`** — Validates the codebase for syntax or type errors (`tsc --noEmit`).

---

## 📱 Progressive Web App (PWA)

The project includes full PWA support with an in-app installation prompt, offline caching, and responsive mobile icons.
- When running locally or hosted with HTTPS, click **"Install App"** in the header to install MultiTools as a native standalone application on Windows, Mac, Linux, Android, or iOS.

---

## 🔒 Privacy & Security Guarantee

All calculations, cryptographic operations, file compressions, and PDF generation run entirely in client-side Web Workers and JavaScript. **No user files or inputs are ever sent to any remote server or stored in persistent storage.**