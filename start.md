You are a senior full-stack engineer and product designer.

Build a production-quality full-stack web application called:

“FlowSphere – Team Task Manager”

The application should help teams manage projects, assign tasks, collaborate, and track progress with role-based access control.

====================================================
TECH STACK (MANDATORY)
====================================================

Frontend:
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Zustand or Redux Toolkit for state management
- React Hook Form + Zod validation
- Axios
- TanStack Query

Backend:
- Node.js
- Express.js
- TypeScript
- PostgreSQL using Neon DB
- Prisma ORM
- JWT Authentication
- bcrypt for password hashing
- Modular MVC + Service architecture

Deployment:
- Railway deployment support
- Environment variables properly configured
- Docker-ready if possible

====================================================
PROJECT GOAL
====================================================

Create a modern SaaS-style Team Task Management platform where:

- Users can signup/login
- Admins can create projects
- Admins can invite/manage team members
- Tasks can be created and assigned
- Task progress/status can be tracked
- Dashboards display analytics and overdue tasks
- Role-based access is enforced securely

The application should look like a modern startup product — NOT like a basic college CRUD app.

====================================================
UI/UX REQUIREMENTS (VERY IMPORTANT)
====================================================

The design must feel premium, modern, and unique.

Design inspiration:
- Linear
- Notion
- Jira modern UI
- Vercel dashboard
- Slack minimalism

UI Requirements:
- Glassmorphism + subtle gradients
- Smooth animations using Framer Motion
- Dark/light mode toggle
- Sidebar navigation
- Responsive layout
- Professional typography
- Skeleton loaders
- Empty states
- Toast notifications
- Floating cards
- Modern charts and progress bars
- Mobile responsive

Color Palette:
- Neutral dark theme primary
- Accent gradient:
  from-indigo-500
  via-violet-500
  to-cyan-500

Use spacing and typography professionally.
Avoid clutter.

====================================================
APPLICATION FEATURES
====================================================

------------------------
1. Authentication
------------------------

Features:
- Signup
- Login
- Logout
- JWT access token
- Refresh token optional
- Password hashing
- Protected routes
- Session persistence

Validations:
- Email format
- Strong password validation
- Duplicate email prevention

Roles:
- ADMIN
- MEMBER

Only admins can:
- Create projects
- Manage members
- Assign tasks
- Change roles

Members can:
- View assigned projects/tasks
- Update task status

====================================================
2. Dashboard
====================================================

Dashboard should include:
- Total projects
- Total tasks
- Completed tasks
- Pending tasks
- Overdue tasks
- Team productivity
- Recent activity feed

Use:
- Cards
- Charts
- Progress indicators
- Activity timeline

Dashboard should look visually impressive.

====================================================
3. Project Management
====================================================

Features:
- Create project
- Edit project
- Delete project
- Add team members
- Project description
- Project deadline
- Project status

Each project contains:
- Members
- Tasks
- Activity logs

Views:
- Grid view
- Kanban style preview
- Table view

====================================================
4. Task Management
====================================================

Task fields:
- Title
- Description
- Priority
- Status
- Due date
- Assigned user
- Project relation

Task statuses:
- TODO
- IN_PROGRESS
- REVIEW
- COMPLETED

Priority:
- LOW
- MEDIUM
- HIGH

Features:
- Create task
- Assign task
- Update task
- Move task between statuses
- Filter/search/sort tasks
- Drag-and-drop Kanban board

Add:
- overdue highlighting
- status badges
- priority colors

====================================================
5. Team Management
====================================================

Features:
- Invite members
- Role management
- Member listing
- Activity tracking

Admin permissions required.

====================================================
6. Notifications System
====================================================

Implement:
- Toast notifications
- Real-time-like UX updates
- Task assignment alerts

Optional:
- Socket.io integration

====================================================
BACKEND REQUIREMENTS
====================================================

====================================================
Architecture
====================================================

Use scalable folder structure:

