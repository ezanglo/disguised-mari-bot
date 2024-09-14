ALTER TABLE "hero" DROP CONSTRAINT IF EXISTS "hero_tier_type_tier_type_id_fk";
--> statement-breakpoint
ALTER TABLE "hero" DROP CONSTRAINT IF EXISTS "hero_class_type_class_type_id_fk";
--> statement-breakpoint
ALTER TABLE "hero" DROP CONSTRAINT IF EXISTS "hero_attribute_type_attribute_type_id_fk";
--> statement-breakpoint
ALTER TABLE "hero" ALTER COLUMN "tier_type" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "hero" ALTER COLUMN "class_type" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "hero" ALTER COLUMN "attribute_type" SET DATA TYPE text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hero" ADD CONSTRAINT "hero_tier_type_tier_type_code_fk" FOREIGN KEY ("tier_type") REFERENCES "public"."tier_type"("code") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hero" ADD CONSTRAINT "hero_class_type_class_type_code_fk" FOREIGN KEY ("class_type") REFERENCES "public"."class_type"("code") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hero" ADD CONSTRAINT "hero_attribute_type_attribute_type_code_fk" FOREIGN KEY ("attribute_type") REFERENCES "public"."attribute_type"("code") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
