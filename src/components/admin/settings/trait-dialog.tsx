"use client";

import { insertTraitType, updateTraitType } from "@/actions/trait-type";
import { TraitTypeForm, TraitTypeFormSchema } from "@/components/admin/settings/trait-form";
import { TraitType } from "@/components/admin/settings/traits-table";
import { UpgradeType } from "@/components/admin/settings/upgrade-types-selector";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import React, { useState } from "react";
import { toast } from "sonner";

type TraitTypeDialogProps = {
	data?: TraitType,
	upgradeTypes: UpgradeType[],
	children?: React.ReactNode
}

export function TraitDialog({
	data,
	upgradeTypes,
	children
}: TraitTypeDialogProps) {
	
	const [open, setOpen] = useState(false);
	
	const handleSubmit = async (formData: TraitTypeFormSchema) => {
		try {
			let result;
			
			if (data) {
				result = await updateTraitType(formData);
			} else {
				result = await insertTraitType(formData);
			}
			
			if (result) {
				toast.success(data ? "TraitType type updated" : "TraitType type created")
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
				<TraitTypeForm
					defaultValues={data}
					upgradeTypes={upgradeTypes}
					onSubmit={handleSubmit}
				/>
			</DialogContent>
		</Dialog>
	)
}