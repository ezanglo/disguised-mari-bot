"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

export const links = [
	{label: 'Dashboard', href: ROUTES.ADMIN.DASHBOARD.BASE},
	{label: 'Settings', href: ROUTES.ADMIN.SETTINGS.BASE},
]

export function NavLinks() {
	const pathname = usePathname();
	
	return (
		<nav
			className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
			<Link
				href="#"
				className="flex items-center gap-2 text-lg font-semibold md:text-base"
			>
				<Avatar className="border-2 border-primary size-6">
					<AvatarImage src="/images/mari-icon.png" alt="mari" width={128} height={128}/>
				</Avatar>
				<span className="sr-only">Disguised Mari Bot</span>
			</Link>
			{links.map((item, index) => (
				<Link
					key={index}
					href={item.href}
					className={cn(
						"hover:text-foreground",
						!pathname.startsWith(item.href) && "text-muted-foreground",
					)}
				>
					{item.label}
				</Link>
			))}
		</nav>
	)
}