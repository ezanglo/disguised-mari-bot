ALTER TABLE "attribute_type" ALTER COLUMN "code" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "class_type" ALTER COLUMN "code" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tier_type" ALTER COLUMN "code" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "attribute_type" ADD CONSTRAINT "attribute_type_code_unique" UNIQUE("code");--> statement-breakpoint
ALTER TABLE "class_type" ADD CONSTRAINT "class_type_code_unique" UNIQUE("code");--> statement-breakpoint
ALTER TABLE "tier_type" ADD CONSTRAINT "tier_type_code_unique" UNIQUE("code");--> statement-breakpoint
ALTER TABLE "trait_type" ADD CONSTRAINT "trait_type_code_unique" UNIQUE("code");