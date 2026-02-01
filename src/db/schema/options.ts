import { pgTable, text, uuid, jsonb, uniqueIndex } from 'drizzle-orm/pg-core';

// Global site configuration
export const options = pgTable('options', {
    id: uuid('id').primaryKey().defaultRandom(),
    key: text('key').notNull(),
    value: jsonb('value'),
}, (table) => [
    uniqueIndex('options_key_idx').on(table.key),
]);

export type Option = typeof options.$inferSelect;
export type NewOption = typeof options.$inferInsert;

// Default options for initial setup
export const DEFAULT_OPTIONS = [
    { key: 'site_title', value: 'ATechAsync Blog' },
    { key: 'site_description', value: 'Non-blocking. Share while free.' },
    { key: 'site_logo', value: null },
    { key: 'site_favicon', value: null },
    { key: 'posts_per_page', value: 10 },
    { key: 'enabled_plugins', value: ['social-share'] },
    { key: 'theme_settings', value: { primaryColor: '#3b82f6', darkMode: true } },
];
