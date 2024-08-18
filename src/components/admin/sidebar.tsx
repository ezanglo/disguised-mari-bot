"use client";

import { SidebarMenuItem } from "@/components/admin/sidebar-menu-item";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { LayoutDashboardIcon, ListIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const SIDEBAR_MENU = [
	{
		label: 'Dashboard',
		icon: <LayoutDashboardIcon/>,
		href: ROUTES.ADMIN.BASE,
	},
	{
		label: 'Types',
		icon: <ListIcon/>,
		href: ROUTES.ADMIN.TYPES,
	},
];

export type SidebarMenuType = typeof SIDEBAR_MENU[number] & {
	children?: SidebarMenuType[]
};

export function Sidebar() {
	
	return (
		<aside className={cn(
			"hidden inset-y fixed left-0 z-20 md:flex h-full flex-col border-r text-sm w-[250px] bg-background",
			"transition-[width] duration-300"
		)}>
			<div className="flex h-full max-h-screen flex-col gap-2">
				<div className="flex py-2 px-3 h-14 items-center lg:h-[60px]">
					<Link href="/" className="flex items-center gap-2 font-semibold w-full">
						<Image
							src={'/images/mari-icon.png'}
							alt={'logo'} width={100} height={100}
							className="size-7 rounded-full"
						/>
						<span className="line-clamp-1">Admin Console</span>
					</Link>
				</div>
				<nav className="flex flex-col h-full p-2 overflow-y-auto">
					{SIDEBAR_MENU.map((menu, index) => (
						<SidebarMenuItem key={index} {...menu}/>
					))}
				</nav>
			</div>
		</aside>
	)
}