"use client";

import { ClassSelect, ClassType } from "@/components/admin/class-select";
import { GearSelect, GearType } from "@/components/admin/gear-select";
import { FileInput } from "@/components/file-input";
import { SubmitButton } from "@/components/submit-button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { equipTypes } from "@/db/schema/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInsertSchema } from "drizzle-zod";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = createInsertSchema(equipTypes, {
	classType: z.string().min(1),
	gearType: z.string().min(1),
	image: z.string().optional(),
})

export type EquipFormSchema = z.infer<typeof formSchema>

type EquipFormProps = {
	classTypes: ClassType[],
	gearTypes: GearType[],
	onSubmit?: (formData: EquipFormSchema) => Promise<void>
	defaultValues?: EquipFormSchema
}

export function EquipForm({
	classTypes,
	gearTypes,
	defaultValues,
	onSubmit
}: EquipFormProps) {
	
	const searchParams = useSearchParams();
	
	const form = useForm<EquipFormSchema>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			...defaultValues,
			gearType: searchParams.get("gearType") || defaultValues?.gearType || "",
			classType: searchParams.get("classType") || defaultValues?.classType || "",
		},
	})
	
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(formData => onSubmit?.(formData))} className="space-y-4">
				<FormField
					control={form.control}
					name="classType"
					render={({field}) => (
						<FormItem>
							<FormLabel>Class</FormLabel>
							<FormControl>
								<ClassSelect
									onValueChange={field.onChange}
									defaultValue={field.value}
									data={classTypes}
								/>
							</FormControl>
							<FormMessage/>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="gearType"
					render={({field}) => (
						<FormItem>
							<FormLabel>Gear Type</FormLabel>
							<FormControl>
								<GearSelect
									onValueChange={field.onChange}
									defaultValue={field.value}
									data={gearTypes}
								/>
							</FormControl>
							<FormMessage/>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="image"
					render={({field}) => (
						<FormItem>
							<div className="flex flex-row gap-2 items-center">
								<FormLabel>Image</FormLabel>
								{field.value && <Image src={field.value} alt={''} width={100} height={100} className="size-4"/>}
							</div>
							<FormControl>
								<FileInput onValueChange={field.onChange}/>
							</FormControl>
							<FormMessage/>
						</FormItem>
					)}
				/>
				<SubmitButton type="submit" className="w-full">Submit</SubmitButton>
			</form>
		</Form>
	)
}