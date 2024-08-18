import { auth } from "@/auth";
import { ROLES } from "@/constants/discord";
import { ROUTES } from "@/constants/routes";

// export const { auth: middleware } = NextAuth(authConfig)

export default auth((req) => {
	const { nextUrl, auth } = req;
	const isLoggedIn = !!auth
	
	const isLandingPage = req.nextUrl.pathname === ROUTES.BASE
	const isAdminRoute = nextUrl.pathname.startsWith(ROUTES.ADMIN.BASE)
	const isAdmin = auth?.user.roles.includes(ROLES.ADMIN);
	
	if(!isLoggedIn && !isLandingPage){
		return Response.redirect(new URL(ROUTES.BASE, req.nextUrl))
	}
	
	if(isAdminRoute && !isAdmin){
		return Response.redirect(new URL(ROUTES.BASE, nextUrl))
	}
})


export const config = {
	matcher: ['/((?!api|images|_next/static|_next/image|favicon.ico).*)']
};
