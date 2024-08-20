import { db } from "@/db";
import { accounts, sessions, users, verificationTokens } from "@/db/schema/users";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { APIGuildMember } from "discord-api-types/v10";
import NextAuth, { NextAuthConfig } from "next-auth"
import Discord from "next-auth/providers/discord";

export const authConfig = {
	trustHost: true,
	session: {
		strategy: "jwt",
		maxAge: 60 * 60 * 24 * 30,
	},
	secret: process.env.AUTH_SECRET,
	providers: [Discord],
	callbacks: {
		async jwt({token, account, profile}) {
			
			if(profile){
				if(profile.id){
					token.id = profile.id;
				}
				token.roles = [];
				token.nick = `@${profile.username as string}`;
				
				try {
					const url = [process.env.DISCORD_API_URL, 'guilds', process.env.DISCORD_GUILD_ID,'members', profile.id].join('/')
					const response = await fetch(url, {
						method: 'GET',
						headers: {
							"Authorization": `Bot ${process.env.DISCORD_BOT_TOKEN}`
						},
					})
					
					if(response.ok) {
						const data = await response.json() as APIGuildMember;
						token.roles = data.roles;
						token.nick = data.nick || `@${data.user.username}`;
					}
				}
				catch (error) {
					console.log(error)
				}
			}
			return token
		},
		async session({session, token, user}) {
			if (token?.sub) {
				session.user.id = token.sub;
			}
			
			if (token?.roles) {
				session.user.roles = token.roles;
			}
			
			if (token?.nick) {
				session.user.nick = token.nick;
			}
			
			return session;
		},
	},
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