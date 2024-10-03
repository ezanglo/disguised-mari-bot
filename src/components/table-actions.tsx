import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal, PencilIcon, TrashIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

type TableActionsProps<T> = {
	data: T;
	EditComponent: React.ComponentType<{ children: React.ReactNode; data: T }>;
	onDelete: (data: T) => void;
	itemName: string;
	revalidateQuery?: string;
};

export function TableActions<T>({ 
	data, 
	EditComponent, 
	onDelete, 
	itemName,
	revalidateQuery
}: TableActionsProps<T>) {
	const queryClient = useQueryClient();
	
	const handleDelete = () => {
		onDelete(data);
		toast.success(`${itemName} deleted successfully`);
		if(revalidateQuery) {
			queryClient.invalidateQueries({ queryKey: [revalidateQuery] })
			queryClient.refetchQueries({ queryKey: [revalidateQuery] });
		}
	};

	const renderActionItem = (isDropdown: boolean) => {
		const editContent = isDropdown ? (
			<DropdownMenuItem preventSelect>
				Edit
			</DropdownMenuItem>
		) : (
			<Button variant="ghost" size="icon">
				<PencilIcon className="size-3" />
			</Button>
		);

		const deleteContent = isDropdown ? (
			<DropdownMenuItem preventSelect className="text-destructive">
				Delete
			</DropdownMenuItem>
		) : (
			<Button variant="ghost" size="icon" className="text-destructive">
				<TrashIcon className="size-3" />
			</Button>
		);

		return (
			<>
				<EditComponent data={data}>
					{editContent}
				</EditComponent>
				<ConfirmDialog
					title={`Delete ${itemName}?`}
					description="This action is permanent and cannot be undone."
					onConfirm={handleDelete}
					variant="destructive"
				>
					{deleteContent}
				</ConfirmDialog>
			</>
		);
	};

	return (
		<>
			<div className="hidden md:flex flex-row gap-2 justify-end">
				{renderActionItem(false)}
			</div>
			<DropdownMenu>
				<DropdownMenuTrigger asChild className="md:hidden">
					<Button
						aria-haspopup="true"
						size="icon"
						variant="ghost"
					>
						<MoreHorizontal className="h-4 w-4" />
						<span className="sr-only">Toggle menu</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					{renderActionItem(true)}
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	)
}