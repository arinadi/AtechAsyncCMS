# Phase 4: Plugin Integration & SEO

> **Goal:** Production-ready CMS with SEO optimization and extensible plugin system.

---

## 4.1 Must-Use (MU) Plugin System

MU Plugins are hardcoded modules injected at build time. They cannot be disabled.

### Architecture
```
src/plugins/
├── mu/                      # Must-Use (always active)
│   ├── seo-metadata.ts
│   ├── security-headers.ts
│   └── analytics.ts
├── optional/                # Toggleable via options table
│   ├── newsletter.ts
│   └── social-share.ts
└── registry.ts              # Plugin loader
```

### Plugin Interface
```typescript
// src/plugins/types.ts
export interface MUPlugin {
  name: string;
  description: string;
  priority: number; // Lower = runs first
  onBuild?: () => void;
  onRequest?: (req: Request) => void;
  injectHead?: () => React.ReactNode;
  injectBody?: () => React.ReactNode;
}
```

---

## 4.2 SEO Metadata Plugin (MU)

### Tasks
- [ ] Create SEO plugin (`src/plugins/mu/seo-metadata.ts`)
- [ ] Implement metadata generation:

```typescript
// src/plugins/mu/seo-metadata.ts
export const seoMetadataPlugin: MUPlugin = {
  name: 'SEO Metadata',
  description: 'Generates meta tags for all pages',
  priority: 1,
  
  generateMetadata(page: PageData): Metadata {
    return {
      title: page.title,
      description: page.excerpt,
      keywords: page.tags?.join(', '),
      openGraph: {
        title: page.title,
        description: page.excerpt,
        images: [{ url: page.featuredImage }],
        type: 'article',
        publishedTime: page.publishedAt,
        authors: [page.author.name],
      },
      twitter: {
        card: 'summary_large_image',
        title: page.title,
        description: page.excerpt,
        images: [page.featuredImage],
      },
      alternates: {
        canonical: `https://yoursite.com/blog/${page.slug}`,
      },
    };
  },
};
```

- [ ] Generate JSON-LD structured data:

```typescript
export function generateArticleSchema(post: Post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    image: post.featuredImage,
    author: {
      '@type': 'Person',
      name: post.author.name,
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
  };
}
```

---

## 4.3 Security Headers Plugin (MU)

### Tasks
- [ ] Create security plugin (`src/plugins/mu/security-headers.ts`)
- [ ] Implement via `next.config.js` or middleware:

```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
];

module.exports = {
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};
```

---

## 4.4 Analytics Plugin (MU)

### Tasks
- [ ] Create analytics plugin (`src/plugins/mu/analytics.ts`)
- [ ] Support multiple providers:
  - [ ] Vercel Analytics (built-in)
  - [ ] Google Analytics 4 (optional)
  - [ ] Plausible (optional)

```typescript
// src/plugins/mu/analytics.ts
import { Analytics } from '@vercel/analytics/react';

