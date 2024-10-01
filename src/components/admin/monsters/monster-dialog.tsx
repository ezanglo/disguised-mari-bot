"use client";

import { insertMonster, updateMonster } from "@/actions/monster";
import { MonsterForm, MonsterFormSchema } from "@/components/admin/monsters/monster-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { monsters } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { useState } from "react";
import { toast } from "sonner";

type MonsterDialogProps = {
	data?: InferSelectModel<typeof monsters>,
	children?: React.ReactNode
}

export function MonsterDialog({
	data,
	children
}: MonsterDialogProps) {
	const [open, setOpen] = useState(false);
	
	const handleSubmit = async (formData: MonsterFormSchema) => {
		try {
			let result;
			
			if(data){
				result = await updateMonster(formData);
			}
			else {
				result = await insertMonster(formData);
			}

			if (result) {
				toast.success(data ? "Monster updated": "Monster created")
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
				<DialogTitle>{data ? `Edit ${data.name}` : 'Add Monster'}</DialogTitle>
				<MonsterForm
					defaultValues={data}
					onSubmit={handleSubmit}
				/>
			</DialogContent>
		</Dialog>
	)
}