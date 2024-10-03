"use client";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { Session } from "next-auth";
import Link from "next/link";
import { usePathname } from "next/navigation";

type ProfileLinkProps = {
	user: Session['user']
}

export function ProfileLink({
	user,
}: ProfileLinkProps) {
	
	const pathname = usePathname()
	
	const url = ROUTES.PROFILE.BASE(user.name!);
	
	return (
		<Button variant={pathname === url ? 'secondary' : 'outline'} asChild>
			<Link href={url}>
				Your Profile
			</Link>
		</Button>
	)
}