# 🚀 LocalVoice AI

**LocalVoice AI** is an AI-powered multilingual campaign content generator built for public awareness campaigns. It helps organizations, NGOs, governments, and businesses create localized, platform-optimized content from a simple campaign brief or uploaded document.

Using Google's Gemini AI, LocalVoice AI transforms a single campaign idea into engaging content tailored for multiple social media platforms, audiences, and languages.

---

## ✨ Features

- 📄 Upload campaign documents (PDF, DOCX, TXT)
- ✍️ Generate content from manual text input
- 🌍 Multilingual content generation
- 📱 Platform-specific optimization
  - Facebook
  - Instagram
  - LinkedIn
  - X (Twitter)
  - WhatsApp
- 🎯 Audience-aware messaging
- 😊 Optional emojis and hashtags
- ✏️ Edit generated content
- 📋 One-click copy
- 📥 Export generated content
- ⚡ Powered by Google Gemini AI

---

## 🛠 Tech Stack

### Frontend

- Next.js 16
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Sonner

### Backend

- FastAPI
- Pydantic
- Google Gen AI SDK
- PyPDF
- python-docx

---

## 📂 Project Structure

```text
localvoiceai/
│
├── backend/
│   ├── app/
│   ├── requirements.txt
│   └── ...
│
├── frontend/
│   ├── app/
│   ├── components/
│   └── ...
│
└── README.md
```

---

## 🚀 Getting Started

### Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/localvoiceai.git

cd localvoiceai
```

---

## Backend Setup

```bash
cd backend

python -m venv .venv

# Windows
.venv\Scripts\activate

# Linux/macOS
source .venv/bin/activate

pip install -r requirements.txt
```

Create a `.env` file inside the backend directory:

```env
GEMINI_API_KEY=YOUR_API_KEY
```

Run the API:

```bash
uvicorn app.main:app --reload
```

Backend runs on:

```
http://localhost:8000
```

---

## Frontend Setup

```bash
cd frontend

npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Run:

```bash
npm run dev
```

Frontend runs on:

```
http://localhost:3000
```

---

## 📷 Screenshots

_Add screenshots of:_

- Home page
- Workspace
- Generated results
- Edit mode

---

## 🌍 Deployment

### Frontend

Vercel

### Backend

Render

---

## Future Improvements

- Real-time trending topics
- AI-powered campaign scoring
- Image generation
- Team collaboration
- Analytics dashboard
- Scheduled publishing
- Translation improvements

---

## 👥 Team

- Godprevail Eseh
- Onuche Dorcas
- Timothy Ajayi
- Chinedu Chibuike
- Bello Femmi
- Okusanya Olajumoke

Built for the **Google Gen AI Hackathon**.

---

## 📄 License

MIT License
