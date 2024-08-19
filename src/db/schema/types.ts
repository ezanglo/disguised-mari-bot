import { timestampColumns } from "@/db/schema/users";
import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const classTypes = pgTable("class_type", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
	color: text("color"),
	image: text("image"),
	discordEmote: text("discord_emote"),
	order: integer("order"),
	...timestampColumns
});

export const tierTypes = pgTable("tier_type", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
	image: text("image"),
	discordEmote: text("discord_emote"),
	order: integer("order"),
	...timestampColumns
});

export const attributeTypes = pgTable("attribute_type", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
	image: text("image"),
	discordEmote: text("discord_emote"),
	order: integer("order"),
	...timestampColumns
});

export const upgradeTypes = pgTable("upgrade_type", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
	image: text("image"),
	discordEmote: text("discord_emote"),
	order: integer("order"),
	...timestampColumns
});

export const skillTypes = pgTable("skill_type", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
	image: text("image"),
	discordEmote: text("discord_emote"),
	order: integer("order"),
	...timestampColumns
});