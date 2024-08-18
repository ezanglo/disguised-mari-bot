import { db } from "@/db";
import { accounts, sessions, users, verificationTokens } from "@/db/schema/users";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth, { NextAuthConfig } from "next-auth"
import Discord from "next-auth/providers/discord";

export const authConfig = {
	session: {
		strategy: "jwt",
		maxAge: 60 * 60 * 24 * 30,
	},
	secret: process.env.AUTH_SECRET,
	providers: [Discord],
} satisfies NextAuthConfig

export const {
	handlers: {GET, POST},
	signIn,
	signOut,
	auth
} = NextAuth({
	adapter: DrizzleAdapter(db, {
		usersTable: users,
		accountsTable: accounts as any,
		sessionsTable: sessions,
		verificationTokensTable: verificationTokens,
	}),
	...authConfig
})