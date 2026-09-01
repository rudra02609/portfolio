<div align="center">

# Rudra Prajapati — Portfolio

### Full-Stack Developer Portfolio

![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite_6-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

<br/>

**A sleek, dark-themed portfolio featuring glassmorphism UI, mouse-scrubbed video backgrounds, custom cursor, scroll-animated sections, and a fully responsive layout.**

</div>

--- 
https://github.com/user-attachments/assets/2fe2db2c-824e-4a44-98fe-114ff9cb3389


## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎨 **Glassmorphism Design** | Frosted glass cards with backdrop-blur and subtle borders |
| 🖱️ **Mouse-Scrubbed Video** | Background video that follows your cursor |
| 🔮 **Custom Cursor** | Animated, interactive cursor effect |
| 📜 **Scroll Animations** | Sections animate in as you scroll using Framer Motion |
| 🌙 **Dark Theme** | Full dark mode with carefully crafted color palette |
| 📱 **Fully Responsive** | Looks great on desktop, tablet, and mobile |
| 🔐 **Auth System** | Sign In / Create Account with JWT + MongoDB |
| 📬 **Contact Form** | Integrated EmailJS for direct messaging |

---

## 🗂️ Project Structure

```
portfolio/
├── 📂 src/
│   ├── components/     → Navbar, Hero, Sections, Effects
│   ├── constants/      → portfolioData.ts (central content)
│   ├── context/        → AuthContext, ToastContext
│   ├── hooks/          → useScrollSpy, useTypewriter
│   └── services/       → github, task, auth, contact service layers
├── 📂 public/
└── 📂 backend/                → Express + MongoDB
    ├── routes/
    ├── models/
    ├── middleware/
    └── server.js
```

---

## 🚀 Quick Start

### Frontend Only

```bash
npm install
cp .env.example .env      # fill in values (optional for local dev)
npm run dev               # http://localhost:3000
```

### Full Stack (Frontend + Backend)

```bash
npm run dev:all           # Frontend (3000) + Backend (5000)
```

Or run separately:

```bash
npm run dev:frontend      # Terminal 1
npm run dev:backend       # Terminal 2 (requires MongoDB on 27017)
```

> **Note:** Backend secrets go in `backend/.env` — copy from `backend/.env.example`. At minimum, set `MONGODB_URI` and `JWT_SECRET`. Never commit real secrets.

---

## 🛠️ Build & Lint

```bash
npm run build             # Production build
npm run lint              # TypeScript type check
```

---

<div align="center">

**Built with care by [Rudra Prajapati](https://github.com/rudra0710)**

</div>
