ALTER TABLE "blog" ADD COLUMN IF NOT EXISTS "tags" jsonb;--> statement-breakpoint
ALTER TABLE "blog" ADD COLUMN IF NOT EXISTS "meta" jsonb;