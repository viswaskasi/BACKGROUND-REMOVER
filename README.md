# V Background Remover

> **A high-performance AI background removal tool built by Viswas**

Remove image backgrounds with unmatched precision using a local AI model — no API keys, no cost, completely private.

---

## ✨ Features

- 🤖 **Local AI** — Uses the U2Net model via `rembg`, runs 100% on your machine
- 🔒 **Private** — Your images never leave your computer
- 💰 **Free forever** — No API keys or subscriptions needed
- 🖼️ **Before/After Slider** — Interactive comparison of original vs. processed image
- 📥 **HD Download** — Export the result as a transparent PNG

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, Tailwind CSS, Framer Motion |
| Backend | Python, FastAPI, rembg (U2Net model) |
| AI Model | U2Net (via `rembg` library) |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Python](https://python.org/) (v3.9 or higher)

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/background-remover.git
cd background-remover
```

### 2. Set up the Python Backend
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```

### 3. Set up the Next.js Frontend
```bash
cd frontend
npm install
```

### 4. Run the project

**Option A — Use the helper script (Windows)**
Double-click `start-dev.bat` in the root folder.

**Option B — Manual**

Terminal 1 (Backend):
```bash
cd backend
venv\Scripts\python.exe -m uvicorn main:app --port 8000
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

Then open **http://localhost:3000** in your browser.

> **Note:** The first time you run the backend, the U2Net AI model (~170MB) will be automatically downloaded. This only happens once.

---

## 📁 Project Structure

```
BACKGROUND REMOVER/
├── backend/
│   ├── main.py            # FastAPI server with AI processing
│   └── requirements.txt   # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── app/           # Next.js app router pages & API routes
│   │   └── components/    # React components
│   ├── package.json
│   └── next.config.ts
└── start-dev.bat          # One-click startup (Windows)
```

---

## 📄 License

MIT License — feel free to use and modify.

---

*Expertly crafted by Viswas*
