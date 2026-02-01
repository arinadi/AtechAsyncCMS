# Phase 1: Infrastructure & Authentication

> **Goal:** A working site where an admin can log in and view a protected dashboard.

---

## 1.1 Project Initialization

### Tasks
- [ ] Initialize Next.js 15 with App Router
  ```bash
  npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir
  ```
- [ ] Configure `next.config.js` for Vercel deployment
- [ ] Setup folder structure:
  ```
  src/
  ├── app/
  │   ├── (admin)/          # Protected admin routes
  │   ├── (public)/         # Public facing pages
  │   └── api/              # API routes
  ├── components/
  ├── lib/
  └── db/
  ```

### Dependencies
```json
{
  "dependencies": {
    "next": "^15.x",
    "@auth/core": "latest",
    "@auth/drizzle-adapter": "latest",
    "drizzle-orm": "latest",
    "@neondatabase/serverless": "latest",
    "@vercel/blob": "latest"
  },
  "devDependencies": {
    "drizzle-kit": "latest"
  }
}
```

---

## 1.2 Vercel Serverless Configuration

### vercel.json

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "regions": ["sin1"],
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 10
    }
  },
  "crons": []
}
```

**Configuration Notes:**
| Setting | Value | Reason |
|---------|-------|--------|
| `regions` | `sin1` (Singapore) | Closest to Neon database region |
| `maxDuration` | 10s | Free tier limit, sufficient for DB queries |

### Environment Variables (Vercel Dashboard)

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `DATABASE_URL` | Neon connection string | [console.neon.tech](https://console.neon.tech) |
| `AUTH_SECRET` | Random 32+ char string | `openssl rand -base64 32` |
| `AUTH_GOOGLE_ID` | Google OAuth client ID | [Google Cloud Console](https://console.cloud.google.com) |
| `AUTH_GOOGLE_SECRET` | Google OAuth secret | [Google Cloud Console](https://console.cloud.google.com) |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token | Vercel Dashboard → Storage |
| `REVALIDATION_SECRET` | Secret for cache revalidation | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Production URL | `https://your-domain.vercel.app` |

### API Folder Structure (Serverless Functions)

```
src/app/api/
├── auth/
│   └── [...nextauth]/
│       └── route.ts          # Auth.js handler
├── upload/
│   └── route.ts              # Vercel Blob upload
├── revalidate/
│   └── route.ts              # On-demand ISR
├── posts/
│   └── route.ts              # Posts CRUD (if needed)
└── health/
    └── route.ts              # Health check endpoint
```

### Health Check Endpoint

```typescript
// src/app/api/health/route.ts
import { db } from '@/db';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    // Check database connectivity
    await db.execute(sql`SELECT 1`);
    
    return Response.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
    });
  } catch (error) {
    return Response.json({
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
```

### next.config.js (Serverless Optimizations)

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for better serverless performance
  experimental: {
    serverComponentsExternalPackages: ['@neondatabase/serverless'],
  },
  
  // Image domains for external images
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
      { protocol: 'https', hostname: 'user-images.githubusercontent.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' }, // Google avatars
    ],
  },
  
  // Reduce cold start time
  poweredByHeader: false,
};

module.exports = nextConfig;
```

---

## 1.3 Database Configuration (Neon + Drizzle)

### Tasks
- [ ] Create Neon project at [console.neon.tech](https://console.neon.tech)
- [ ] Configure connection string in `.env.local`:
  ```env
  DATABASE_URL=postgres://...@....neon.tech/neondb?sslmode=require
  ```
- [ ] Setup Drizzle config (`drizzle.config.ts`)
- [ ] Create initial schema (`src/db/schema.ts`):

#### Schema Definition

> 📄 **Full Schema:** See [database-schema.md](./database-schema.md) | **Auth Flow:** See [auth-flow.md](./auth-flow.md)

```typescript
// src/db/schema.ts
import { pgTable, text, timestamp, uuid, integer } from 'drizzle-orm/pg-core';

// Users table with whitelist-based auth
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name'),
  displayName: text('display_name'),
  bio: text('bio'),
  image: text('image'),
  role: text('role', { enum: ['admin', 'author'] }).default('author'),
  status: text('status', { 
    enum: ['setup', 'invited', 'pending', 'active', 'suspended'] 
  }).default('invited'),
  invitedBy: uuid('invited_by').references(() => users.id),
  invitedAt: timestamp('invited_at'),
  lastLoginAt: timestamp('last_login_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const accounts = pgTable('accounts', {
  // Auth.js required fields
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('provider_account_id').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
});

