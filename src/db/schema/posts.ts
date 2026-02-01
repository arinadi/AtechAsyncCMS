import { pgTable, text, timestamp, uuid, jsonb, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';

// Tiptap JSON types
export type TiptapNode = {
    type: string;
    attrs?: Record<string, unknown>;
    content?: TiptapNode[];
    marks?: { type: string; attrs?: Record<string, unknown> }[];
    text?: string;
};

export type TiptapJSON = {
    type: 'doc';
    content: TiptapNode[];
};

// Posts table with JSON content storage
export const posts = pgTable('posts', {
    id: uuid('id').primaryKey().defaultRandom(),

    // Content
    title: text('title').notNull(),
    slug: text('slug').notNull().unique(),
    content: jsonb('content').$type<TiptapJSON>(),
    excerpt: text('excerpt'),

    // Media
    featuredImage: text('featured_image'),

    // Status
    status: text('status', {
        enum: ['draft', 'published', 'scheduled', 'trash']
    }).default('draft').notNull(),

    // Relations
    authorId: uuid('author_id').notNull().references(() => users.id, { onDelete: 'set null' }),

    // Timestamps
    publishedAt: timestamp('published_at', { mode: 'date' }),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
}, (table) => [
    index('posts_slug_idx').on(table.slug),
    index('posts_status_idx').on(table.status),
    index('posts_author_idx').on(table.authorId),
    index('posts_published_at_idx').on(table.publishedAt),
]);

export const postsRelations = relations(posts, ({ one }) => ({
    author: one(users, {
        fields: [posts.authorId],
        references: [users.id],
    }),
}));

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
