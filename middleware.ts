import { auth } from "@/auth";

export default auth((req) => {
	const {nextUrl} = req;
	
	const isLoggedIn = !!req.auth
	const isApiAuthRoute = nextUrl.pathname.startsWith('/api/auth')
	const isPublicRoute = nextUrl.pathname === '/'
	const isAuthRoute = nextUrl.pathname.startsWith('/login')
	
	if (isApiAuthRoute) {
		return;
	}
	
	
	if (isAuthRoute) {
		if (isLoggedIn) {
			return Response.redirect(new URL('/dashboard', nextUrl))
		}
		return;
	}
	
	
	if (!isLoggedIn && !isPublicRoute) {
		return Response.redirect(new URL('/login', nextUrl))
	}
})

export const config = {
	matcher: ['/((?!api|images|_next/static|_next/image|favicon.ico|\\.well-known).*)']
}