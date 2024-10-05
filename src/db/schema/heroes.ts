import { attributeTypes, classTypes, equipTypes, listItems, tierTypes } from "@/db/schema/types";
import { timestampColumns } from "@/db/schema/users";
import { boolean, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const heroes = pgTable("hero", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
	displayName: text("display_name").notNull(),
	code: text("code").notNull().unique(),
	color: text("color"),
	image: text("image"),
	discordEmote: text("discord_emote"),
	thumbnail: text("thumbnail"),
	exclusiveWeapon: uuid("exclusive_weapon")
	.references(() => equipTypes.id, { onDelete: "set null"}),
	tierType: text("tier_type").notNull()
	.references(() => tierTypes.code),
	classType: text("class_type").notNull()
	.references(() => classTypes.code),
	attributeType: text("attribute_type").notNull()
	.references(() => attributeTypes.code),
	...timestampColumns,
});

export const pets = pgTable("pet", {
	id: uuid("id").primaryKey().defaultRandom(),
	hero: text("hero").notNull()
	.references(() => heroes.code, {onDelete: "cascade", onUpdate: "cascade"}),
	tierType: text("tier_type").notNull()
	.references(() => tierTypes.code),
	name: text("name").notNull(),
	code: text("code").notNull().unique(),
	image: text("image"),
	discordEmote: text("discord_emote"),
	basicDescription: text("basic_description"),
	basicCooldown: text("basic_cooldown"),
	skillName: text("skill"),
	skillImage: text("skill_image"),
	skillEmote: text("skill_emote"),
	skillDescription: text("skill_description"),
	skillCooldown: text("skill_cooldown"),
	...timestampColumns,
});

export const skills = pgTable("skill", {
	id: uuid("id").primaryKey().defaultRandom(),
	hero: text("hero").notNull()
	.references(() => heroes.code, {onDelete: "cascade", onUpdate: "cascade"}),
	skillType: text("skill_type").notNull()
	.references(() => listItems.code),
	upgradeType: text("upgrade_type").notNull()
	.references(() => listItems.code),
	name: text("name").notNull(),
	code: text("code").notNull().unique(),
	description: text("description"),
	discordEmote: text("discord_emote"),
	image: text("image"),
	sp: integer("sp"),
	cooldown: integer("cooldown"),
	isHeal: boolean("is_heal"),
	isRecast: boolean("is_recast"),
	...timestampColumns,
});