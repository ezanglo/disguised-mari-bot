"use client";

import { insertClassType, updateClassType } from "@/actions/class-type";
import { ClassForm, ClassFormSchema } from "@/components/admin/settings/class-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { classTypes } from "@/db/schema/types";
import { InferSelectModel } from "drizzle-orm";
import { useState } from "react";
import { toast } from "sonner";

type ClassDialogProps = {
	data?: InferSelectModel<typeof classTypes>,
	children?: React.ReactNode
}

export function ClassDialog({
	data,
	children
}: ClassDialogProps) {
	const [open, setOpen] = useState(false);
	
	const handleSubmit = async (formData: ClassFormSchema) => {
		try {
			let result;
			
			if(data){
				result = await updateClassType(formData);
			}
			else {
				result = await insertClassType(formData);
			}

			if (result) {
				toast.success(data ? "Class type updated": "Class type created")
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
					<Button>{data ? 'Update': 'Add'}</Button>
				)}
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogTitle>{data ? `Edit ${data.name}` : 'Add Class'}</DialogTitle>
				<ClassForm
					defaultValues={data}
					onSubmit={handleSubmit}
				/>
			</DialogContent>
		</Dialog>
	)
}