import { authConfig } from "@/auth";
import { ROUTES } from "@/constants/routes";
import { isAuthorized } from "@/lib/utils";
import NextAuth from "next-auth";

export const {auth: middleware} = NextAuth(authConfig)

export default middleware((req) => {
	const {nextUrl, auth} = req;
	const isLoggedIn = !!auth
	
	const isLandingPage = req.nextUrl.pathname === ROUTES.BASE
	const isAdminRoute = nextUrl.pathname.startsWith(ROUTES.ADMIN.BASE)
	const isChaserRoute = nextUrl.pathname.startsWith(ROUTES.CHASER.BASE)
	const canViewAdmin = isAuthorized(auth?.user)
	
	if (!isLoggedIn && !isLandingPage) {
		return Response.redirect(new URL(ROUTES.BASE, req.nextUrl))
	}
	
	if (isAdminRoute) {
    return canViewAdmin
        ? undefined // Allow access to admin route
        : Response.redirect(new URL(ROUTES.CHASER.BASE, nextUrl));
}
	
	if (isLoggedIn && !canViewAdmin && !isChaserRoute) {
		return Response.redirect(new URL(ROUTES.CHASER.BASE, nextUrl))
	}
})


export const config = {
	matcher: ['/((?!api|images|_next/static|_next/image|favicon.ico).*)']
};
