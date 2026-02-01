# ATechAsync CMS

> **Non-blocking. Share while free.**

A serverless, WordPress-inspired CMS built on Next.js 15, optimized for Vercel's free tier.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Farinadi%2FAtechAsyncCMS&env=AUTH_SECRET,AUTH_GOOGLE_ID,AUTH_GOOGLE_SECRET&envDescription=Required%20environment%20variables%20for%20authentication&envLink=https%3A%2F%2Fgithub.com%2Farinadi%2FAtechAsyncCMS%23environment-variables&project-name=atechasync-cms&repository-name=atechasync-cms&stores=%5B%7B%22type%22%3A%22postgres%22%7D%2C%7B%22type%22%3A%22blob%22%7D%5D)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Database | Neon PostgreSQL (Serverless) |
| ORM | Drizzle ORM |
| Auth | Auth.js v5 (Google OAuth) |
| Storage | Vercel Blob |
| Styling | Tailwind CSS |
| Deployment | Vercel (Free Tier) |

## Quick Start

### Option 1: Deploy to Vercel (Recommended)

1. Click the **Deploy with Vercel** button above
2. Vercel will automatically provision:
   - **Neon PostgreSQL** database
   - **Vercel Blob** storage
3. Configure Google OAuth credentials (see below)
4. Deploy!

### Option 2: Local Development

```bash
# Clone and install
git clone https://github.com/arinadi/AtechAsyncCMS.git
cd AtechAsyncCMS
npm install

# Link to Vercel project and pull env vars
vercel link
vercel env pull .env.local

# Push database schema
npx drizzle-kit push

# Start development server
npm run dev
```

## Environment Variables

| Variable | Description | How to Get |
|----------|-------------|------------|
| `DATABASE_URL` | Neon connection string | Auto-provisioned by Vercel |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token | Auto-provisioned by Vercel |
| `AUTH_SECRET` | Random 32+ char string | `openssl rand -base64 32` |
| `AUTH_GOOGLE_ID` | Google OAuth client ID | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) |
| `AUTH_GOOGLE_SECRET` | Google OAuth secret | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) |

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new OAuth 2.0 Client ID
3. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://your-domain.vercel.app/api/auth/callback/google` (production)

## Features

- ✅ **Whitelist-based Auth** - Only invited users can login
- ✅ **Setup Wizard** - First-deploy admin configuration
- ✅ **Admin Dashboard** - Modern dark UI with stats
- ✅ **Role-based Access** - Admin & Author roles
- 🚧 **Classic Editor** - Tiptap-based (Phase 2)
- 🚧 **Public Blog** - ISR-powered (Phase 3)

### Security: Why Account Linking is Safe?

We enable `allowDangerousEmailAccountLinking: true` in Auth.js. **This is safe for ATechAsync CMS because:**

1. **Invite-only / Whitelisted**: Users cannot self-register freely.
2. **Admin-Controlled**: User records are created by trusted Admins (or Setup Wizard) first.
3. **Verified Origin**: Since the email record exists in the DB *before* login (created by Admin), we trust that the Google Account with the matching email belongs to the intended user.

## Project Structure

```
src/
├── app/
│   ├── (admin)/       # Protected admin routes
│   ├── (public)/      # Public facing pages
│   └── api/           # API routes
├── components/        # React components
├── db/               # Drizzle schema & connection
└── lib/              # Utilities & auth config
```

## Development Commands

```bash
npm run dev          # Start dev server
npm run build        # Push schema + production build
npm run db:push      # Push schema to database
npm run db:studio    # Open Drizzle Studio
npm run db:generate  # Generate migration files
```

> **Important:** Run `npm run db:push` **manually** before deploying if you have changed the database schema.
> `npm run build` no longer runs this automatically to prevent deployment hangs.

### Best Practice Workflow

1. **Local Machine**: Run `npm run db:push` in your local terminal.
   - This connects to Neon DB (Remote) and updates the schema safely.
2. **Git Push**: Once the DB is updated, commit and push your code.
   - `git add . && git commit -m "update feature" && git push`
3. **Vercel**: Vercel deploys the new code, which is now compatible with the updated DB schema.


## License

MIT
