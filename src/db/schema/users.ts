import { sql } from "drizzle-orm";
import { integer, pgTable, primaryKey, text, timestamp, } from "drizzle-orm/pg-core";
import type { AdapterAccount } from "next-auth/adapters";

export const timestampColumns ={
	createdAt: timestamp("created_at", {mode: "date"}).defaultNow(),
	createdBy: text("created_by")
.references(() => users.id, {onDelete: "set null"}),
	updatedAt: timestamp('updated_at', {withTimezone: true, mode: 'string'}).defaultNow().notNull()
.$onUpdate(() => sql`now()`),
	updatedBy: text("updated_by")
.references(() => users.id, {onDelete: "set null"}),
}

export const users = pgTable("user", {
	id: text("id")
	.primaryKey()
	.$defaultFn(() => crypto.randomUUID()),
	name: text("name"),
	email: text("email").notNull(),
	emailVerified: timestamp("emailVerified", {mode: "date"}),
	image: text("image"),
});

export const accounts = pgTable(
	"account",
	{
		userId: text("userId")
		.notNull()
		.references(() => users.id, {onDelete: "cascade"}),
		type: text("type").$type<AdapterAccount>().notNull(),
		provider: text("provider").notNull(),
		providerAccountId: text("providerAccountId").notNull(),
		refresh_token: text("refresh_token"),
		access_token: text("access_token"),
		expires_at: integer("expires_at"),
		token_type: text("token_type"),
		scope: text("scope"),
		id_token: text("id_token"),
		session_state: text("session_state"),
	},
	(account) => ({
		compoundKey: primaryKey({
			columns: [account.provider, account.providerAccountId],
		}),
	})
);

export const sessions = pgTable("session", {
	sessionToken: text("sessionToken").primaryKey(),
	userId: text("userId")
	.notNull()
	.references(() => users.id, {onDelete: "cascade"}),
	expires: timestamp("expires", {mode: "date"}).notNull(),
});

export const verificationTokens = pgTable(
	"verificationToken",
	{
		identifier: text("identifier").notNull(),
		token: text("token").notNull(),
		expires: timestamp("expires", {mode: "date"}).notNull(),
	},
	(vt) => ({
		compoundKey: primaryKey({columns: [vt.identifier, vt.token]}),
	})
);