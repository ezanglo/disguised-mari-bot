"use client";

import { FileInput } from "@/components/file-input";
import { SubmitButton } from "@/components/submit-button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { classTypes } from "@/db/schema/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInsertSchema } from "drizzle-zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = createInsertSchema(classTypes, {
	name: z.string().min(1),
	image: z.string().optional(),
})

export type AttributeFormSchema = z.infer<typeof formSchema>

type AttributeFormProps = {
	onSubmit?: (formData: AttributeFormSchema) => Promise<void>
	defaultValues?: AttributeFormSchema
}

export function AttributeForm({
	defaultValues,
	onSubmit
}: AttributeFormProps) {
	
	const form = useForm<AttributeFormSchema>({
		resolver: zodResolver(formSchema),
		defaultValues,
	})
	
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(formData => onSubmit?.(formData))} className="space-y-4">
				<FormField
					control={form.control}
					name="name"
					render={({field}) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input placeholder="Karma.." {...field} />
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