export const analyticsPlugin: MUPlugin = {
  name: 'Analytics',
  description: 'Track page views and events',
  priority: 100,
  
  injectBody() {
    return <Analytics />;
  },
};
```

### View Count Tracking
- [ ] Increment view count in `postMeta` table:

```typescript
// src/app/(public)/blog/[slug]/page.tsx
async function incrementViewCount(postId: string) {
  await db.insert(postMeta)
    .values({ postId, key: 'views', value: '1' })
    .onConflictDoUpdate({
      target: [postMeta.postId, postMeta.key],
      set: { value: sql`CAST(${postMeta.value} AS INTEGER) + 1` },
    });
}
```

---

## 4.5 Optional Plugin System

### Tasks
- [ ] Create plugin registry (`src/plugins/registry.ts`)
- [ ] Implement plugin toggle via options table:

```typescript
// src/plugins/registry.ts
export async function getEnabledPlugins(): Promise<OptionalPlugin[]> {
  const options = await db.query.options.findFirst({
    where: eq(options.key, 'enabled_plugins'),
  });
  
  const enabledIds = options?.value || [];
  return OPTIONAL_PLUGINS.filter(p => enabledIds.includes(p.id));
}
```

- [ ] Create admin UI for plugin management (`src/app/(admin)/plugins/page.tsx`)

---

## 4.6 Social Share Plugin (Optional)

### Tasks
- [ ] Create social share component:

```typescript
// src/plugins/optional/social-share.tsx
const SHARE_PLATFORMS = [
  { name: 'Twitter', icon: TwitterIcon, getUrl: (url, title) => 
    `https://twitter.com/intent/tweet?url=${url}&text=${title}` },
  { name: 'Facebook', icon: FacebookIcon, getUrl: (url) => 
    `https://www.facebook.com/sharer/sharer.php?u=${url}` },
  { name: 'LinkedIn', icon: LinkedInIcon, getUrl: (url, title) => 
    `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}` },
  { name: 'WhatsApp', icon: WhatsAppIcon, getUrl: (url, title) => 
    `https://wa.me/?text=${title}%20${url}` },
];
```

---

## 4.7 Asset Optimization

### Font Optimization
- [ ] Use `next/font` for optimal loading:

```typescript
// src/app/layout.tsx
import { Inter, Merriweather } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const merriweather = Merriweather({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-merriweather',
});
```

### Image Optimization
- [ ] Configure `next/image` for external domains:

```typescript
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
      { protocol: 'https', hostname: 'user-images.githubusercontent.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
    ],
  },
};
```

### Icon Optimization
- [ ] Use Lucide React for icons (tree-shakeable):

```bash
npm install lucide-react
```

---

## 4.8 Performance Auditing

### Tasks
- [ ] Run Lighthouse audit
- [ ] Target scores:
  - Performance: 95+
  - Accessibility: 100
  - Best Practices: 100
  - SEO: 100
- [ ] Implement fixes for any issues found

### Optimization Checklist
- [ ] All images use `next/image`
- [ ] Fonts are self-hosted via `next/font`
- [ ] CSS is minimal (Tailwind purges unused)
- [ ] JavaScript bundles are code-split
- [ ] No render-blocking resources
- [ ] Core Web Vitals pass (LCP < 2.5s, FID < 100ms, CLS < 0.1)

---

## 4.9 Final Deployment

### Tasks
- [ ] Configure production environment variables on Vercel
- [ ] Enable Vercel Edge Config (optional)
- [ ] Setup custom domain
- [ ] Configure preview deployments
- [ ] Test production build locally: `npm run build && npm start`

### Environment Variables Checklist
```env
# Database
DATABASE_URL=

# Auth
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=

# Blob Storage
BLOB_READ_WRITE_TOKEN=

# Revalidation
REVALIDATION_SECRET=

# Analytics (optional)
NEXT_PUBLIC_GA_ID=
```

---

## 4.10 Verification Checklist

- [ ] SEO meta tags on all pages (check with meta tag analyzer)
- [ ] JSON-LD structured data present
- [ ] Security headers set (check with securityheaders.com)
- [ ] Analytics tracking works
- [ ] Social share buttons work (optional plugin)
- [ ] Lighthouse scores meet targets
- [ ] No console errors in production
- [ ] Images load correctly from all sources
- [ ] Fonts load without FOUT/FOIT
- [ ] Site works on Vercel production URL

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/plugins/types.ts` | Plugin type definitions |
| `src/plugins/registry.ts` | Plugin loader |
| `src/plugins/mu/seo-metadata.ts` | SEO plugin |
| `src/plugins/mu/security-headers.ts` | Security plugin |
| `src/plugins/mu/analytics.ts` | Analytics plugin |
| `src/plugins/optional/social-share.tsx` | Social share plugin |
| `src/plugins/optional/newsletter.tsx` | Newsletter plugin |
| `src/app/(admin)/plugins/page.tsx` | Plugin management UI |

---

## Estimated Time: 6-8 hours

---

## Success Metrics Summary

| Metric | Target | Verification |
|--------|--------|--------------|
| Monthly Cost | $0 | Vercel dashboard |
| Lighthouse Performance | 95+ | Lighthouse audit |
| Lighthouse SEO | 100 | Lighthouse audit |
| Core Web Vitals | Pass | Google Search Console |
| Time to First Byte | < 200ms | WebPageTest |
| First Contentful Paint | < 1.8s | Lighthouse |