export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionToken: text('session_token').notNull().unique(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires').notNull(),
});
```

- [ ] Run migration: `npx drizzle-kit push:pg`

---

## 1.4 Authentication Setup (Auth.js v5 + Google OAuth)

### Tasks
- [ ] Create Google OAuth credentials at [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
- [ ] Configure environment variables:
  ```env
  AUTH_SECRET=<generate-with-openssl>
  AUTH_GOOGLE_ID=<your-client-id>
  AUTH_GOOGLE_SECRET=<your-client-secret>
  ```
- [ ] Setup Auth.js configuration with **whitelist validation** (`src/lib/auth.ts`):

```typescript
// src/lib/auth.ts
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [Google],
  callbacks: {
    // Whitelist validation - only registered emails can login
    async signIn({ user }) {
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, user.email!),
      });
      
      // Deny if not in whitelist or suspended
      if (!existingUser || existingUser.status === 'suspended') {
        return false;
      }
      
      // Update status on first login
      if (existingUser.status === 'invited') {
        await db.update(users)
          .set({ status: 'pending', lastLoginAt: new Date() })
          .where(eq(users.id, existingUser.id));
      } else {
        await db.update(users)
          .set({ lastLoginAt: new Date() })
          .where(eq(users.id, existingUser.id));
      }
      
      return true;
    },
    
    // Inject role and status into session
    session({ session, user }) {
      session.user.role = user.role;
      session.user.status = user.status;
      return session;
    },
  },
});
```

- [ ] Create API route handler (`src/app/api/auth/[...nextauth]/route.ts`)
- [ ] Create middleware for protected routes (`src/middleware.ts`)

---

## 1.5 Setup Wizard & Complete Profile

### Setup Wizard (First Deploy)
- [ ] Create setup page (`src/app/setup/page.tsx`):
  - Detect if no users in DB → show setup form
  - Admin fills: Email, Name, Display Name, Site Title
  - Creates first user with `role: admin`, `status: setup`
  - Redirects to Google OAuth login

### Complete Profile (First Login)
- [ ] Create complete profile page (`src/app/complete-profile/page.tsx`):
  - For users with `status === 'pending'`
  - Mandatory fields: `name`, `displayName`
  - On submit → update `status: active`
  - Redirect to `/admin/dashboard`

---

## 1.6 Admin Dashboard Shell

### Tasks
- [ ] Create admin layout (`src/app/(admin)/layout.tsx`)
- [ ] Build dashboard page (`src/app/(admin)/dashboard/page.tsx`)
- [ ] Create components:
  - [ ] `AdminSidebar` - Navigation menu
  - [ ] `AdminHeader` - User info & logout
  - [ ] `StatsCards` - Placeholder stats

### Protected Route Middleware
```typescript
// src/middleware.ts
import { auth } from '@/lib/auth';

export default auth((req) => {
  const isAdmin = req.nextUrl.pathname.startsWith('/admin');
  if (isAdmin && !req.auth) {
    return Response.redirect(new URL('/login', req.nextUrl));
  }
});

export const config = {
  matcher: ['/admin/:path*'],
};
```

---

## 1.7 Verification Checklist

- [ ] `npm run dev` starts without errors
- [ ] `vercel.json` configured correctly
- [ ] Database tables created in Neon
- [ ] `/api/health` endpoint returns healthy
- [ ] Setup wizard works (first deploy)
- [ ] Google OAuth login works (only whitelisted emails)
- [ ] Complete profile flow works for new users
- [ ] `/admin/dashboard` is protected (redirects to login if unauthenticated)
- [ ] `/admin/dashboard` redirects to `/complete-profile` if `status === 'pending'`
- [ ] User session persists and shows role/status in dashboard header

---

## Files to Create

| File | Purpose |
|------|---------|
| `vercel.json` | Vercel serverless config |
| `next.config.js` | Next.js config |
| `src/db/index.ts` | Database connection |
| `src/db/schema.ts` | Drizzle schema definitions |
| `src/lib/auth.ts` | Auth.js configuration |
| `src/app/api/auth/[...nextauth]/route.ts` | Auth API handler |
| `src/app/api/health/route.ts` | Health check endpoint |
| `src/middleware.ts` | Route protection |
| `src/app/setup/page.tsx` | Setup wizard |
| `src/app/complete-profile/page.tsx` | Complete profile form |
| `src/app/(admin)/layout.tsx` | Admin layout wrapper |
| `src/app/(admin)/dashboard/page.tsx` | Dashboard page |
| `src/components/admin/AdminSidebar.tsx` | Sidebar navigation |
| `src/components/admin/AdminHeader.tsx` | Header with user info |

---

## Estimated Time: 6-8 hours
