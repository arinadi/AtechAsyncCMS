# Phase 1: Infrastructure & Authentication

## 1. Project Initialization
- [x] Initialize Next.js 15 with App Router, TypeScript, Tailwind, ESLint
- [x] Configure folder structure (`src/app/(admin)`, `(public)`, `api/`, `components/`, `lib/`, `db/`)
- [x] Create `vercel.json` with serverless config
- [x] Update `next.config.js` for serverless optimizations

## 2. Database Configuration (Neon + Drizzle)
- [x] Setup Drizzle ORM with Neon serverless driver
- [x] Create database schema files:
  - [x] `src/db/schema/users.ts`
  - [x] `src/db/schema/auth.ts` (accounts, sessions, verification_tokens)
  - [x] `src/db/schema/posts.ts`
  - [x] `src/db/schema/post-meta.ts`
  - [x] `src/db/schema/options.ts`
  - [x] `src/db/schema/index.ts`
- [x] Create database connection (`src/db/index.ts`)
- [x] Create `drizzle.config.ts`
- [x] Create `.env.example` with required variables

## 3. Authentication Setup (Auth.js v5 + Google OAuth)
- [x] Create Auth.js configuration (`src/lib/auth.ts`)
- [x] Create API route handler (`src/app/api/auth/[...nextauth]/route.ts`)
- [x] Create route protection middleware (`src/middleware.ts`)
- [x] Create health check endpoint (`src/app/api/health/route.ts`)

## 4. Setup Wizard & Profile Completion
- [x] Create setup page (`src/app/setup/page.tsx`)
- [x] Create complete profile page (`src/app/complete-profile/page.tsx`)
- [x] Create login page (`src/app/login/page.tsx`)

## 5. Admin Dashboard Shell
- [x] Create admin layout (`src/app/(admin)/layout.tsx`)
- [x] Create dashboard page (`src/app/(admin)/dashboard/page.tsx`)
- [x] Create `AdminSidebar` component
- [x] Create `AdminHeader` component
- [x] Create `StatsCards` component

## 6. Verification
- [x] Test `npm run dev` starts without errors
- [x] Test `/api/health` endpoint
- [ ] Manual verification: Setup wizard, OAuth, profile flow (requires DATABASE_URL)
