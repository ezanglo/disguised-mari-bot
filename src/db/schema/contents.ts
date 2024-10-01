import { timestampColumns } from "@/db/schema/users";
import { integer, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { attributeTypes, classTypes, listItems } from "./types";


export const enemyTypeEnum = pgEnum('enemy_type', ['heroes', 'monsters']);

export const contentPhases = pgTable("content_phase", {
	id: uuid("id").primaryKey().defaultRandom(),
	code: text("code").notNull().unique(),
	content: text("content").notNull()
	.references(() => listItems.code),
	classType: text("class_type").notNull()
	.references(() => classTypes.code),
	attributeType: text("attribute_type").notNull()
	.references(() => attributeTypes.code),
	name: text("name").notNull(),
	enemyType: enemyTypeEnum("enemy_type"),
	enemies: text("enemies").array(),
	order: integer("order"),
	...timestampColumns
});

export const monsters = pgTable("monster", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
	code: text("code").notNull().unique(),
	image: text("image"),
	discordEmote: text("discord_emote"),
	classType: text("class_type")
	.references(() => classTypes.code),
	attributeType: text("attribute_type")
	.references(() => attributeTypes.code),
	...timestampColumns,
});
