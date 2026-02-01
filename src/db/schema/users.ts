import { pgTable, text, timestamp, uuid, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table with whitelist-based auth
export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull().unique(),
    emailVerified: timestamp('email_verified', { mode: 'date' }), // Required by Auth.js
    name: text('name'),
    displayName: text('display_name'),
    bio: text('bio'),
    image: text('image'),
    role: text('role', { enum: ['admin', 'author'] }).default('author').notNull(),
    status: text('status', {
        enum: ['setup', 'invited', 'pending', 'active', 'suspended']
    }).default('invited').notNull(),
    invitedBy: uuid('invited_by'),
    invitedAt: timestamp('invited_at', { mode: 'date' }),
    lastLoginAt: timestamp('last_login_at', { mode: 'date' }),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
}, (table) => [
    uniqueIndex('users_email_idx').on(table.email),
    index('users_status_idx').on(table.status),
]);

// Self-referencing relation for invitedBy
export const usersRelations = relations(users, ({ one, many }) => ({
    inviter: one(users, {
        fields: [users.invitedBy],
        references: [users.id],
    }),
    invitedUsers: many(users),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
