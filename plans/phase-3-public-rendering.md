# Phase 3: Public Rendering (The Face)

> **Goal:** A live blog that updates instantly when "Publish" is clicked.

---

## 3.1 URL Routing Structure (SEO)

SEO-friendly URL patterns with clean, readable slugs.

### Public Routes

| Route | URL Pattern | Example | Purpose |
|-------|-------------|---------|---------|
| Home | `/` | `yoursite.com/` | Landing page with featured & recent posts |
| Blog Post | `/blog/[slug]` | `yoursite.com/blog/my-first-post` | Individual post detail |
| Search | `/search` | `yoursite.com/search?q=keyword` | Search results with pagination |
| Tag | `/tag/[tag]` | `yoursite.com/tag/javascript` | Posts filtered by tag (future) |
| Category | `/category/[cat]` | `yoursite.com/category/tutorial` | Posts filtered by category (future) |
| Author | `/author/[name]` | `yoursite.com/author/john` | Posts by author (future) |
| Static Pages | `/[slug]` | `yoursite.com/about` | About, Contact, etc. |

### Admin Routes

| Route | URL Pattern | Purpose |
|-------|-------------|---------|
| Dashboard | `/admin` | Admin overview |
| Posts List | `/admin/posts` | Manage all posts |
| Edit Post | `/admin/posts/[id]` | Edit specific post |
| New Post | `/admin/posts/new` | Create new post |
| Users | `/admin/users` | Manage users |
| Settings | `/admin/settings` | Site settings |

### URL Best Practices

- ✅ Use lowercase slugs with hyphens: `/blog/my-awesome-post`
- ✅ Keep URLs short and descriptive
- ✅ Auto-generate slug from title (editable)
- ✅ Redirect old URLs if slug changes (301 redirect)
- ❌ No query params for post URLs
- ❌ No special characters or spaces

### Slug Generation

```typescript
// src/lib/utils/slug.ts
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')  // Remove special chars
    .replace(/\s+/g, '-')       // Spaces to hyphens
    .replace(/-+/g, '-')        // Multiple hyphens to single
    .substring(0, 60);          // Max 60 chars
}
```

### Canonical URLs

Each page includes canonical URL to prevent duplicate content:

```typescript
// In generateMetadata()
return {
  alternates: {
    canonical: `https://yoursite.com/blog/${slug}`,
  },
};
```

---

## 3.2 Layout System Overview

Based on the **Registry Pattern**, layouts are determined by folder structure:

```
src/app/(public)/
├── page.tsx                    # Home Layout
├── search/
│   └── page.tsx               # Search/List Layout
├── blog/
│   └── [slug]/
│       └── page.tsx           # Detail Layout
└── layout.tsx                  # Shared public layout
```

---

## 3.3 Home Layout (`(public)/page.tsx`)

### Design Sections
1. **Hero Section**
   - Site title & tagline
   - Optional featured post highlight
   - CTA button

2. **Featured Posts Grid**
   - 3-column grid on desktop
   - Featured image thumbnails
   - Title, excerpt, date

3. **Recent Posts List**
   - Compact list view
   - 5-10 latest posts

### Tasks
- [ ] Create home page component
- [ ] Build `HeroSection` component
- [ ] Build `PostGrid` component
- [ ] Build `PostCard` component
- [ ] Implement ISR with revalidation:

```typescript
// src/app/(public)/page.tsx
export const revalidate = 3600; // Revalidate every hour

export default async function HomePage() {
  const featuredPosts = await getFeaturedPosts(6);
  const recentPosts = await getRecentPosts(10);
  
  return (
    <>
      <HeroSection />
      <PostGrid posts={featuredPosts} />
      <RecentPostsList posts={recentPosts} />
    </>
  );
}
```

---

## 3.4 Search/List Layout (`(public)/search/page.tsx`)

### Features
- [ ] Search input with URL params (`?q=keyword`)
- [ ] Filter by category/tag (future)
- [ ] Minimalist vertical archive style
- [ ] Pagination (10 posts per page)

### Tasks
- [ ] Create search page with query handling
- [ ] Build `SearchInput` component
- [ ] Build `PostListItem` component
- [ ] Implement server-side search:

```typescript
// src/app/(public)/search/page.tsx
type Props = {
  searchParams: { q?: string; page?: string };
};

export default async function SearchPage({ searchParams }: Props) {
  const query = searchParams.q || '';
  const page = parseInt(searchParams.page || '1');
  
  const { posts, total } = await searchPosts(query, page);
  
  return (
    <div>
      <SearchInput defaultValue={query} />
      <PostList posts={posts} />
      <Pagination current={page} total={total} />
    </div>
  );
}
```

---

## 3.5 Detail Layout (`(public)/blog/[slug]/page.tsx`)

### Design Elements
1. **Article Header**
   - Title (large, focused typography)
   - Author info & publish date
   - Featured image (full-width)

2. **Article Content**
   - Prose styling (max-width for readability)
   - Rich typography for JSON-to-HTML conversion
   - Image captions
   - Code syntax highlighting

3. **Article Footer**
   - Share buttons (optional)
   - Related posts
   - Navigation to previous/next post

### Tasks
- [ ] Create post detail page
- [ ] Build `ArticleHeader` component
- [ ] Build `ArticleContent` component with JSON renderer
- [ ] Build `RelatedPosts` component
- [ ] Implement static generation with fallback:

```typescript
// src/app/(public)/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await getAllPublishedSlugs();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props) {
  const post = await getPostBySlug(params.slug);
  return {
    title: post?.title,
    description: post?.excerpt,
    openGraph: { images: [post?.featuredImage] },
  };
}

