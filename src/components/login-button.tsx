"use client";

import { login } from "@/actions/auth";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FaDiscord } from "react-icons/fa6";

export function LoginButton({
	className
}: ButtonProps) {
	return (
		<Button
			className={cn("rounded-full bg-indigo-500 hover:bg-indigo-500/90 text-white", className)}
			onClick={() => login()}
		>
			<FaDiscord className="size-4 mr-2"/>
			Login
		</Button>
	)
}