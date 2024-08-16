import NextAuth from "next-auth"
import Discord from "next-auth/providers/discord"

export const {
	handlers: {GET, POST},
	signIn,
	signOut,
	auth
} = NextAuth({
	providers: [Discord],
	callbacks: {
		async jwt({token, account, profile}) {
			
			if (profile) {
				token.profile = profile
			}
			
			return token
		},
		async session({session, token, user}) {
			if (token?.profile) {
				session.user.profile = token?.profile;
			}
			return session;
		},
	},
})