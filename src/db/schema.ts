import {
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
  integer,
} from 'drizzle-orm/pg-core';

export const userSchema = pgTable('users', {
  id: integer('id').primaryKey().unique().notNull().generatedAlwaysAsIdentity(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  isAdmin: boolean('is_admin').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type User = typeof userSchema.$inferSelect;
export type NewUser = typeof userSchema.$inferInsert;
