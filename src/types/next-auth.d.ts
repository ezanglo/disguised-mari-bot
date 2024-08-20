import { type DefaultSession } from "next-auth"


declare module "@auth/core/jwt" {
	interface JWT {
		id: string,
		nick: string,
		roles: string[]
	}
}


declare module "next-auth" {
	// Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
	interface Session {
		user: DefaultSession["user"] & {
			id: string,
			nick: string,
			roles: string[],
		}
	}
}