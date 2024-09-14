"use client";

import { HeroForm, HeroFormSchema } from "@/components/admin/settings/hero-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { heroes } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { useState } from "react";
import { toast } from "sonner";
import { TierType } from "../tier-select";
import { ClassType } from "../class-select";
import { AttributeType } from "../attribute-select";
import { insertHero, updateHero } from "@/actions/hero";

type HeroDialogProps = {
	data?: InferSelectModel<typeof heroes>,
	tierTypes: TierType[],
	classTypes: ClassType[],
	attributeTypes: AttributeType[],
	children?: React.ReactNode
}

export function HeroDialog({
	data,
	tierTypes,
	classTypes,
	attributeTypes,
	children
}: HeroDialogProps) {
	const [open, setOpen] = useState(false);
	
	const handleSubmit = async (formData: HeroFormSchema) => {
		try {
			let result;
			
			if(data){
				result = await updateHero(formData);
			}
			else {
				result = await insertHero(formData);
			}

			if (result) {
				toast.success(data ? "Hero updated": "Hero created")
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
				<DialogTitle>{data ? `Edit ${data.name}` : 'Add Hero'}</DialogTitle>
				<HeroForm
					tierTypes={tierTypes}
					classTypes={classTypes}
					attributeTypes={attributeTypes}
					defaultValues={data}
					onSubmit={handleSubmit}
				/>
			</DialogContent>
		</Dialog>
	)
}