# Brevly

**Brevly** is a modern, fullstack **link shortener**. It provides:

- ✨ Custom short links  
- 📊 Link analytics and usage tracking  
- 📤 CSV export for easy reporting  
---

## 🚀 Features

- 🔗 **Custom Slugs** – Create branded short links (e.g., `brev.ly/launch2025`)  
- 📈 **Real-Time Analytics** – Track views 
- 📤 **CSV Export** – Export link performance data on demand  
- 🧰 **REST API** – Full API for managing links programmatically  
- 🖥️ **Frontend UI** – Clean and responsive React + Vite interface  

---

## 🗂 Project Structure

```
.
├── server/      # Backend API, database, and analytics logic
└── web/         # Frontend app (React + TailwindCSS)
```

---

## ⚙️ Tech Stack

- **Frontend**: React, Vite, TailwindCSS, TypeScript  
- **Backend**: Node.js, TypeScript 
- **Database**: PostgreSQL (Dockerized)  
- **Dev Tools**: pnpm, Docker, Biome, ESM  

---

## 🧪 Getting Started

### 1. Clone the Project

```bash
git clone https://github.com/DiegoCAntunes/Brev.ly
cd brevly
pnpm install -r
```

### 2. Start the Database

```bash
cd server
docker compose up -d
```

### 3. Start Backend & Frontend

```bash
# In separate terminals:

cd server
pnpm dev

cd web
pnpm dev
```

---

## 📁 Environment Setup

### Backend (`server/.env`)

```
DATABASE_URL=postgres://user:password@localhost:5432/brevly
PORT=3333
```

### Frontend (`web/.env`)

```
VITE_API_URL=http://localhost:3333
```

---

## 📤 CSV Export

Brevly allows one-click export of link analytics data via CSV. Great for:

- Reporting  
- Marketing campaign reviews  
- Offline analysis  

---

## 📦 Scripts

Run inside `web/` or `server/`:

```bash
pnpm dev       # Start dev server
pnpm build     # Build project
pnpm lint      # Lint code
```
---