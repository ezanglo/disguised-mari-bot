import type { Profile } from "@auth/core/types";
import { type DefaultSession } from "next-auth"


declare module "@auth/core/jwt" {
	interface JWT {
		profile?: Profile
	}
}


declare module "next-auth" {
	// Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
	interface Session {
		user: {
			profile?: Profile
		} & DefaultSession["user"]
	}
}