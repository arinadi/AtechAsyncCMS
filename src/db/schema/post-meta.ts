import { pgTable, text, uuid, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { posts } from './posts';

// Key-value meta storage for plugins
export const postMeta = pgTable('post_meta', {
    id: uuid('id').primaryKey().defaultRandom(),
    postId: uuid('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
    key: text('key').notNull(),
    value: text('value'),
}, (table) => [
    uniqueIndex('post_meta_post_key_idx').on(table.postId, table.key),
    index('post_meta_key_idx').on(table.key),
]);

export const postMetaRelations = relations(postMeta, ({ one }) => ({
    post: one(posts, {
        fields: [postMeta.postId],
        references: [posts.id],
    }),
}));

export type PostMeta = typeof postMeta.$inferSelect;
export type NewPostMeta = typeof postMeta.$inferInsert;
