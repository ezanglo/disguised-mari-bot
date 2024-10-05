ALTER TABLE "pet" DROP CONSTRAINT "pet_hero_hero_code_fk";
--> statement-breakpoint
ALTER TABLE "skill" DROP CONSTRAINT "skill_hero_hero_code_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pet" ADD CONSTRAINT "pet_hero_hero_code_fk" FOREIGN KEY ("hero") REFERENCES "public"."hero"("code") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "skill" ADD CONSTRAINT "skill_hero_hero_code_fk" FOREIGN KEY ("hero") REFERENCES "public"."hero"("code") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
