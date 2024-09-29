ALTER TABLE "content_phase" DROP CONSTRAINT "content_phase_content_content_code_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "content_phase" ADD CONSTRAINT "content_phase_content_list_item_code_fk" FOREIGN KEY ("content") REFERENCES "public"."list_item"("code") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
