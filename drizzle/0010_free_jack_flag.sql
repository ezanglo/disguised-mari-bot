ALTER TABLE "hero" RENAME COLUMN "tier" TO "tier_type";--> statement-breakpoint
ALTER TABLE "hero" RENAME COLUMN "class" TO "class_type";--> statement-breakpoint
ALTER TABLE "hero" RENAME COLUMN "attribute" TO "attribute_type";--> statement-breakpoint
ALTER TABLE "hero" DROP CONSTRAINT IF EXISTS "hero_tier_tier_type_id_fk";
--> statement-breakpoint
ALTER TABLE "hero" DROP CONSTRAINT IF EXISTS "hero_class_class_type_id_fk";
--> statement-breakpoint
ALTER TABLE "hero" DROP CONSTRAINT IF EXISTS "hero_attribute_attribute_type_id_fk";
--> statement-breakpoint
ALTER TABLE "hero" ADD COLUMN "code" text NOT NULL;--> statement-breakpoint
ALTER TABLE "hero" ADD COLUMN "color" text;--> statement-breakpoint
ALTER TABLE "hero" ADD COLUMN "image" text;--> statement-breakpoint
ALTER TABLE "pet" ADD COLUMN "code" text NOT NULL;--> statement-breakpoint
ALTER TABLE "pet" ADD COLUMN "image" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hero" ADD CONSTRAINT "hero_tier_type_tier_type_id_fk" FOREIGN KEY ("tier_type") REFERENCES "public"."tier_type"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hero" ADD CONSTRAINT "hero_class_type_class_type_id_fk" FOREIGN KEY ("class_type") REFERENCES "public"."class_type"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hero" ADD CONSTRAINT "hero_attribute_type_attribute_type_id_fk" FOREIGN KEY ("attribute_type") REFERENCES "public"."attribute_type"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "hero" ADD CONSTRAINT "hero_code_unique" UNIQUE("code");--> statement-breakpoint
ALTER TABLE "pet" ADD CONSTRAINT "pet_code_unique" UNIQUE("code");