"use client";

import { NavLinks } from "@/components/admin/nav-links";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ROUTES } from "@/constants/routes";
import { Session } from "next-auth";
import Link from "next/link";

type SidebarProps = {
	user?: Session['user']
}

export function Sidebar({
	user
}: SidebarProps) {
	
	return (
		<aside className="fixed top-0 left-0 h-full w-[220px] lg:w-[280px] border-r bg-background hidden md:block">
			<div className="flex h-full max-h-screen flex-col gap-2 bg-muted/40">
				<div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
					<Link href={ROUTES.ADMIN.BASE} className="flex items-center gap-2 font-semibold">
						<Avatar className="border-2 border-primary size-8">
							<AvatarImage src="/images/mari-icon.png" alt="mari" width={128} height={128}/>
						</Avatar>
						<span className="">Admin Console</span>
					</Link>
				</div>
				<div className="flex-1">
					<NavLinks/>
				</div>
			</div>
		</aside>
	)
}