"use client";

import { insertTierType, updateTierType } from "@/actions/tier-type";
import { TierForm, TierFormSchema } from "@/components/admin/tiers/tier-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { tierTypes } from "@/db/schema/types";
import { useQueryClient } from "@tanstack/react-query";
import { InferSelectModel } from "drizzle-orm";
import { useState } from "react";
import { toast } from "sonner";

type TierDialogProps = {
	data?: InferSelectModel<typeof tierTypes>,
	children?: React.ReactNode
}

export function TierDialog({
	data,
	children
}: TierDialogProps) {
	const [open, setOpen] = useState(false);
	const queryClient = useQueryClient();
	
	const handleSubmit = async (formData: TierFormSchema) => {
		try {
			let result;
			
			if(data){
				result = await updateTierType(formData);
			}
			else {
				result = await insertTierType(formData);
			}

			if (result) {
				toast.success(data ? "Tier type updated": "Tier type created")
				queryClient.invalidateQueries({ queryKey: ['tiers'] })
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
				<DialogTitle>{data ? `Edit ${data.name}` : 'Add Tier'}</DialogTitle>
				<TierForm
					defaultValues={data}
					onSubmit={handleSubmit}
				/>
			</DialogContent>
		</Dialog>
	)
}