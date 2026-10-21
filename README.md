# 🚀 PostStudio: Python Multi-Agent LinkedIn Post & Architecture Studio

A professional LinkedIn post generation system, tech disruption intelligence radar, and visual architecture whiteboard built with a **Python 3.13 Multi-Agent Core**, **FastAPI**, and **React**.

---

## 🌟 Key Features

* **🐍 Python 3.13 Multi-Agent Core Engine:** Heavy-duty semantic NLP analysis, burstiness/cadence auditing, and zero-buzzword anti-AI post synthesis running locally on FastAPI.
* **🔑 Multi-Provider AI Access Gateway:** Support for **Google Gemini**, **OpenAI GPT-4o**, **Anthropic Claude**, **Groq Cloud (Llama 3.3 70B)**, or **100% Offline Python Local Mode** (zero API key needed).
* **📡 Live Tech & Job Disruption Radar:** Scrapes real-time developer feeds via Python HTTPX and synthesizes high-stakes career leverage and compensation impact (\$200k–\$320k senior bands).
* **🎨 Clean Visual Workbench:** Distraction-free whiteboard canvas for system architecture diagrams, vector shapes, typography, and high-resolution export without pre-rendered clutter.
* **🛡️ Client-Side Privacy:** API keys are tested live and stored exclusively in browser encrypted `localStorage`. No keys are passed to intermediate third-party servers.

---

## 📋 Prerequisites

Before running PostStudio, ensure you have the following installed on your machine:

1. **Python 3.10 or higher** (Python 3.13 recommended):
   ```bash
   python --version
   ```
2. **Node.js 18 or higher & npm**:
   ```bash
   node --version
   npm --version
   ```
3. **Git**:
   ```bash
   git --version
   ```

---

## 📥 Step-by-Step Installation Guide

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/poststudio.git
cd poststudio
```

---

### Step 2: Set Up Python Virtual Environment (Recommended)

#### On Windows (PowerShell or Command Prompt):
```powershell
python -m venv venv
.\venv\Scripts\activate
```
*(If PowerShell shows an execution policy error, run: `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`)*

#### On macOS / Linux:
```bash
python3 -m venv venv
source venv/bin/activate
```

---

### Step 3: Install Python Backend Dependencies
Install FastAPI, Uvicorn, HTTPX, and required libraries:
```bash
pip install -r backend/requirements.txt
```

---

### Step 4: Install Frontend Dependencies
Install React, TailwindCSS, Vite, and UI dependencies:
```bash
npm install
```

---

## 🚀 Execution Guide

### Method A: Single-Command Runner (Easiest & Recommended)
Run both the Python FastAPI server and the Vite React studio together with one command:

```bash
python run.py
```

This automatically boots:
* **Web Studio:** `http://localhost:3000`
* **Python FastAPI Backend:** `http://127.0.0.1:8000`
* **Interactive API Documentation:** `http://127.0.0.1:8000/docs`

---

### Method B: Manual Separate Terminals (For Developers)

If you prefer running the backend and frontend in separate terminals:

#### Terminal 1 — Python FastAPI Backend:
```bash
python -m uvicorn app:app --app-dir backend --host 127.0.0.1 --port 8000 --reload
```
*Verify backend health:* Open `http://127.0.0.1:8000/api/health` in your browser.

#### Terminal 2 — React Presentation Layer:
```bash
npm run dev -- --port 3000
```
*Access studio:* Open `http://localhost:3000` in your browser.

---

## 🌐 Application URL Access Points

