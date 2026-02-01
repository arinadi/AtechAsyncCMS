# Phase 1: Infrastructure & Authentication Implementation

> **Goal:** A working site where an admin can log in and view a protected dashboard.

## Proposed Changes

### Project Initialization

#### [NEW] [package.json](file:///d:/AtechAsyncCMS/package.json)
Initialize Next.js 15 with App Router using:
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir
```

Dependencies to add:
- `@auth/core`, `@auth/drizzle-adapter` - Auth.js v5
- `drizzle-orm`, `@neondatabase/serverless` - Database
- `@vercel/blob` - Asset storage
- `drizzle-kit` (dev) - Migrations

#### [NEW] [vercel.json](file:///d:/AtechAsyncCMS/vercel.json)
Serverless configuration for Vercel with `sin1` region and 10s max duration.

#### [MODIFY] [next.config.js](file:///d:/AtechAsyncCMS/next.config.js)
Add serverless optimizations, external packages, and image remote patterns.

---

### Database Schema (Drizzle ORM)

#### [NEW] [src/db/index.ts](file:///d:/AtechAsyncCMS/src/db/index.ts)
Neon serverless connection with Drizzle ORM.

#### [NEW] [src/db/schema/users.ts](file:///d:/AtechAsyncCMS/src/db/schema/users.ts)
Users table with whitelist-based auth fields:
- `id`, `email`, `name`, `displayName`, `bio`, `image`
- `role` (admin/author), `status` (setup/invited/pending/active/suspended)
- `invitedBy`, `invitedAt`, `lastLoginAt`, timestamps

#### [NEW] [src/db/schema/auth.ts](file:///d:/AtechAsyncCMS/src/db/schema/auth.ts)
Auth.js required tables: `accounts`, `sessions`, `verificationTokens`.

#### [NEW] [src/db/schema/posts.ts](file:///d:/AtechAsyncCMS/src/db/schema/posts.ts)
Posts table with Tiptap JSON content storage.

#### [NEW] [src/db/schema/post-meta.ts](file:///d:/AtechAsyncCMS/src/db/schema/post-meta.ts)
Key-value meta storage for plugins (SEO, views, etc).

#### [NEW] [src/db/schema/options.ts](file:///d:/AtechAsyncCMS/src/db/schema/options.ts)
Global site configuration table.

#### [NEW] [drizzle.config.ts](file:///d:/AtechAsyncCMS/drizzle.config.ts)
Drizzle Kit configuration for migrations.

---

### Authentication (Auth.js v5)

#### [NEW] [src/lib/auth.ts](file:///d:/AtechAsyncCMS/src/lib/auth.ts)
Auth.js configuration with:
- Google OAuth provider
- Drizzle adapter
- Whitelist validation (only registered emails can login)
- Session callbacks for role/status injection

#### [NEW] [src/app/api/auth/[...nextauth]/route.ts](file:///d:/AtechAsyncCMS/src/app/api/auth/%5B...nextauth%5D/route.ts)
Auth.js API route handler.

#### [NEW] [src/middleware.ts](file:///d:/AtechAsyncCMS/src/middleware.ts)
Route protection:
- `/admin/*` requires active auth
- Redirect to complete-profile if status is pending

#### [NEW] [src/app/api/health/route.ts](file:///d:/AtechAsyncCMS/src/app/api/health/route.ts)
Health check endpoint for database connectivity.

---

### Setup Wizard & Profile

#### [NEW] [src/app/setup/page.tsx](file:///d:/AtechAsyncCMS/src/app/setup/page.tsx)
First-deploy setup wizard:
- Detect if no users in DB
- Admin fills email, name, site title
- Creates first admin user

#### [NEW] [src/app/complete-profile/page.tsx](file:///d:/AtechAsyncCMS/src/app/complete-profile/page.tsx)
Profile completion for new users (status: pending).

#### [NEW] [src/app/login/page.tsx](file:///d:/AtechAsyncCMS/src/app/login/page.tsx)
Login page with Google OAuth button.

---

### Admin Dashboard

#### [NEW] [src/app/(admin)/layout.tsx](file:///d:/AtechAsyncCMS/src/app/(admin)/layout.tsx)
Admin layout with sidebar and header.

#### [NEW] [src/app/(admin)/dashboard/page.tsx](file:///d:/AtechAsyncCMS/src/app/(admin)/dashboard/page.tsx)
Dashboard page with stats cards.

#### [NEW] [src/components/admin/AdminSidebar.tsx](file:///d:/AtechAsyncCMS/src/components/admin/AdminSidebar.tsx)
Navigation sidebar component.

#### [NEW] [src/components/admin/AdminHeader.tsx](file:///d:/AtechAsyncCMS/src/components/admin/AdminHeader.tsx)
Header with user info and logout.

#### [NEW] [src/components/admin/StatsCards.tsx](file:///d:/AtechAsyncCMS/src/components/admin/StatsCards.tsx)
Placeholder statistics cards.

---

## Verification Plan

### Automated Tests
```bash
# Build verification (no errors)
npm run build

# Type checking
npx tsc --noEmit

# Lint checking
npm run lint
```

### Manual Verification

**1. Development Server**
- Run `npm run dev`
- Verify no console errors

**2. Health Check Endpoint**
- Navigate to `http://localhost:3000/api/health`
- Should return `{"status": "healthy", ...}` (after DB is configured)

**3. Setup Wizard Flow**
- Fresh database (no users)
- Navigate to `/setup`
- Fill admin details → should create user

**4. Google OAuth Flow**
- Navigate to `/login`
- Click "Login with Google"
- Whitelisted email → should succeed
- Non-whitelisted email → should be denied

**5. Complete Profile Flow**
- New user (status: pending) → should redirect to `/complete-profile`
- Fill mandatory fields → status becomes active
- Redirect to `/admin/dashboard`

**6. Protected Routes**
- Unauthenticated access to `/admin/dashboard` → redirect to `/login`
- Authenticated + active → can access dashboard

> [!IMPORTANT]
> Full OAuth testing requires:
> - Valid Google OAuth credentials in `.env.local`
> - Neon database with connection string
> - Running `npx drizzle-kit push:pg` to create tables
