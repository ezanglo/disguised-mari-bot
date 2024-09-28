"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const links = [
	{ label: 'Home', href: '/' },
	{ label: 'Heroes', href: '/heroes' },
	{ label: 'Pets', href: '/pets' },
	{ label: 'Lineups', href: '/lineups' }
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