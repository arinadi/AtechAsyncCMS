# Phase 2: The Editing Engine

> **Goal:** Ability to create, edit, and save posts to Neon database.

---

## 2.1 Extended Database Schema

### Tasks
- [ ] Add posts-related tables to schema:

```typescript
// src/db/schema.ts (additions)
export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  content: jsonb('content'), // Tiptap JSON format
  excerpt: text('excerpt'),
  featuredImage: text('featured_image'),
  status: text('status').default('draft'), // 'draft' | 'published' | 'scheduled'
  authorId: uuid('author_id').references(() => users.id),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const postMeta = pgTable('post_meta', {
  id: uuid('id').primaryKey().defaultRandom(),
  postId: uuid('post_id').references(() => posts.id, { onDelete: 'cascade' }),
  key: text('key').notNull(),
  value: text('value'),
});

export const options = pgTable('options', {
  id: uuid('id').primaryKey().defaultRandom(),
  key: text('key').notNull().unique(),
  value: jsonb('value'),
});
```

- [ ] Run migration: `npx drizzle-kit push:pg`

---

## 2.2 Admin Posts Management

### Tasks
- [ ] Create posts list page (`src/app/(admin)/posts/page.tsx`)
  - [ ] DataTable with columns: Title, Status, Author, Date
  - [ ] Actions: Edit, Delete, View
  - [ ] Filters: Status, Date range
  - [ ] Pagination
- [ ] Create new post page (`src/app/(admin)/posts/new/page.tsx`)
- [ ] Create edit post page (`src/app/(admin)/posts/[id]/edit/page.tsx`)

### Components
```
src/components/admin/posts/
├── PostsTable.tsx      # Main data table
├── PostRow.tsx         # Individual row
├── PostActions.tsx     # Dropdown menu actions
└── PostFilters.tsx     # Filter controls
```

---

## 2.3 Tiptap Classic Editor

### Dependencies
```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link @tiptap/extension-placeholder @tiptap/extension-underline
```

### Tasks
- [ ] Create Editor component (`src/components/editor/TiptapEditor.tsx`)
- [ ] Build fixed toolbar (`src/components/editor/EditorToolbar.tsx`)
- [ ] Create Featured Image Picker (`src/components/editor/FeaturedImagePicker.tsx`)

> 📄 **See:** [core-architecture.md](./core-architecture.md#featured-image--thumbnail-picker) for UI specs

- [ ] Implement toolbar buttons:
  - [ ] **Text Formatting:** Bold, Italic, Underline, Strikethrough
  - [ ] **Headings:** H1, H2, H3, Paragraph
  - [ ] **Lists:** Bullet, Numbered
  - [ ] **Blocks:** Blockquote, Code Block, Horizontal Rule
  - [ ] **Media:** Image, Link
  - [ ] **Actions:** Undo, Redo

### Editor Configuration
```typescript
// src/components/editor/TiptapEditor.tsx
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';

const extensions = [
  StarterKit,
  Image.configure({ inline: true }),
  Link.configure({ openOnClick: false }),
  Placeholder.configure({ placeholder: 'Start writing...' }),
  Underline,
];
```

---

## 2.4 Hybrid Image Modal

### Tasks
- [ ] Create ImageModal component (`src/components/editor/ImageModal.tsx`)
- [ ] Implement two-tab interface:

#### Tab 1: Upload to Vercel Blob
```typescript
// src/app/api/upload/route.ts
import { put } from '@vercel/blob';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  
  const blob = await put(file.name, file, {
    access: 'public',
    addRandomSuffix: true,
  });
  
  return Response.json({ url: blob.url });
}
```

#### Tab 2: External URL Input
- [ ] URL input field with preview
- [ ] Support for GitHub Issues image URLs
- [ ] Support for Pexels images
- [ ] URL validation

### Modal UI
```
┌─────────────────────────────────────────┐
│ Insert Image                        [X] │
├─────────────────────────────────────────┤
│ [Upload] [External URL]                 │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐    │
│  │     Drop image here or click   │    │
│  │         to select file         │    │
│  └─────────────────────────────────┘    │
│                                         │
│  Alt text: [________________]           │
│                                         │
│              [Cancel] [Insert]          │
└─────────────────────────────────────────┘
```

---

## 2.5 Post API Routes

### Tasks
- [ ] Create Server Actions or API routes:

```typescript
// src/app/(admin)/posts/actions.ts
'use server';

export async function createPost(data: PostFormData) { ... }
export async function updatePost(id: string, data: PostFormData) { ... }
export async function deletePost(id: string) { ... }
export async function getPost(id: string) { ... }
export async function getPosts(filters?: PostFilters) { ... }
```

### Auto-save Feature
- [ ] Implement debounced auto-save (every 30 seconds or on significant changes)
- [ ] Show save status indicator (Saved, Saving..., Error)

---

## 2.6 Slug Generation

### Tasks
- [ ] Create slug utility (`src/lib/utils/slug.ts`)
  - [ ] Auto-generate from title
  - [ ] Handle duplicates with suffix
  - [ ] Transliterate non-ASCII characters

```typescript
// src/lib/utils/slug.ts
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function ensureUniqueSlug(slug: string, excludeId?: string): Promise<string> {
  // Check DB and append number if exists
}
```

---

## 2.7 Verification Checklist

- [ ] Posts table shows existing posts
- [ ] Can create new post with editor
- [ ] All toolbar buttons work correctly
- [ ] Image upload to Vercel Blob works
- [ ] External image URL insertion works
- [ ] Post saves as JSON in database
- [ ] Auto-save indicator shows status
- [ ] Can edit existing posts
- [ ] Can delete posts

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/app/(admin)/posts/page.tsx` | Posts list page |
| `src/app/(admin)/posts/new/page.tsx` | New post editor |
| `src/app/(admin)/posts/[id]/edit/page.tsx` | Edit post page |
| `src/app/(admin)/posts/actions.ts` | Server actions |
| `src/components/editor/TiptapEditor.tsx` | Main editor |
| `src/components/editor/EditorToolbar.tsx` | Fixed toolbar |
| `src/components/editor/FeaturedImagePicker.tsx` | Featured image selector |
| `src/components/editor/ImageModal.tsx` | Image picker modal |
| `src/components/admin/posts/PostsTable.tsx` | Posts data table |
| `src/app/api/upload/route.ts` | Blob upload endpoint |
| `src/lib/utils/slug.ts` | Slug utilities |

---

## Estimated Time: 8-12 hours
