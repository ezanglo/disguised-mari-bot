"use client";

import { insertContent, updateContent } from "@/actions/content";
import { ContentForm, ContentFormSchema } from "@/components/admin/contents/content-form";
import { ContentType } from "@/components/admin/contents/contents-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import React, { useState } from "react";
import { toast } from "sonner";

type ContentDialogProps = {
	data?: ContentType,
	children?: React.ReactNode
}

export function ContentDialog({
	data,
	children
}: ContentDialogProps) {
	
	const [open, setOpen] = useState(false);
	
	const handleSubmit = async (formData: ContentFormSchema) => {
		try {
			let result;
			
			if (data) {
				result = await updateContent(formData);
			} else {
				result = await insertContent(formData);
			}
			
			if (result) {
				toast.success(data ? "Content type updated" : "Content type created")
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
				<DialogTitle>{data ? `Edit ${data.name}` : 'Add Content'}</DialogTitle>
				<ContentForm
					defaultValues={data}
					onSubmit={handleSubmit}
				/>
			</DialogContent>
		</Dialog>
	)
}