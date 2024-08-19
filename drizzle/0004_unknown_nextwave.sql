ALTER TABLE "skill" DROP CONSTRAINT "skill_skill_type_skill_type_id_fk";
--> statement-breakpoint
ALTER TABLE "skill" DROP CONSTRAINT "skill_upgrade_type_upgrade_type_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "skill" ADD CONSTRAINT "skill_skill_type_list_item_id_fk" FOREIGN KEY ("skill_type") REFERENCES "public"."list_item"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "skill" ADD CONSTRAINT "skill_upgrade_type_list_item_id_fk" FOREIGN KEY ("upgrade_type") REFERENCES "public"."list_item"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