backend/
 ├── src/
 │   ├── modules/
 │   │    ├── auth/
 │   │    ├── users/
 │   │    ├── projects/
 │   │    ├── tasks/
 │   │    ├── dashboard/
 │   │    ├── activity/
 │   ├── middleware/
 │   ├── utils/
 │   ├── config/
 │   ├── prisma/
 │   ├── routes/
 │   ├── types/
 │   ├── app.ts
 │   ├── server.ts

Use:
- Controllers
- Services
- Repositories
- DTO validation
- Centralized error handling

====================================================
Database Design (IMPORTANT)
====================================================

Use PostgreSQL with Prisma.

Required relationships:

User
- id
- name
- email
- password
- role

Project
- id
- title
- description
- deadline
- createdBy

Task
- id
- title
- description
- status
- priority
- dueDate
- assignedTo
- projectId

ProjectMember
- userId
- projectId
- role

ActivityLog
- action
- performedBy
- timestamp

Implement:
- proper foreign keys
- cascading rules
- indexes where necessary

====================================================
API REQUIREMENTS
====================================================

RESTful APIs only.

Use proper status codes.

Required APIs:

Auth:
POST /api/auth/signup
POST /api/auth/login
GET /api/auth/me

Projects:
GET /api/projects
POST /api/projects
GET /api/projects/:id
PUT /api/projects/:id
DELETE /api/projects/:id

Tasks:
GET /api/tasks
POST /api/tasks
PUT /api/tasks/:id
DELETE /api/tasks/:id

Dashboard:
GET /api/dashboard/stats

Members:
POST /api/projects/:id/members
DELETE /api/projects/:id/members/:userId

====================================================
SECURITY REQUIREMENTS
====================================================

Implement:
- JWT middleware
- RBAC middleware
- Rate limiting
- Helmet
- CORS
- Input sanitization
- Zod validations
- Environment variables
- Secure password hashing

====================================================
FRONTEND REQUIREMENTS
====================================================

Use App Router architecture:

frontend/
 ├── app/
 ├── components/
 ├── features/
 ├── hooks/
 ├── services/
 ├── store/
 ├── lib/
 ├── types/
 ├── providers/

Requirements:
- reusable components
- clean hooks
- API abstraction layer
- optimistic UI updates
- loading states
- error boundaries

====================================================
PAGES REQUIRED
====================================================

Public:
- Landing page
- Login
- Signup

Private:
- Dashboard
- Projects page
- Project details
- Kanban board
- Team members
- Settings/profile

====================================================
LANDING PAGE
====================================================

Create a beautiful SaaS landing page with:
- Hero section
- Feature cards
- Animated dashboard preview
- CTA buttons
- Testimonials mock section
- Footer

Must look modern and premium.

====================================================
CODE QUALITY
====================================================

Requirements:
- Type-safe code
- Reusable components
- Clean naming conventions
- No hardcoded values
- Environment configs
- Proper comments only where needed
- ESLint + Prettier

====================================================
DEPLOYMENT REQUIREMENTS
====================================================

Deployment target:
- Railway

Provide:
- Railway deployment steps
- Environment variable setup
- Prisma migration commands
- Build scripts
- Production-ready configs

Use:
- Neon PostgreSQL

====================================================
BONUS FEATURES (IF POSSIBLE)
====================================================

Add some advanced features to stand out:
- Activity timeline
- File attachments
- Team productivity analytics
- Calendar view
- Search command palette
- Keyboard shortcuts
- AI-generated task summaries
- Markdown support in task descriptions

====================================================
FINAL OUTPUT REQUIRED
====================================================

Generate:
1. Full frontend code
2. Full backend code
3. Prisma schema
4. Folder structure
5. API implementation
6. Database setup
7. Railway deployment steps
8. README.md
9. .env.example
10. Seed script with demo data

The codebase must be modular, scalable, and production-ready.

Avoid generic beginner-level implementation.

Make the UI visually outstanding and polished.