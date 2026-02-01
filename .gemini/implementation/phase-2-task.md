# Phase 2: The Editing Engine

- [x] **2.1 Extended Database Schema** ✅ Already implemented
  - [x] `src/db/schema/posts.ts` - Posts table with Tiptap JSON content
  - [x] `src/db/schema/post-meta.ts` - Key-value meta storage
  - [x] `src/db/schema/options.ts` - Global site settings

- [x] **2.2 Shared Utilities**
  - [x] Create `src/lib/utils/slug.ts` for slug generation

- [x] **2.3 Admin Posts Management (UI)**
  - [x] Create `src/app/admin/posts/page.tsx` (List View)
  - [x] Create `src/app/admin/posts/new/page.tsx` (Create View)
  - [x] Create `src/app/admin/posts/[id]/edit/page.tsx` (Edit View)
  - [x] Create `src/components/admin/posts/PostsTable.tsx`

- [x] **2.4 Tiptap Editor Implementation**
  - [x] Install Tiptap dependencies
  - [x] Create `src/components/editor/TiptapEditor.tsx`
  - [x] Create `src/components/editor/EditorToolbar.tsx`
  - [x] Create `src/components/editor/FeaturedImagePicker.tsx`

- [x] **2.5 Hybrid Image Modal**
  - [x] Create `src/components/editor/ImageModal.tsx`
  - [x] Implement `src/app/api/upload/route.ts` (Vercel Blob)
  - [x] Implement External URL Tab

- [x] **2.6 Post Logic & Server Actions**
  - [x] Create `src/app/admin/posts/actions.ts` (Create, Update, Delete, Get)
  - [x] Implement Auto-save hook/logic

- [x] **2.7 Verification**
  - [x] Build passes without errors
  - [x] All routes registered correctly
