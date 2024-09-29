import { timestampColumns } from "@/db/schema/users";
import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const classTypes = pgTable("class_type", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
	code: text("code").notNull().unique(),
	color: text("color"),
	image: text("image"),
	discordEmote: text("discord_emote"),
	order: integer("order"),
	...timestampColumns
});

export const tierTypes = pgTable("tier_type", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
	code: text("code").notNull().unique(),
	image: text("image"),
	discordEmote: text("discord_emote"),
	order: integer("order"),
	...timestampColumns
});

export const attributeTypes = pgTable("attribute_type", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
	code: text("code").notNull().unique(),
	image: text("image"),
	discordEmote: text("discord_emote"),
	order: integer("order"),
	...timestampColumns
});

export const lists = pgTable("list", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
	...timestampColumns
});

export const listItems = pgTable("list_item", {
	id: uuid("id").primaryKey().defaultRandom(),
	listId: uuid("list_id").notNull()
	.references(() => lists.id, { onDelete: "cascade"}),
	name: text("name").notNull(),
	code: text("code").notNull().unique(),
	image: text("image"),
	discordEmote: text("discord_emote"),
	order: integer("order"),
	...timestampColumns
});

export const traitTypes = pgTable("trait_type", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
	code: text("code").notNull().unique(),
	upgradeType: text("upgrade_type").notNull()
	.references(() => listItems.code),
	image: text("image"),
	discordEmote: text("discord_emote"),
	order: integer("order"),
	...timestampColumns
});

export const equipTypes = pgTable("equip_type", {
	id: uuid("id").primaryKey().defaultRandom(),
	classType: text("class_type").notNull()
	.references(() => classTypes.code),
	gearType: text("gear_type").notNull()
	.references(() => listItems.code),
	name: text("name"),
	image: text("image"),
	discordEmote: text("discord_emote"),
	order: integer("order"),
	...timestampColumns
});