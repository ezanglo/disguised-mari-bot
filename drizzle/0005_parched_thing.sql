ALTER TABLE "list_item" DROP CONSTRAINT "list_item_list_id_list_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "list_item" ADD CONSTRAINT "list_item_list_id_list_id_fk" FOREIGN KEY ("list_id") REFERENCES "public"."list"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "list_item" ADD CONSTRAINT "list_item_code_unique" UNIQUE("code");