# QA Bug Tracking & Test Management System

Centralized bug tracking and QA management platform replacing Excel-based workflows.

## Stack


| Layer    | Tech                                 |
| -------- | ------------------------------------ |
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Backend  | Node.js, Express, TypeScript, Prisma |
| Database | MySQL 8                              |
| Auth     | JWT in httpOnly cookie + RBAC        |
| Process  | PM2 + Nginx                          |
| CI/CD    | GitHub Actions                       |


## Repository layout

```
backend/     Express API (MVC + Repository)
frontend/    Next.js app (feature hooks/services/components)
postman/     API collection
```



## Quick start



### 1. Database

```bash
docker compose up -d
# or use local MySQL and create database/user from backend/.env.example
```



### 2. Backend

```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

API: `http://localhost:4000`  
Swagger: `http://localhost:4000/api/v1/docs`

### 3. Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

App: `http://localhost:3000`

### Seed users


| Email                                   | Password     | Role            |
| --------------------------------------- | ------------ | --------------- |
| [admin@qa.local](mailto:admin@qa.local) | Password123! | ADMIN           |
| [pm@qa.local](mailto:pm@qa.local)       | Password123! | PROJECT_MANAGER |
| [qa@qa.local](mailto:qa@qa.local)       | Password123! | QA              |
| [dev@qa.local](mailto:dev@qa.local)     | Password123! | DEVELOPER       |


