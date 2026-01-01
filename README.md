# 🚀 Neon Todo App - Hackathon Project

Mubarak ho! Ye aik **Full-Stack Todo Application** hai jo modern web technologies ka istemal karte hue banayi gayi hai. Is project ko **Sir Taha** ke sikhaye gaye tareeqon ke mutabiq complete kiya gaya hai.

## 🛠️ Tech Stack
* **Frontend:** Next.js (React) + Tailwind CSS
* **Backend:** FastAPI (Python)
* **Database:** Neon PostgreSQL (Serverless)
* **ORM:** SQLAlchemy
* **API Client:** Axios

## ✨ Features
- **Add Tasks:** User title aur description ke saath task add kar sakta hai.
- **Neon Integration:** Saara data cloud-based Neon database mein save hota hai.
- **Delete Functionality:** Fuzool tasks ko aik click par delete kiya ja sakta hai.
- **Real-time Sync:** Frontend aur Backend aapas mein connected hain.

## 📁 Project Structure
- `backend/`: FastAPI server, database configuration, aur models.
- `frontend/`: Next.js app, components, aur API integration.

## 🚀 How to Run

### 1. Backend Start Karein:
```bash
cd backend
uv run uvicorn main:app --reload