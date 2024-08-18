import { db } from "@/db";
import { accounts, sessions, users, verificationTokens } from "@/db/schema/users";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth, { NextAuthConfig } from "next-auth"
import Discord from "next-auth/providers/discord";

export const authConfig = {
	providers: [Discord],
	callbacks: {
		async session({session, user}) {
			session.user.id = user.id
			return session
		},
		authorized({auth, request: {nextUrl}}) {
			const isLoggedIn = !!auth?.user
			const paths = ["/me", "/create"]
			const isProtected = paths.some((path) => nextUrl.pathname.startsWith(path))
			
			if (isProtected && !isLoggedIn) {
				const redirectUrl = new URL("api/auth/signin", nextUrl.origin)
				redirectUrl.searchParams.append("callbackUrl", nextUrl.href)
				return Response.redirect(redirectUrl)
			}
			
			return true
		},
	}
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
	secret: process.env.AUTH_SECRET,
	session: { strategy: "jwt" },
	...authConfig
})