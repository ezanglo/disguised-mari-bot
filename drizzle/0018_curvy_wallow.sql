DO $$ BEGIN
 CREATE TYPE "public"."enemy_type" AS ENUM('heroes', 'monsters');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
-- Alter the column type safely
ALTER TABLE "content_phase" 
ALTER COLUMN "enemy_type" TYPE "public"."enemy_type" 
USING (
  CASE 
    WHEN "enemy_type" = 'heroes' THEN 'heroes'::public.enemy_type
    WHEN "enemy_type" = 'monsters' THEN 'monsters'::public.enemy_type
    ELSE NULL
  END
);


CREATE TABLE IF NOT EXISTS "monster" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"image" text,
	"discord_emote" text,
	"class_type" text,
	"attribute_type" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" text,
	"updated_at" timestamp with time zone DEFAULT now(),
	"updated_by" text,
	CONSTRAINT "monster_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "content_phase" ALTER COLUMN "enemy_type" SET DATA TYPE enemy_type;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "monster" ADD CONSTRAINT "monster_class_type_class_type_code_fk" FOREIGN KEY ("class_type") REFERENCES "public"."class_type"("code") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "monster" ADD CONSTRAINT "monster_attribute_type_attribute_type_code_fk" FOREIGN KEY ("attribute_type") REFERENCES "public"."attribute_type"("code") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "monster" ADD CONSTRAINT "monster_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "monster" ADD CONSTRAINT "monster_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
