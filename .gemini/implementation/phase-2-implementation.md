# Phase 2: The Editing Engine Implementation Plan

## Goal Description
Implement the core content management capabilities: expanding the database schema, creating the admin interface for posts, and integrating the Tiptap rich text editor with image handling.

## Proposed Changes

### Database Layer
#### [MODIFY] [schema.ts](file:///d:/AtechAsyncCMS/src/db/schema.ts)
- Add `posts`, `post_meta`, and `options` tables.
- Define relationships (users <-> posts).

### Dependencies
- Install `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-image`, `@tiptap/extension-link`, `@tiptap/extension-placeholder`, `@tiptap/extension-underline`, `@vercel/blob`, `lucide-react`.

### Utilities
#### [NEW] [slug.ts](file:///d:/AtechAsyncCMS/src/lib/utils/slug.ts)
- `generateSlug(title)`
- `ensureUniqueSlug(slug)`

### API & Server Actions
#### [NEW] [actions.ts](file:///d:/AtechAsyncCMS/src/app/admin/posts/actions.ts)
- `createPost`, `updatePost`, `deletePost`, `getPost`, `getPosts`.
#### [NEW] [route.ts](file:///d:/AtechAsyncCMS/src/app/api/upload/route.ts)
- POST handler for Vercel Blob uploads.

### Components
#### [NEW] `src/components/admin/posts/*`
- `PostsTable.tsx`: DataTable for listing posts.
- `PostActions.tsx`: Dropdown for Edit/Delete.
#### [NEW] `src/components/editor/*`
- `TiptapEditor.tsx`: Main editor wrapper.
- `EditorToolbar.tsx`: Fixed toolbar.
- `ImageModal.tsx`: Upload/Link handling.
- `FeaturedImagePicker.tsx`: Cover image selector.

### Pages
#### [NEW] `src/app/admin/posts/page.tsx` (List)
#### [NEW] `src/app/admin/posts/new/page.tsx` (Create)
#### [NEW] `src/app/admin/posts/[id]/edit/page.tsx` (Edit)

## Verification Plan

### Automated Tests
- None planned for this phase.

### Manual Verification
1. **Schema**: Run `npm run db:push` and check Neon dashboard or Studio.
2. **Editor**: Open `/admin/posts/new`, type content, format text.
3. **Images**: Upload an image to Vercel Blob, insert an external URL. Key check: Image appears in editor.
4. **Persistence**: Save post, reload page, verify content matches.
5. **Listing**: Check `/admin/posts` shows the new post.
