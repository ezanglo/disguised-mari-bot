import { timestampColumns } from "@/db/schema/users";
import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { attributeTypes, classTypes } from "./types";

export const contents = pgTable("content", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
	code: text("code").notNull().unique(),
	image: text("image"),
	discordEmote: text("discord_emote"),
	order: integer("order"),
	...timestampColumns
});

export const contentPhases = pgTable("content_phase", {
	id: uuid("id").primaryKey().defaultRandom(),
	code: text("code").notNull().unique(),
	contentId: text("content").notNull()
	.references(() => contents.code),
	classType: text("class_type").notNull()
	.references(() => classTypes.code),
	attributeType: text("attribute_type").notNull()
	.references(() => attributeTypes.code),
	name: text("name").notNull(),
	enemyType: text("enemy_type"),
	enemies: text("enemies").array(),
	order: integer("order"),
	...timestampColumns
});