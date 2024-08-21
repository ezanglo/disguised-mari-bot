"use client";

import { logout } from "@/actions/auth";
import { NavLinks } from "@/components/admin/nav-links";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ROUTES } from "@/constants/routes";
import { LogOutIcon, SettingsIcon } from "lucide-react";
import { Session } from "next-auth";
import Link from "next/link";

type SidebarProps = {
	user?: Session['user']
}

export function Sidebar({
	user
}: SidebarProps) {
	
	return (
		<div className="hidden border-r bg-muted/40 md:block">
			<div className="flex h-full max-h-screen flex-col gap-2">
				<div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
					<Link href={ROUTES.ADMIN.BASE} className="flex items-center gap-2 font-semibold">
						<Avatar className="border-2 border-primary size-8">
							<AvatarImage src="/images/mari-icon.png" alt="mari" width={128} height={128}/>
						</Avatar>
						<span className="">Admin Console</span>
					</Link>
					<Button variant="outline" size="icon" className="ml-auto h-8 w-8" asChild>
						<Link href={ROUTES.ADMIN.SETTINGS.BASE}>
							<SettingsIcon className="h-4 w-4"/>
							<span className="sr-only">Toggle notifications</span>
						</Link>
					</Button>
				</div>
				<div className="flex-1">
					<NavLinks/>
				</div>
				{user && (
					<div className="mt-auto flex flex-row p-4 gap-2 items-center">
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
				)}
			</div>
		</div>
	)
}