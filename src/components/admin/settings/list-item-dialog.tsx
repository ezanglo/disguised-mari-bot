"use client";

import { insertListItem, updateListItem } from "@/actions/list";
import { ListItemForm, ListItemFormSchema } from "@/components/admin/settings/list-item-form";
import { ListItemType } from "@/components/admin/settings/list-items-table";
import { ListGroupType } from "@/components/admin/settings/lists-selector";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import React, { useState } from "react";
import { toast } from "sonner";

type ListItemDialogProps = {
	data?: ListItemType,
	listGroup: ListGroupType[],
	children?: React.ReactNode
}

export function ListItemDialog({
	data,
	listGroup,
	children
}: ListItemDialogProps) {
	
	const [open, setOpen] = useState(false);
	
	const handleSubmit = async (formData: ListItemFormSchema) => {
		try {
			let result;
			
			if (data) {
				result = await updateListItem(formData);
			} else {
				result = await insertListItem(formData);
			}
			
			if (result) {
				toast.success(data ? "ListItem type updated" : "ListItem type created")
				setOpen(false)
			}
		} catch (error) {
			toast.error((error as Error).message)
		}
	}
	
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{children ? children : (
					<Button variant="outline">{data ? 'Update' : 'Add'}</Button>
				)}
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogTitle>{data ? `Edit ${data.name}` : 'Add List Item'}</DialogTitle>
				<ListItemForm
					defaultValues={data}
					listGroup={listGroup}
					onSubmit={handleSubmit}
				/>
			</DialogContent>
		</Dialog>
	)
}