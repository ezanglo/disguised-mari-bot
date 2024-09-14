import { attributeTypes, classTypes, tierTypes } from "@/db/schema/types";
import { timestampColumns } from "@/db/schema/users";
import { json, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const heroes = pgTable("hero", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
	displayName: text("display_name").notNull(),
	code: text("code").notNull().unique(),
	color: text("color"),
	image: text("image"),
	discordEmote: text("discord_emote"),
	tierType: text("tier_type").notNull()
	.references(() => tierTypes.code),
	classType: text("class_type").notNull()
	.references(() => classTypes.code),
	attributeType: text("attribute_type").notNull()
	.references(() => attributeTypes.code),
	...timestampColumns,
});

// export const skills = pgTable("skill", {
// 	id: uuid("id").primaryKey().defaultRandom(),
// 	heroId: uuid("hero_id").notNull()
// 	.references(() => heroes.id, {onDelete: "cascade"}),
// 	name: text("name").notNull(),
// 	basic: text("basic").notNull(),
// 	skill: text("skill").notNull(),
// 	skillDescription: text("skill_description").notNull(),
// 	skillType: uuid("skill_type").notNull()
// 	.references(() => listItems.code),
// 	upgradeType: uuid("upgrade_type").notNull()
// 	.references(() => listItems.code),
// 	sp: integer("sp").notNull(),
// 	cooldown: integer("cooldown").notNull(),
// 	description: text("description").notNull(),
// 	isHeal: text("is_heal"),
// 	isRecast: text("is_recast"),
// 	...timestampColumns,
// });

export const pets = pgTable("pet", {
	id: uuid("id").primaryKey().defaultRandom(),
	heroId: uuid("hero_id").notNull()
	.references(() => heroes.id, {onDelete: "cascade"}),
	name: text("name").notNull(),
	code: text("code").notNull().unique(),
	image: text("image"),
	basic: text("basic").notNull(),
	skill: text("skill").notNull(),
	skillDescription: text("skill_description").notNull(),
	...timestampColumns,
});