| Service | URL | Description |
| :--- | :--- | :--- |
| **Studio Workspace** | [http://localhost:3000](http://localhost:3000) | Main React creation canvas & workbench |
| **FastAPI Backend** | [http://127.0.0.1:8000](http://127.0.0.1:8000) | Python REST API service |
| **Swagger API Docs** | [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) | Interactive OpenAPI documentation & test endpoints |
| **API Health Status** | [http://127.0.0.1:8000/api/health](http://127.0.0.1:8000/api/health) | Live JSON health check |

---

## 🔑 AI Providers & Credentials Configuration

When you first open PostStudio, you will see the **Multi-Provider Access Gateway**. You can select your provider or change it anytime:

1. **Google Gemini (Default API):**
   * Models: `gemini-1.5-flash`, `gemini-2.0-flash`, `gemini-1.5-pro` (auto-detected).
   * Get Free Key: [Google AI Studio](https://aistudio.google.com/app/apikey)
2. **OpenAI:**
   * Models: `gpt-4o`, `gpt-4o-mini`, `gpt-3.5-turbo`.
   * Get Key: [OpenAI Platform](https://platform.openai.com/api-keys)
3. **Anthropic Claude:**
   * Models: `claude-3-5-sonnet-20241022`, `claude-3-haiku`.
   * Get Key: [Anthropic Console](https://console.anthropic.com/)
4. **Groq Cloud:**
   * Models: `llama-3.3-70b-versatile` (500+ tokens/sec).
   * Get Free Key: [Groq Console](https://console.groq.com/keys)
5. **Python Local Mode (100% Offline & Free):**
   * **No API key required!** Uses the local Python multi-cadence NLP engine running on FastAPI.

---

## ☁️ Deploy to Render (100% Free 24/7 Hosting)

PostStudio is pre-configured with a **`render.yaml` Blueprint** and multi-stage **`Dockerfile`**. You can deploy it live in 3 clicks:

### Method 1: Automatic Blueprint (Easiest)
1. Go to **[dashboard.render.com](https://dashboard.render.com/)** and log in with GitHub.
2. Click **New +** (top right) ➔ Select **Blueprint**.
3. Select your repository: **`Adeebkhann/PostStudio`**.
4. Click **Apply**. Render automatically reads `render.yaml`, builds the Docker container, and deploys both frontend and backend on a free HTTPS URL!

### Method 2: Manual Web Service
1. Click **New +** ➔ Select **Web Service**.
2. Connect your repository **`Adeebkhann/PostStudio`**.
3. Render will auto-detect the **Docker** environment.
4. Select the **Free** instance type ($0/mo) and click **Deploy Web Service**!

Your app will be live 24/7 at: `https://poststudio-xxxx.onrender.com`

---

## 🛠️ Troubleshooting

### 1. "Port 8000 or 3000 is already in use"
* **Kill existing port 8000 on Windows:**
  ```powershell
  Get-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess | Stop-Process -Force
  ```
* **Kill existing port 3000 on Windows:**
  ```powershell
  Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force
  ```

### 2. "pip is not recognized as an internal or external command"
Ensure Python was installed with the **"Add Python to PATH"** option checked. Alternatively, use:
```powershell
python -m pip install -r backend/requirements.txt
```

### 3. "npm command not found"
Download and install the LTS version of Node.js from [nodejs.org](https://nodejs.org/).

---

## 📁 Repository Structure

```
linkedin-post/
├── backend/
│   ├── app.py           # FastAPI server & route handlers
│   ├── post_engine.py   # Multi-agent NLP, dynamic model discovery & prompt synthesis
│   ├── radar_engine.py  # Live feed scraping & career leverage analysis
│   └── requirements.txt # Python dependencies (fastapi, uvicorn, httpx, etc.)
├── run.py               # All-in-one launcher script
├── src/
│   ├── components/
│   │   ├── auth/        # LoginAccessModal (Multi-Provider Login Gateway)
│   │   ├── layout/      # StudioHeader, LeftSidebar, RightSidebar
│   │   ├── studio/      # ThoughtInputCard, UnfoldingCard, TechRadarView, SettingsView
│   │   └── workbench/   # VisualWorkbench (Clean whiteboard canvas)
│   ├── services/
│   │   ├── aiProviderService.ts  # Multi-provider routing & live testing
│   │   ├── antiAiEngine.ts       # Client fallback & burstiness cadence
│   │   ├── geminiService.ts      # Dynamic Gemini v1beta model discovery
│   │   └── techRadarService.ts   # Live radar client & fallbacks
│   └── types/           # TypeScript interfaces (studio, canvas, providers)
├── _bmad-output/
│   └── planning-artifacts/
│       ├── prd.md       # Product Requirements Document
│       └── architecture/architecture-linkedin-post-2026-10-17/
│           └── ARCHITECTURE-SPINE.md  # Architecture Specification
├── package.json         # Node.js dependencies & build scripts
├── vite.config.ts       # Vite bundler configuration
└── README.md            # Comprehensive project documentation
```

---

## 📄 License & Attribution

Built for software architects, Python developers, and tech creators. Open-source and MIT Licensed.
