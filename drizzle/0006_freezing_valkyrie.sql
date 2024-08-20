CREATE TABLE IF NOT EXISTS "trait_type" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"upgrade_type" text NOT NULL,
	"image" text,
	"discord_emote" text,
	"order" integer,
	"created_at" timestamp DEFAULT now(),
	"created_by" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "trait_type" ADD CONSTRAINT "trait_type_upgrade_type_list_item_code_fk" FOREIGN KEY ("upgrade_type") REFERENCES "public"."list_item"("code") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "trait_type" ADD CONSTRAINT "trait_type_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "trait_type" ADD CONSTRAINT "trait_type_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
