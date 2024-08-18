import { auth } from "@/auth";

// export const { auth: middleware } = NextAuth(authConfig)

export default auth((req) => {
	const isLoggedIn = !!req.auth
	const isLandingPage = req.nextUrl.pathname === '/'

	if(!isLoggedIn && !isLandingPage){
		return Response.redirect(new URL('/', req.nextUrl))
	}
})


export const config = {
	matcher: ['/((?!api|images|_next/static|_next/image|favicon.ico).*)']
};
