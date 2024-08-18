"use client";

import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
	{label: 'General', href: ROUTES.ADMIN.SETTINGS.BASE},
	{label: 'Types', href: ROUTES.ADMIN.SETTINGS.TYPES},
	{label: 'Traits', href: ROUTES.ADMIN.SETTINGS.TRAITS},
	{label: 'Equips', href: ROUTES.ADMIN.SETTINGS.EQUIPS},
]

export function SettingsSidebar() {
	
	const pathname = usePathname()
	
	return (
		<nav
			className="grid gap-4 text-sm text-muted-foreground"
		>
			{links.map((link, index) => (
				<Link
					key={index}
					href={link.href}
					className={cn(pathname === link.href && "font-semibold text-primary")}
				>
					{link.label}
				</Link>
			))}
		</nav>
	)
}