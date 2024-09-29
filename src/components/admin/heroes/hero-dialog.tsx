"use client";

import { insertHero, updateHero } from "@/actions/hero";
import { HeroForm, HeroFormSchema } from "@/components/admin/heroes/hero-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { heroes } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { useState } from "react";
import { toast } from "sonner";

type HeroDialogProps = {
	data?: InferSelectModel<typeof heroes>,
	children?: React.ReactNode
}

export function HeroDialog({
	data,
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
					<Button variant={'outline'}>{data ? 'Update': 'Add'}</Button>
				)}
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogTitle>{data ? `Edit ${data.name}` : 'Add Hero'}</DialogTitle>
				<HeroForm
					defaultValues={data}
					onSubmit={handleSubmit}
				/>
			</DialogContent>
		</Dialog>
	)
}