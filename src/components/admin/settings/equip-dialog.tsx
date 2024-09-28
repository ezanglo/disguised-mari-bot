"use client";

import { insertEquip, updateEquip } from "@/actions/equip-type";
import { EquipForm, EquipFormSchema } from "@/components/admin/settings/equip-form";
import { EquipType } from "@/components/admin/settings/equips-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import React, { useState } from "react";
import { toast } from "sonner";

type EquipDialogProps = {
	data?: EquipType,
	children?: React.ReactNode
}

export function EquipDialog({
	data,
	children
}: EquipDialogProps) {
	
	const [open, setOpen] = useState(false);
	
	const handleSubmit = async (formData: EquipFormSchema) => {
		try {
			
			let result;
			
			if (data) {
				result = await updateEquip(formData);
			} else {
				result = await insertEquip(formData);
			}
			
			if (result) {
				toast.success(data ? "Equip type updated" : "Equip type created")
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
				<DialogTitle>{data ? `Edit Equip` : 'Add Equip'}</DialogTitle>
				<EquipForm
					defaultValues={data}
					onSubmit={handleSubmit}
				/>
			</DialogContent>
		</Dialog>
	)
}