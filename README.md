# 🎓 C1 Advanced Exam Generator

A full-stack web app for practising **Cambridge C1 Advanced** exam parts with AI-generated content, structured feedback, progress tracking, and review tools.

## ✨ Features

- 🧠 AI-generated **Reading & Use of English** practice
- ✍️ AI-generated **Writing** tasks with structured feedback
- 📊 Progress tracking and statistics
- 🔁 Review queue for incorrect answers
- 🇬🇧 UK spelling support
- 🔐 JWT authentication
- 🧱 Modular monorepo architecture
- 🐳 Docker Compose for local development

## 🛠️ Tech Stack

### Frontend

- React
- TypeScript
- Tailwind CSS v4
- shadcn/ui

### Backend

- Django
- Django REST Framework
- PostgreSQL
- SimpleJWT
- drf-spectacular
- Anthropic API

### Tooling

- Docker Compose
- Ruff
- mypy
- pytest

## 📁 Project Structure

```text
.
├── backend/
├── frontend/
├── docs/
├── compose.yaml
└── README.md
```

## 🚀 Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/zoesobol/c1-advanced-exam-generator.git
   cd c1-advanced-exam-generator
   ```

2. Create env files:
   - `./.env` (based on `.env.example`)
   - `backend/.env` (based on `.env.example`)
   - `frontend/.env` (based on `.env.example`)

3. Start the app with Docker Compose:

   ```bash
   docker-compose up --build
   ```

4. Open the app in your browser:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:8000/api/](http://localhost:8000/api/)
   - API docs: [http://localhost:8000/api/docs/](http://localhost:8000/api/docs/)

## 📚 Notes

This project is focused on clean architecture, strong typing, structured API design, and portfolio-quality implementation.

## 💖 Author

Built by Zoe Sobol - [zoe.sobol.dev](https://zoe.sobol.dev) | [GitHub](https://github.com/zoesobol) | [LinkedIn](https://linkedin.com/in/zoesobol)
