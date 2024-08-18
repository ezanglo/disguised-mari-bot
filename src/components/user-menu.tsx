"use client";

import { logout } from "@/actions/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ROLES } from "@/constants/discord";
import { ROUTES } from "@/constants/routes";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { LogOutIcon, SettingsIcon } from "lucide-react";
import { Session } from "next-auth";
import Link from "next/link";

type UserMenuProps = {
	user: Session['user'],
	iconOnly?: boolean,
}

export function UserMenu({
	user,
	iconOnly = false
}: UserMenuProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				{iconOnly ? (
					<Button variant="secondary" size="icon" className="rounded-full">
						<Avatar className="size-10 md:size-6">
							<AvatarImage src={user.image || ''} alt={user.name || ''}/>
							<AvatarFallback>{user.name?.substring(2, 0)?.toUpperCase()}</AvatarFallback>
						</Avatar>
					</Button>
				): (
					<Button variant="ghost">
						<div className="flex flex-row gap-2 items-center">
							<span>Welcome back, {user.nick}</span>
							<Avatar className="size-10 md:size-6">
								<AvatarImage src={user.image || ''} alt={user.name || ''}/>
								<AvatarFallback>{user.name?.substring(2, 0)?.toUpperCase()}</AvatarFallback>
							</Avatar>
						</div>
					</Button>
				)}
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="min-w-52">
				<DropdownMenuLabel className="flex flex-row gap-2 items-center">
					<div className="flex flex-col space-y-1">
						<p className="text-base font-medium leading-none">Hey {user?.nick}!</p>
						<p className="text-xs leading-none text-muted-foreground">
							{user?.email}
						</p>
						<p className="text-xs leading-none text-muted-foreground">
							@{user?.name}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator/>
				{user.roles.includes(ROLES.ADMIN) && (
					<DropdownMenuItem asChild>
						<Link href={ROUTES.ADMIN.BASE}>
							<SettingsIcon className="size-4 mr-2"/>
							Admin
						</Link>
					</DropdownMenuItem>
				)}
				<DropdownMenuItem>
					<InfoCircledIcon className="size-4 mr-2"/>
					Support
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<ConfirmDialog
					title="Sign Out"
					description="Are you sure you want to sign out?"
					onConfirm={() => logout()}
				>
					<DropdownMenuItem preventSelect>
						<LogOutIcon className="h-4 w-4 mr-2"/> Sign out
					</DropdownMenuItem>
				</ConfirmDialog>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}