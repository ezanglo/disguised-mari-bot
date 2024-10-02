ALTER TABLE "pet" DROP CONSTRAINT "pet_hero_id_hero_id_fk";
--> statement-breakpoint
ALTER TABLE "pet" ADD COLUMN "hero" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pet" ADD CONSTRAINT "pet_hero_hero_code_fk" FOREIGN KEY ("hero") REFERENCES "public"."hero"("code") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "pet" DROP COLUMN IF EXISTS "hero_id";