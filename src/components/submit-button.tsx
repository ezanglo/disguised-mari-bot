'use client'

import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from 'lucide-react'
import React from "react";
import { useFormStatus } from 'react-dom'

type SubmitButtonProps = ButtonProps & {
	children: React.ReactNode
}

export function SubmitButton({
	children,
	className,
	...props
}: SubmitButtonProps) {
	
	const {pending} = useFormStatus()
	return (
		<Button {...props} disabled={pending} className={cn(
			"flex gap-3 items-center",
			className
		)}>
			{pending ? <Loader2 className="animate-spin"/> : children}
		</Button>
	)
}