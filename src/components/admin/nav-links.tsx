"use client";

import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { FaUsers } from "react-icons/fa6";
import { GiSamusHelmet } from "react-icons/gi";
import { TbSwords } from "react-icons/tb";

export const links = [
	{label: 'Dashboard', href: ROUTES.ADMIN.DASHBOARD.BASE, icon: <Home/>},
	{label: 'Heroes', href: ROUTES.ADMIN.HEROES.BASE, icon: <GiSamusHelmet/>},
	{label: 'Equips', href: ROUTES.ADMIN.EQUIPS.BASE, icon: <TbSwords/>},
	{label: 'Lineups', href: ROUTES.ADMIN.LINEUPS.BASE, icon: <FaUsers/>},
]

export function NavLinks() {
	const pathname = usePathname();
	
	return (
		<nav className="grid items-start px-2 text-sm font-medium lg:px-4">
			{links.map((item, index) => (
				<Link
					key={index}
					href={item.href}
					className={cn(
						"flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
						pathname.startsWith(item.href) && "text-primary bg-muted",
					)}
				>
					{React.cloneElement(item.icon, {className: "size-4"})}
					{item.label}
				</Link>
			))}
		</nav>
	)
}