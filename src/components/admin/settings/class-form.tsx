"use client";

import { ColorPicker } from "@/components/color-picker";
import { FileInput } from "@/components/file-input";
import { SubmitButton } from "@/components/submit-button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { classTypes } from "@/db/schema/types";
import { toCode } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInsertSchema } from "drizzle-zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = createInsertSchema(classTypes, {
	name: z.string().min(1),
	color: z.string().optional(),
	image: z.string().optional(),
})

export type ClassFormSchema = z.infer<typeof formSchema>

type ClassFormProps = {
	onSubmit?: (formData: ClassFormSchema) => Promise<void>
	defaultValues?: ClassFormSchema
}

export function ClassForm({
	defaultValues,
	onSubmit
}: ClassFormProps) {
	
	const form = useForm<ClassFormSchema>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			code: toCode(defaultValues?.name ?? ""),
			...defaultValues
		},
	})

	const handleSubmit = async () => {
    const valid = await form.trigger();
		if(valid){
			onSubmit?.(form.getValues())
		}
		else {
			form.reset();
		}
	}
	
	return (
		<Form {...form}>
			<form action={handleSubmit} className="space-y-4">
				<FormField
					control={form.control}
					name="name"
					render={({field}) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input placeholder="Assault" {...field} />
							</FormControl>
							<FormMessage/>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="color"
					render={({field}) => (
						<FormItem>
							<FormLabel>Color</FormLabel>
							<FormControl>
								<ColorPicker value={field.value || ''} onChange={field.onChange} className="w-full"/>
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