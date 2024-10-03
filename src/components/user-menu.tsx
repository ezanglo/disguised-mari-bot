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
import { ROUTES } from "@/constants/routes";
import { isAuthorized } from "@/lib/utils";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { LogOutIcon, SettingsIcon, UserIcon } from "lucide-react";
import { Session } from "next-auth";
import Link from "next/link";

type UserMenuProps = {
	user: Session['user'],
	iconOnly?: boolean,
	label?: string,
}

export function UserMenu({
	user,
	iconOnly = false,
	label,
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
							<span>{label || `Welcome back, ${user.nick}`}</span>
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
							@{user?.name}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator/>
				{isAuthorized(user) && (
					<DropdownMenuItem asChild>
						<Link href={ROUTES.ADMIN.BASE}>
							<SettingsIcon className="size-4 mr-2"/>
							Admin
						</Link>
					</DropdownMenuItem>
				)}
				{user && (
					<DropdownMenuItem asChild>
						<Link href={ROUTES.PROFILE.BASE(user.name!)}>
							<UserIcon className="size-4 mr-2"/>
							Your Profile
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