"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import React from "react";

type ConfirmDialogProps = {
	open?: boolean,
	onOpenChange?: (open: boolean) => void,
	onConfirm?: () => void,
	title?: string,
	description?: string,
	action?: string,
	children?: React.ReactNode;
	className?: string;
	loading?: boolean
} & VariantProps<typeof buttonVariants>

export function ConfirmDialog({
	open,
	onOpenChange,
	onConfirm,
	variant,
	title = 'Confirm',
	description = 'Are you sure?',
	action = 'Confirm',
	loading = false,
	children
}: ConfirmDialogProps) {
	
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			{children && (
				<AlertDialogTrigger asChild>
					{children}
				</AlertDialogTrigger>
			)}
			<AlertDialogContent className="max-w-md p-7 rounded-lg">
				<AlertDialogHeader>
					<AlertDialogTitle className="font-medium text-xl">{title}</AlertDialogTitle>
					<AlertDialogDescription>
						{description}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						variant={variant}
						onClick={onConfirm}
					>
						{loading ? <Loader2 className="animate-spin"/> : action}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}