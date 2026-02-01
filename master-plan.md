## 1. Project Overview

* **Name:** ATechAsync Engine
* **Tagline:** "Non-blocking. Share while free."
* **Concept:** A serverless, WordPress-inspired CMS optimized for Vercel’s free tier. It balances developer control with the familiar administrative experience of traditional CMS platforms.

## 2. Technical Stack

| Layer | Technology | Strategy |
| --- | --- | --- |
| **Framework** | **Next.js 15 (App Router)** | Primary use of **ISR** (Incremental Static Regeneration). |
| **Deployment** | **Vercel (Free Tier)** | Serverless functions with region `sin1` (Singapore). |
| **Database** | **Neon (PostgreSQL)** | Serverless Postgres with *Scale-to-Zero* to save compute hours. |
| **ORM** | **Drizzle ORM** | Type-safe, lightweight, and extremely fast for serverless cold starts. |
| **Auth** | **Auth.js v5 (NextAuth)** | Google OAuth with Drizzle Adapter for seamless user management. |
| **Image Hosting** | **Hybrid (Vercel Blob + External)** | **Vercel Blob:** Favicons, logos, and UI assets (limit 250MB).<br>

**External URLs:** Content images via **GitHub Issues** (memes/screenshots) or **Pexels** (stock). |
| **Styling** | **Tailwind CSS + shadcn/ui** | Highly cacheable, utility-first UI delivered via Vercel Edge. |

### Serverless Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                      VERCEL EDGE                             │
├──────────────────────────────────────────────────────────────┤
│  Static Assets (HTML, CSS, JS) ──► Vercel CDN (Global)       │
│  ISR Pages ──► Edge Cache + On-Demand Revalidation           │
├──────────────────────────────────────────────────────────────┤
│                  SERVERLESS FUNCTIONS                        │
├──────────────────────────────────────────────────────────────┤
│  /api/auth/*     ──► Auth.js (Google OAuth)                  │
│  /api/upload     ──► Vercel Blob Storage                     │
│  /api/revalidate ──► On-Demand ISR Trigger                   │
│  /api/health     ──► DB Connectivity Check                   │
├──────────────────────────────────────────────────────────────┤
│                    NEON DATABASE                             │
├──────────────────────────────────────────────────────────────┤
│  PostgreSQL (Serverless) ──► Scale-to-Zero                   │
│  Region: Singapore (sin1) ──► Low latency to Vercel          │
└──────────────────────────────────────────────────────────────┘
```

**Free Tier Limits:**
| Resource | Limit | Strategy |
|----------|-------|----------|
| Serverless Functions | 100GB-hrs/month | Short functions (10s max) |
| Bandwidth | 100GB/month | ISR caching, external images |
| Vercel Blob | 250MB | UI assets only |
| Neon Compute | 191.9 hrs/month | Scale-to-zero |

---

## 3. Core Architecture
📄 **Detail Plan:** [core-architecture.md](./plans/core-architecture.md)

### A. The Classic Editor (Admin)

* **Engine:** **Tiptap (Free Edition)**.
* **UI Interface:** A "fixed toolbar" approach (Classic WP style). No floating menus; buttons for Bold, Italic, Headings, and Media are anchored at the top.
* **Image Handling:** A custom modal with two tabs:
1. **Upload:** Directly to Vercel Blob.
2. **External:** Input field for GitHub/Pexels URLs.


* **Storage Format:** Posts are saved as **JSON** in the database for flexibility and security.

### B. Theme & Layout System (Public)

The system uses a **Registry Pattern** where layouts are determined by the folder structure rather than complex database configurations:

* **Home Layout:** `(public)/page.tsx` — Custom landing with hero sections and post grids.
* **Search/List Layout:** `(public)/search/page.tsx` — Minimalist vertical archive for browsing.
* **Detail Layout:** `(public)/blog/[slug]/page.tsx` — Focused typography for the reading experience.

### C. Plugin System (Hybrid)

* **Must-Use (MU) Plugins:** Hardcoded modules (e.g., SEO Metadata, Security headers, Analytics) that are injected into every page during build time.
* **Optional Plugins:** Toggleable features (e.g., Newsletters, Social Share) managed via an `options` table in the DB.

---

## 4. Authentication & User Flow
📄 **Detail Plan:** [auth-flow.md](./plans/auth-flow.md)

Whitelist-based authentication where only pre-registered emails can login:
* **Setup Wizard**: First admin registers during initial deployment.
* **Invite System**: Admin adds users by email, users login via Google OAuth.
* **Profile Completion**: New users must complete mandatory fields after first login.
* **User Status**: `setup` → `invited` → `pending` → `active` (or `suspended`).

---

## 5. Database Schema Preview
📄 **Detail Plan:** [database-schema.md](./plans/database-schema.md)

* **`users`**: Auth data & roles (Admin/Author).
* **`posts`**: Title, JSON content, slug, status, and featured image URL.
* **`post_meta`**: Key-value pairs for plugin data (SEO tags, view counts).
* **`options`**: Global site settings (Active theme, enabled plugins).

---

## 6. Execution Phases

### Phase 1: Infrastructure & Authentication
📄 **Detail Plan:** [phase-1-infrastructure-auth.md](./plans/phase-1-infrastructure-auth.md)

* Initialize Next.js 15 project.
* Configure Neon Database and Drizzle ORM.
* Setup Google OAuth via Auth.js.
* **Goal:** A working site where an admin can log in and view a protected dashboard.

### Phase 2: The Editing Engine
📄 **Detail Plan:** [phase-2-editing-engine.md](./plans/phase-2-editing-engine.md)

* Build the Admin Dashboard table.
* Implement the **Classic Editor** using Tiptap.
* Create the **Hybrid Image Modal** (Upload to Blob vs. Paste URL).
* **Goal:** Ability to create, edit, and save posts to Neon.

### Phase 3: Public Rendering (The Face)
📄 **Detail Plan:** [phase-3-public-rendering.md](./plans/phase-3-public-rendering.md)

* Design and code the three primary layouts (Home, List, Detail).
* Implement **ISR** to ensure the public site remains fast and cached.
* Setup **On-demand Revalidation** via a Webhook triggered by the Admin panel.
* **Goal:** A live blog that updates instantly when "Publish" is clicked.

### Phase 4: Plugin Integration & SEO
📄 **Detail Plan:** [phase-4-plugins-seo.md](./plans/phase-4-plugins-seo.md)

* Inject the "Must-Use" SEO plugin.
* Optimize asset delivery (fonts, icons) via CDN.
* Final deployment and performance auditing.

---

## 7. Success Metrics

* **Cost:** $0/month (staying within free tiers).
* **Performance:** 95+ Lighthouse score.
* **User Experience:** "One-click" feel for post updates and image insertion.

---