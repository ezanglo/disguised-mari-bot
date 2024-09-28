"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { links } from "../nav-links";

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