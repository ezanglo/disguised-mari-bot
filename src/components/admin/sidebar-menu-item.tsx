"use client";

import { SidebarMenuType } from "@/components/admin/sidebar";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

type SidebarMenuItemProps = SidebarMenuType & {
	iconSize?: string,
	iconOnly?: boolean
};

export function SidebarMenuItem({
	href,
	label,
	icon,
	iconSize = 'size-5',
	iconOnly = false,
	children
}: SidebarMenuItemProps) {
	const pathname = usePathname();
	
	const isSelected = pathname === href;
	
	const [isOpen, setIsOpen] = useState(isSelected);
	
	if (iconOnly) {
		return (
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className={cn(
							"rounded-lg",
							isSelected && "bg-muted text-primary"
						)}
						aria-label={label}
						asChild
					>
						<Link href={href}>
							{icon && React.cloneElement(icon, {
								className: cn(iconSize, icon.props.className)
							})}
						</Link>
					</Button>
				</TooltipTrigger>
				<TooltipContent side="right" sideOffset={5}>
					{label}
				</TooltipContent>
			</Tooltip>
		)
	}
	
	if (children) {
		return (
			<Collapsible className="transition-[height] duration-500 ease-in-out" open={isOpen} onOpenChange={setIsOpen}>
				<CollapsibleTrigger asChild>
					<div
						className={cn(
							"flex items-center gap-3 rounded-lg p-2 text-muted-foreground hover:text-primary cursor-pointer",
							isSelected && "bg-muted text-primary"
						)}
					>
						{icon && React.cloneElement(icon, {
							className: cn(iconSize, icon.props.className)
						})}
						<span className="line-clamp-1">{label}</span>
						<ChevronRightIcon className={cn(
							"size-4 ml-auto transition-transform duration-500",
							isOpen && "transform rotate-90"
						)}/>
					</div>
				</CollapsibleTrigger>
				<CollapsibleContent
					className="overflow-hidden transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
					{children && children.map((item, index) => (
						<Link
							key={index}
							href={item.href}
							className={cn(
								"flex items-center gap-3 rounded-lg p-2 text-muted-foreground transition-all hover:text-primary pl-10",
								pathname === item.href && "text-primary"
							)}
						>
							<span className="line-clamp-1">{item.label}</span>
						</Link>
					))}
				</CollapsibleContent>
			</Collapsible>
		)
	}
	
	return (
		<Link
			href={href}
			className={cn(
				"flex items-center gap-3 rounded-lg p-2 text-muted-foreground transition-all hover:text-primary",
				isSelected && "bg-muted text-primary"
			)}
		>
			{icon && React.cloneElement(icon, {
				className: cn(iconSize, icon.props.className)
			})}
			<span className="line-clamp-1">{label}</span>
		</Link>
	)
}