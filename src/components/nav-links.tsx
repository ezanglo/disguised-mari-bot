"use client";

import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const links = [
	{ label: 'Home', href: ROUTES.BASE },
	{ label: 'Heroes', href: ROUTES.HEROES.BASE },
	{ label: 'Equips', href: ROUTES.EQUIPS.BASE },
	{ label: 'Lineups', href: ROUTES.LINEUPS.BASE }
]

export function NavLinks() {

	const pathname = usePathname()

	return (
		<nav className="hidden md:flex flex-row gap-5">
			{links.map((link, index) => (
				<Link
					key={index} href={link.href}
					className={cn(
						"opacity-50 hover:opacity-100 transition-opacity",
						pathname === link.href && "opacity-100"
					)}
				>
					{link.label}
				</Link>
			))}
		</nav>
	)
}