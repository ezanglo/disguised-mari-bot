ALTER TABLE "pet" ADD COLUMN "tier_type" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pet" ADD CONSTRAINT "pet_tier_type_tier_type_code_fk" FOREIGN KEY ("tier_type") REFERENCES "public"."tier_type"("code") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
