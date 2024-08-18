"use client";

import { links } from "@/components/admin/nav-links";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

export function MobileSidebar() {
	const pathname = usePathname();
	
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button
					variant="outline"
					size="icon"
					className="shrink-0 md:hidden"
				>
					<Menu className="size-5"/>
					<span className="sr-only">Toggle navigation menu</span>
				</Button>
			</SheetTrigger>
			<SheetContent side="left">
				<nav className="grid gap-6 text-lg font-medium">
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
			</SheetContent>
		</Sheet>
)
}