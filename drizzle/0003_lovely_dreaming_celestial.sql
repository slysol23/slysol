ALTER TABLE "blog" ADD COLUMN IF NOT EXISTS "slug" varchar(255) NOT NULL;--> statement-breakpoint
-- ALTER TABLE "blog" ADD CONSTRAINT IF NOT EXISTS "blog_slug_unique" UNIQUE("slug");