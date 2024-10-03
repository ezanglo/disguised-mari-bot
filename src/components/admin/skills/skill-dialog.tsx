"use client";

import { insertSkill, updateSkill } from "@/actions/skill";
import { SkillForm, SkillFormSchema } from "@/components/admin/skills/skill-form";
import { SkillType } from "@/components/admin/skills/skills-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import React, { useState } from "react";
import { toast } from "sonner";

type SkillDialogProps = {
	data?: SkillType,
	children?: React.ReactNode
}

export function SkillDialog({
	data,
	children
}: SkillDialogProps) {
	
	const [open, setOpen] = useState(false);
	
	const handleSubmit = async (formData: SkillFormSchema) => {
		try {
			let result;
			
			if (data) {
				result = await updateSkill(formData);
			} else {
				result = await insertSkill(formData);
			}
			
			if (result) {
				toast.success(data ? "Skill type updated" : "Skill type created")
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
				<DialogTitle>{data ? `Edit ${data.name}` : 'Add Skill'}</DialogTitle>
				<SkillForm
					defaultValues={data}
					onSubmit={handleSubmit}
				/>
			</DialogContent>
		</Dialog>
	)
}