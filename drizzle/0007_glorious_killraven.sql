DROP TABLE "skill";--> statement-breakpoint
DROP TABLE "skill_type";--> statement-breakpoint
DROP TABLE "upgrade_type";--> statement-breakpoint
ALTER TABLE "hero" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "hero" ALTER COLUMN "created_by" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "hero" ALTER COLUMN "updated_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "pet" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "pet" ALTER COLUMN "created_by" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "pet" ALTER COLUMN "updated_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "attribute_type" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "attribute_type" ALTER COLUMN "created_by" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "attribute_type" ALTER COLUMN "updated_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "class_type" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "class_type" ALTER COLUMN "created_by" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "class_type" ALTER COLUMN "updated_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "list_item" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "list_item" ALTER COLUMN "created_by" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "list_item" ALTER COLUMN "updated_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "list" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "list" ALTER COLUMN "created_by" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "list" ALTER COLUMN "updated_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "tier_type" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tier_type" ALTER COLUMN "created_by" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tier_type" ALTER COLUMN "updated_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "trait_type" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "trait_type" ALTER COLUMN "created_by" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "trait_type" ALTER COLUMN "updated_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "attribute_type" ADD COLUMN "code" text;--> statement-breakpoint
ALTER TABLE "class_type" ADD COLUMN "code" text;--> statement-breakpoint
ALTER TABLE "tier_type" ADD COLUMN "code" text;