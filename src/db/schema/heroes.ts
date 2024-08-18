import { attributeTypes, classTypes, skillTypes, tierTypes, upgradeTypes } from "@/db/schema/types";
import { timestampColumns } from "@/db/schema/users";
import { integer, json, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const heroes = pgTable("hero", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
	displayName: text("display_name").notNull(),
	tier: uuid("tier").notNull()
	.references(() => tierTypes.id),
	class: uuid("class").notNull()
	.references(() => classTypes.id),
	attribute: uuid("attribute").notNull()
	.references(() => attributeTypes.id),
	description: json('description'),
	...timestampColumns,
});

export const skills = pgTable("skill", {
	id: uuid("id").primaryKey().defaultRandom(),
	heroId: uuid("hero_id").notNull()
	.references(() => heroes.id, {onDelete: "cascade"}),
	name: text("name").notNull(),
	basic: text("basic").notNull(),
	skill: text("skill").notNull(),
	skillDescription: text("skill_description").notNull(),
	skillType: uuid("skill_type").notNull()
	.references(() => skillTypes.id),
	upgradeType: uuid("upgrade_type").notNull()
	.references(() => upgradeTypes.id),
	sp: integer("sp").notNull(),
	cooldown: integer("cooldown").notNull(),
	description: text("description").notNull(),
	isHeal: text("is_heal"),
	isRecast: text("is_recast"),
	...timestampColumns,
});

export const pets = pgTable("pet", {
	id: uuid("id").primaryKey().defaultRandom(),
	heroId: uuid("hero_id").notNull()
	.references(() => heroes.id, {onDelete: "cascade"}),
	name: text("name").notNull(),
	basic: text("basic").notNull(),
	skill: text("skill").notNull(),
	skillDescription: text("skill_description").notNull(),
	...timestampColumns,
});