"use client";

import { SIDEBAR_MENU } from "@/components/admin/sidebar";
import { SidebarMenuItem } from "@/components/admin/sidebar-menu-item";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import * as React from "react";

export function MobileSidebar() {
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
			<SheetContent side="left" className="flex flex-col">
				<nav className="grid gap-2 text-lg font-medium">
					{SIDEBAR_MENU.map((menu, index) => (
						<SidebarMenuItem key={index} {...menu} iconSize="size-5"/>
					))}
				</nav>
			</SheetContent>
		</Sheet>
	)
}