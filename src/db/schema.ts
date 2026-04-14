import { relations } from 'drizzle-orm';
import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  varchar,
} from 'drizzle-orm/pg-core';

export const userSchema = pgTable('user', {
  id: integer('id').primaryKey().unique().notNull().generatedAlwaysAsIdentity(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  isAdmin: boolean('is_admin').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
export const blogSchema = pgTable('blog', {
  id: integer('id').primaryKey().unique().notNull().generatedAlwaysAsIdentity(),
  authorId: integer('author_id')
    .notNull()
    .references(() => authorSchema.id),
  title: text('title').notNull(),
  content: text('content').notNull(),
  image: text('image'),
  description: text('description').notNull(),
  tags: jsonb('tags'),
  meta: jsonb('meta'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdBy: text('created_by'),
  updatedBy: text('updated_by'),
  is_published: boolean('is_published').default(false).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
});

export const authorSchema = pgTable('author', {
  id: integer('id').primaryKey().unique().notNull().generatedAlwaysAsIdentity(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
export const commentSchema = pgTable('comments', {
  id: integer('id').primaryKey().unique().notNull().generatedAlwaysAsIdentity(),
  blogId: integer('blog_id').notNull(),
  parentId: integer('parent_id'),
  name: text('name').notNull(),
  email: text('email'),
  comment: text('comment').notNull(),
  is_published: boolean('is_published').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const blogAuthorsSchema = pgTable('blog_authors', {
  blogId: integer('blog_id')
    .notNull()
    .references(() => blogSchema.id, { onDelete: 'cascade' }),

  authorId: integer('author_id')
    .notNull()
    .references(() => authorSchema.id, { onDelete: 'cascade' }),
});

export const productCategorySchema = pgTable('product_category', {
  id: varchar('id', { length: 255 }).primaryKey().unique().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  is_published: boolean('is_published').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const productSchema = pgTable('products', {
  id: integer('id').primaryKey().unique().notNull().generatedAlwaysAsIdentity(),

  categoryId: varchar('category_id', { length: 255 })
    .notNull()
    .references(() => productCategorySchema.id, {
      onDelete: 'restrict',
      onUpdate: 'cascade',
    }),

  title: text('title').notNull(),
  category: text('category').notNull(),
  images: jsonb('images').notNull(),
  overview: text('overview').notNull(),
  challenges: text('challenges').notNull(),
  approach: text('approach').notNull(),
  outcomes: text('outcomes').notNull(),
  feedback: text('feedback').notNull(),
  techstack: jsonb('techstack').notNull(),
  is_published: boolean('is_published').default(false).notNull(),
  description: text('description').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  updatedBy: text('updated_by'),
});

export const productCategoryRelations = relations(
  productCategorySchema,
  ({ many }) => ({
    products: many(productSchema),
  }),
);

export const productRelations = relations(productSchema, ({ one }) => ({
  productCategory: one(productCategorySchema, {
    fields: [productSchema.categoryId],
    references: [productCategorySchema.id],
  }),
}));

export type User = typeof userSchema.$inferSelect;
export type NewUser = typeof userSchema.$inferInsert;

export type ProductCategory = typeof productCategorySchema.$inferSelect;
export type NewProductCategory = typeof productCategorySchema.$inferInsert;

export type Product = typeof productSchema.$inferSelect;
export type NewProduct = typeof productSchema.$inferInsert;
