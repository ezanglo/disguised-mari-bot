"use client";

import { insertAttributeType, updateAttributeType } from "@/actions/attribute-type";
import { AttributeForm, AttributeFormSchema } from "@/components/admin/settings/attribute-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { attributeTypes } from "@/db/schema/types";
import { InferSelectModel } from "drizzle-orm";
import { useState } from "react";
import { toast } from "sonner";

type AttributeDialogProps = {
	data?: InferSelectModel<typeof attributeTypes>,
	children?: React.ReactNode
}

export function AttributeDialog({
	data,
	children
}: AttributeDialogProps) {
	const [open, setOpen] = useState(false);
	
	const handleSubmit = async (formData: AttributeFormSchema) => {
		try {
			let result;
			
			if(data){
				result = await updateAttributeType(formData);
			}
			else {
				result = await insertAttributeType(formData);
			}

			if (result) {
				toast.success(data ? "Attribute type updated": "Attribute type created")
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
					<Button variant="outline">{data ? 'Update': 'Add'}</Button>
				)}
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogTitle>{data ? `Edit ${data.name}` : 'Add Attribute'}</DialogTitle>
				<AttributeForm
					defaultValues={data}
					onSubmit={handleSubmit}
				/>
			</DialogContent>
		</Dialog>
	)
}