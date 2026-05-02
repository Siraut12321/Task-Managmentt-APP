# TaskFlow — Full-Stack Task Management App

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![Next.js](https://img.shields.io/badge/next.js-14-black?logo=next.js)
![MongoDB](https://img.shields.io/badge/mongodb-atlas-47A248?logo=mongodb)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-3.x-38BDF8?logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/typescript-5.x-3178C6?logo=typescript)

A production-ready Kanban task manager built with **Next.js 14 + Node.js/Express + MongoDB Atlas**. Features JWT authentication, smart task column logic, priority management, monthly scheduling, and a polished dark glassmorphism UI with Framer Motion animations.

---

## ✨ Features

### 🗂️ Kanban Board
- Three fixed columns: **New Tasks**, **In Progress**, **Completed**
- Each column scrolls independently — the page never scrolls
- Tasks automatically move between columns based on status updates

### 🧩 Task Management
- Create, edit, and delete tasks with confirmation modals
- Set **priority** (Low / Medium / High) with color-coded badges
- Set a **due date** — overdue tasks are highlighted in red
- **Mark complete** toggle moves task to the Completed column
- **Move to In Progress** button promotes a task instantly
- **Schedule for Next Month** — sets due date +1 month, shows a purple `Scheduled` badge

### 🔐 Auth & Security
- JWT-based authentication stored in `localStorage`
- Dashboard is publicly visible — no forced login on load
- All mutating actions (add, edit, delete, toggle) are **auth-gated**
- Unauthenticated users see a "Please login to continue" modal
- Logout requires confirmation via modal

### 🎨 UI / UX
- Dark glassmorphism design (`#0f0f1a` base)
- Framer Motion animations: column fade-in, card hover scale, button press
- Toast notifications for every action (react-hot-toast)
- Skeleton loader while tasks are fetching
- Empty state illustrations per column
- Fully responsive layout

---

## 🛠️ Tech Stack

| Layer     | Technology                                          |
|-----------|-----------------------------------------------------|
| Frontend  | Next.js 14, TypeScript, Tailwind CSS, Framer Motion |
| Backend   | Node.js, Express.js                                 |
| Database  | MongoDB Atlas + Mongoose                            |
| Auth      | JWT (JSON Web Tokens)                               |
| Icons     | Lucide React                                        |
| Toasts    | React Hot Toast                                     |

---

## 📁 Project Structure

```
task-management-app/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Register, login
│   │   └── taskController.js     # CRUD operations
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verification
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   ├── server.js
│   └── vercel.json               # Vercel serverless config
│
└── frontend-next/
    ├── app/
    │   ├── dashboard/            # Kanban board page
    │   ├── login/
    │   ├── register/
    │   ├── forgot-password/
    │   ├── layout.tsx
    │   └── page.tsx              # Redirects to /dashboard
    ├── components/
    │   ├── Loader.tsx
    │   ├── Modal.tsx
    │   ├── Navbar.tsx
    │   ├── Sidebar.tsx
    │   ├── TaskCard.tsx
    │   ├── TaskColumn.tsx
    │   └── TaskForm.tsx
    ├── context/
    │   └── AuthContext.tsx       # Auth state + requireAuth() guard
    ├── lib/
    │   └── api.ts                # Axios instance with JWT interceptor
    ├── types/
│   │   ├── task.ts
│   │   └── user.ts
    └── vercel.json               # Vercel Next.js config
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB Atlas account or local MongoDB instance

### 1. Clone the repository

```bash
git clone https://github.com/Siraut12321/Task-Managmentt-APP.git
cd Task-Managmentt-APP
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
PORT=5000
```

Start the backend:

```bash
npm run dev
```

> Server runs on `http://localhost:5000`

### 3. Frontend setup

```bash
cd ../frontend-next
npm install
npm run dev
```

> App runs on `http://localhost:3000`

---

## 🔌 API Reference

### Auth

| Method | Endpoint             | Description     | Auth Required |
|--------|----------------------|-----------------|---------------|
| POST   | `/api/auth/register` | Register a user | No            |
| POST   | `/api/auth/login`    | Login a user    | No            |

### Tasks

| Method | Endpoint          | Description   | Auth Required |
|--------|-------------------|---------------|---------------|
| GET    | `/api/tasks`      | Get all tasks | ✅ Yes        |
| POST   | `/api/tasks`      | Create a task | ✅ Yes        |
| PUT    | `/api/tasks/:id`  | Update a task | ✅ Yes        |
| DELETE | `/api/tasks/:id`  | Delete a task | ✅ Yes        |

### Task Object

```json
{
  "_id": "64f...",
  "title": "Design landing page",
  "priority": "high",
  "status": "inProgress",
  "scheduled": false,
  "dueDate": "2025-08-01T00:00:00.000Z",
  "completed": false,
  "user": "64e...",
  "createdAt": "2025-07-20T10:00:00.000Z"
}
```

---

## 🧠 Smart Task Logic

| Action                  | Result                                                              |
|-------------------------|---------------------------------------------------------------------|
| Create task             | Lands in **New Tasks** column                                       |
| Click "In Progress"     | Moves to **In Progress** column                                     |
| Click complete toggle   | Moves to **Completed** column                                       |
| Uncheck completed task  | Returns to **New Tasks** column                                     |
| Click "Schedule"        | Sets due date +1 month, stays in New Tasks, shows `Scheduled` badge |

---

## 🔒 Environment Variables

| Variable     | Description                       | Example                                 |
|--------------|-----------------------------------|-----------------------------------------|
| `MONGO_URI`      | MongoDB connection string         | `mongodb://...`                         |
| `JWT_SECRET`     | Secret key for signing JWT tokens | `my_super_secret_key_123`               |
| `PORT`           | Port for the Express server       | `5000`                                  |
| `FRONTEND_URL`   | Allowed CORS origin (frontend)    | `https://your-frontend.vercel.app`      |

> ⚠️ Never commit your `.env` file. It is already listed in `.gitignore`.

---

## 📦 Available Scripts

### Backend

| Script        | Description                     |
|---------------|---------------------------------|
| `npm run dev` | Start with nodemon (hot reload) |
| `npm start`   | Start in production mode        |

### Frontend

| Script          | Description              |
|-----------------|--------------------------|
| `npm run dev`   | Start Next.js dev server |
| `npm run build` | Build for production     |
| `npm start`     | Start production server  |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">Built with ❤️ using Next.js, Express, and MongoDB</p>
