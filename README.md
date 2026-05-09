# FlowSphere – Team Task Manager

A production-quality full-stack SaaS team task management platform inspired by Linear, Notion, and Jira.

## ✨ Features

- 🔐 JWT Authentication with RBAC (Admin / Member)
- 📊 Analytics Dashboard with Charts
- 📁 Project Management (CRUD, Grid view)
- 🎯 Kanban Board with Drag-and-Drop
- 👥 Team Management
- 📋 Task Assignment with Priority, Status, Due Dates
- 📡 Activity Timeline
- 🌙 Dark Mode Premium UI (Glassmorphism)
- 🔒 Rate Limiting, Helmet, CORS, Zod validation

## 🛠 Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, Framer Motion, Zustand, TanStack Query, dnd-kit |
| Backend | Node.js, Express.js, TypeScript, Prisma ORM, PostgreSQL (Neon) |
| Auth | JWT, bcrypt |
| Deployment | Railway + Neon PostgreSQL |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database (or Neon DB free tier)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT_SECRET
npx prisma db push
npm run seed       # Seed demo data
npm run dev        # Starts on :5000
```

### Frontend Setup

```bash
cd frontend
npm install
# Edit .env.local: NEXT_PUBLIC_API_URL=http://localhost:5000/api
npm run dev        # Starts on :3000
```

## 🔑 Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | utsavjha.me@gmail.com | Utsav@123 |
| Member | zahid147web@gmail.com | Zahid@123|

## 📁 Project Structure

```
Athena/
├── backend/
│   ├── prisma/schema.prisma
│   └── src/
│       ├── modules/auth | projects | tasks | dashboard | activity
│       ├── middleware/auth | rbac | error
│       ├── utils/jwt | response
│       ├── config/
│       ├── routes/
│       ├── app.ts
│       └── server.ts
└── frontend/
    ├── app/
    │   ├── (auth)/login | signup
    │   ├── (dashboard)/dashboard | projects | tasks | team | settings
    │   └── page.tsx (landing)
    ├── components/layout/Sidebar
    ├── store/auth.store.ts (Zustand)
    ├── services/api.service.ts
    ├── providers/
    ├── lib/api.ts | utils.ts
    └── types/index.ts
```

## 🗄 Database Schema

- **User** – id, name, email, password, role (ADMIN | MEMBER)
- **Project** – id, title, description, status, deadline, createdBy
- **ProjectMember** – userId, projectId, role (junction table)
- **Task** – id, title, status (TODO|IN_PROGRESS|REVIEW|COMPLETED), priority (LOW|MEDIUM|HIGH), dueDate, assignedTo, projectId
- **ActivityLog** – action, entityType, entityId, performedBy, projectId

## 🚂 Railway Deployment

### Backend
1. Create new Railway project → Deploy from GitHub
2. Set environment variables:
   - `DATABASE_URL` (Neon PostgreSQL connection string)
   - `JWT_SECRET` (random 64-char string)
   - `NODE_ENV=production`
   - `FRONTEND_URL` (your Vercel frontend URL)
3. Add build command: `npm run build`
4. Add start command: `npm start`
5. After first deploy: `npx prisma migrate deploy && npm run seed`

### Frontend
1. Deploy to Vercel or Railway
2. Set `NEXT_PUBLIC_API_URL` to your Railway backend URL
3. Build command: `npm run build`

## 📝 API Endpoints

```
POST   /api/auth/signup
POST   /api/auth/login
GET    /api/auth/me

GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PUT    /api/projects/:id
DELETE /api/projects/:id
POST   /api/projects/:id/members
DELETE /api/projects/:id/members/:userId
GET    /api/projects/users

GET    /api/tasks?projectId=
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id

GET    /api/dashboard/stats
```

## 🔧 Environment Variables

### Backend `.env`
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
```

### Frontend `.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```
