import { pgTable, serial, text, date, smallint, boolean, timestamp, unique } from 'drizzle-orm/pg-core';

export const concerts = pgTable('concerts', {
    id: serial().primaryKey(),
    artist: text().notNull(),
    venue: text().notNull(),
    city: text().notNull(),
    country: text().notNull(),
    date: date().notNull(),
    rating: smallint(),
    title: text(),
    image_url: text(),
    is_public: boolean().default(true).notNull(),
    created_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    artistDateUnique: unique().on(table.artist, table.date),
}));

export type Concert = typeof concerts.$inferSelect;
export type NewConcert = typeof concerts.$inferInsert;