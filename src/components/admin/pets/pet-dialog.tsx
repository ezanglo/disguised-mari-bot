"use client";

import { insertPet, updatePet } from "@/actions/pet";
import { PetForm, PetFormSchema } from "@/components/admin/pets/pet-form";
import { PetType } from "@/components/admin/pets/pets-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import React, { useState } from "react";
import { toast } from "sonner";

type PetDialogProps = {
	data?: PetType,
	children?: React.ReactNode
}

export function PetDialog({
	data,
	children
}: PetDialogProps) {
	
	const [open, setOpen] = useState(false);
	
	const handleSubmit = async (formData: PetFormSchema) => {
		try {
			let result;
			
			if (data) {
				result = await updatePet(formData);
			} else {
				result = await insertPet(formData);
			}
			
			if (result) {
				toast.success(data ? "Pet type updated" : "Pet type created")
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
				<DialogTitle>{data ? `Edit ${data.name}` : 'Add Pet'}</DialogTitle>
				<PetForm
					defaultValues={data}
					onSubmit={handleSubmit}
				/>
			</DialogContent>
		</Dialog>
	)
}