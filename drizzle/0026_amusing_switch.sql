ALTER TABLE "hero" ADD COLUMN "exclusive_weapon" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hero" ADD CONSTRAINT "hero_exclusive_weapon_equip_type_id_fk" FOREIGN KEY ("exclusive_weapon") REFERENCES "public"."equip_type"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
