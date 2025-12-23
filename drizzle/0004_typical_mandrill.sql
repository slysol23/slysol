ALTER TABLE "blog" ADD COLUMN "created_by" text;--> statement-breakpoint
ALTER TABLE "blog" ADD COLUMN "updated_by" text;--> statement-breakpoint
ALTER TABLE "blog" ADD COLUMN "is_published" boolean DEFAULT false NOT NULL;