"use client";

import { links } from "@/components/admin/nav-links";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ROUTES } from "@/constants/routes";
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
					<Menu className="h-5 w-5"/>
					<span className="sr-only">Toggle navigation menu</span>
				</Button>
			</SheetTrigger>
			<SheetContent side="left" className="flex flex-col">
				<nav className="grid gap-2 text-lg font-medium">
					<Link href={ROUTES.ADMIN.BASE} className="flex items-center gap-2 font-semibold">
						<Avatar className="border-2 border-primary size-8">
							<AvatarImage src="/images/mari-icon.png" alt="mari" width={128} height={128}/>
						</Avatar>
						<span className="">Admin Console</span>
					</Link>
					{links.map((item, index) => (
						<Link
							key={index}
							href={item.href}
							className={cn(
								"mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
								pathname.startsWith(item.href) && "text-primary bg-muted",
							)}
						>
							{React.cloneElement(item.icon, {className: "size-5"})}
							{item.label}
						</Link>
					))}
				</nav>
			</SheetContent>
		</Sheet>
)
}