export default async function PostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();
  
  return <Article post={post} />;
}
```

---

## 3.6 Tiptap JSON to HTML Renderer

### Tasks
- [ ] Create render function for Tiptap JSON:

```typescript
// src/lib/render-content.ts
import { generateHTML } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';

export function renderContent(content: JSONContent): string {
  return generateHTML(content, [StarterKit, Image, Link]);
}
```

- [ ] Style rendered HTML with Tailwind Typography:
```bash
npm install @tailwindcss/typography
```

```css
/* In tailwind.config */
plugins: [require('@tailwindcss/typography')]
```

---

## 3.7 ISR & On-Demand Revalidation

### Default ISR Strategy
| Route | Revalidation |
|-------|--------------|
| Home | 1 hour (`3600s`) |
| Search | No cache (dynamic) |
| Blog Post | On-demand only |

### On-Demand Revalidation Webhook
- [ ] Create revalidation API route:

```typescript
// src/app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request: Request) {
  const { secret, path, slug } = await request.json();
  
  if (secret !== process.env.REVALIDATION_SECRET) {
    return Response.json({ error: 'Invalid secret' }, { status: 401 });
  }
  
  // Revalidate specific paths
  revalidatePath('/'); // Home
  if (slug) revalidatePath(`/blog/${slug}`);
  
  return Response.json({ revalidated: true, now: Date.now() });
}
```

- [ ] Trigger revalidation from admin publish action:

```typescript
// In src/app/(admin)/posts/actions.ts
async function publishPost(id: string) {
  const post = await updatePost(id, { status: 'published', publishedAt: new Date() });
  
  // Trigger revalidation
  await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/revalidate`, {
    method: 'POST',
    body: JSON.stringify({ 
      secret: process.env.REVALIDATION_SECRET,
      slug: post.slug 
    }),
  });
}
```

---

## 3.8 Shared Public Layout

### Tasks
- [ ] Create public layout wrapper:
  - [ ] `PublicHeader` - Navigation, logo, search toggle
  - [ ] `PublicFooter` - Links, copyright
- [ ] Implement responsive navigation
- [ ] Dark mode toggle (optional)

---

## 3.9 SEO Meta Tags

### Tasks
- [ ] Implement metadata API for all pages
- [ ] Add Open Graph tags
- [ ] Add Twitter Card tags
- [ ] Create `robots.txt` and `sitemap.xml`:

```typescript
// src/app/sitemap.ts
export default async function sitemap() {
  const posts = await getAllPublishedPosts();
  
  return [
    { url: 'https://yoursite.com', lastModified: new Date() },
    ...posts.map(post => ({
      url: `https://yoursite.com/blog/${post.slug}`,
      lastModified: post.updatedAt,
    })),
  ];
}
```

---

## 3.10 Verification Checklist

- [ ] Home page displays hero and post grid
- [ ] Search works with query parameters
- [ ] Blog posts render correctly from JSON
- [ ] Featured images display properly
- [ ] ISR works (page updates after revalidation time)
- [ ] On-demand revalidation works when publishing
- [ ] Responsive design works on mobile
- [ ] SEO meta tags present on all pages
- [ ] Sitemap.xml generates correctly

---

## 3.11 AI-Driven Template Designer

> 📄 **Architecture:** See [core-architecture.md](./core-architecture.md#ai-driven-template-designer)

### Tasks
- [ ] Create designer directory structure:
  ```
  src/themes/designer/
  ├── DESIGNER.md
  ├── _input/
  └── _output/
  ```
- [ ] Create DESIGNER.md with:
  - [ ] AI prompt template for HTML → React conversion
  - [ ] Conversion rules (Tailwind, next/image, TypeScript)
  - [ ] Layout type specs with interfaces
  - [ ] Example input/output

### Workflow
1. Paste HTML + CSS + images into `_input/{layout-name}/`
2. Use prompt from DESIGNER.md to guide AI agent
3. AI generates React Server Component in `_output/`
4. Test component locally
5. Move to `src/components/public/` when ready

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/app/(public)/layout.tsx` | Public layout wrapper |
| `src/app/(public)/page.tsx` | Home page |
| `src/app/(public)/search/page.tsx` | Search/list page |
| `src/app/(public)/blog/[slug]/page.tsx` | Post detail page |
| `src/components/public/HeroSection.tsx` | Hero banner |
| `src/components/public/PostGrid.tsx` | Post grid layout |
| `src/components/public/PostCard.tsx` | Post card component |
| `src/components/public/PostList.tsx` | Vertical post list |
| `src/components/public/ArticleContent.tsx` | Content renderer |
| `src/components/public/PublicHeader.tsx` | Site header |
| `src/components/public/PublicFooter.tsx` | Site footer |
| `src/lib/render-content.ts` | JSON to HTML converter |
| `src/app/api/revalidate/route.ts` | Revalidation webhook |
| `src/app/sitemap.ts` | Dynamic sitemap |
| `src/themes/designer/DESIGNER.md` | AI template designer guide |

---

## Estimated Time: 12-16 hours
