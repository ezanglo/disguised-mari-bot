"use client";

import { logout } from "@/actions/auth";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
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
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { LogOutIcon, SettingsIcon } from "lucide-react";
import { User } from "next-auth";

type UserMenuProps = {
	user: User
}

export function UserMenu({
	user
}: UserMenuProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="hidden md:block">
					<div className="flex flex-row gap-2 items-center">
						<span>Welcome back, @{user.name}</span>
						<Avatar className="size-10 md:size-6">
							<AvatarImage src={user.image || ''} alt={user.name || ''}/>
						</Avatar>
					</div>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="min-w-52">
				<DropdownMenuLabel className="flex flex-row gap-2 items-center">
					<div className="flex flex-col space-y-1">
						<p className="text-base font-medium leading-none">@{user?.name}</p>
						<p className="text-xs leading-none text-muted-foreground">
							{user?.email}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator/>
				<DropdownMenuItem>
					<SettingsIcon className="size-4 mr-2"/>
					Settings
				</DropdownMenuItem>
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