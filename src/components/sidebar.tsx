"use client";

import { logout } from "@/actions/auth";
import { LoginButton } from "@/components/login-button";
import { links } from "@/components/nav-links";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ROLES } from "@/constants/discord";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { CrownIcon, LogOutIcon, MenuIcon, SettingsIcon } from "lucide-react";
import { Session } from "next-auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type SidebarProps = {
	user?: Session['user']
}

export function Sidebar({
	user
}: SidebarProps) {
	
	const pathname = usePathname()
	const [open, setOpen] = useState(false);
	
	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button
					variant="outline"
					size="icon"
					className="shrink-0 md:hidden"
				>
					<MenuIcon className="size-5"/>
					<span className="sr-only">Toggle navigation menu</span>
				</Button>
			</SheetTrigger>
			<SheetContent side="left" className="flex flex-col h-full">
				<nav className="grid gap-6 text-lg font-medium">
					{links.map((link, index) => (
						<SheetClose asChild key={index}>
							<Link
								href={link.href}
								className={cn(
									"opacity-50 hover:opacity-100 transition-opacity",
									pathname === link.href && "opacity-100"
								)}
							>
								{link.label}
							</Link>
						</SheetClose>
					))}
				</nav>
				<div className="mt-auto flex flex-col gap-2">
					{user ? (
						<div className="mt-auto flex flex-row gap-2 items-center">
							<Avatar className="size-8">
								<AvatarImage src={user.image || ''} alt={user.name || ''}/>
							</Avatar>
							<div className="flex flex-col gap-1">
								<p className="text-base font-medium leading-none">@{user?.name}</p>
								<p className="text-xs leading-none text-muted-foreground">
									{user?.email}
								</p>
							</div>
							<div className="flex flex-row gap-2 ml-auto">
								{user.roles.includes(ROLES.ADMIN) && (
									<Button variant="outline" size="icon" asChild>
										<Link href={ROUTES.ADMIN.BASE}>
											<SettingsIcon className="size-4"/>
										</Link>
									</Button>
								)}
								<ConfirmDialog
									title="Sign Out"
									description="Are you sure you want to sign out?"
									onConfirm={() => logout()}
								>
									<Button variant="outline" size="icon">
										<LogOutIcon className="size-4"/>
									</Button>
								</ConfirmDialog>
							</div>
						</div>
					) : (
						<>
							<Button variant="secondary" className="rounded-full text-amber-500 border border-amber-500">
								<CrownIcon className="size-4 mr-2"/>
								Support Us
							</Button>
							<LoginButton/>
						</>
					)}
				</div>
			</SheetContent>
		</Sheet>
	)
}