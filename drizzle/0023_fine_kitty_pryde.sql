ALTER TABLE "skill" ADD COLUMN "code" text NOT NULL;--> statement-breakpoint
ALTER TABLE "skill" ADD CONSTRAINT "skill_code_unique" UNIQUE("code");