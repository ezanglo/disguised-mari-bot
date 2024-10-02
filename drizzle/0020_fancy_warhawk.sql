ALTER TABLE "pet" RENAME COLUMN "basic" TO "basic_description";--> statement-breakpoint
ALTER TABLE "pet" ALTER COLUMN "basic_description" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "pet" ALTER COLUMN "skill" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "pet" ALTER COLUMN "skill_description" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "pet" ADD COLUMN "discord_emote" text;--> statement-breakpoint
ALTER TABLE "pet" ADD COLUMN "basic_cooldown" text;--> statement-breakpoint
ALTER TABLE "pet" ADD COLUMN "skill_image" text;--> statement-breakpoint
ALTER TABLE "pet" ADD COLUMN "skill_emote" text;--> statement-breakpoint
ALTER TABLE "pet" ADD COLUMN "skill_cooldown" text;