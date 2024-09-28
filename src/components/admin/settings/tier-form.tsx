"use client";

import { FileInput } from "@/components/file-input";
import { SubmitButton } from "@/components/submit-button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { tierTypes } from "@/db/schema/types";
import { toCode } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInsertSchema } from "drizzle-zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = createInsertSchema(tierTypes, {
	name: z.string().min(1),
	image: z.string().optional(),
})

export type TierFormSchema = z.infer<typeof formSchema>

type TierFormProps = {
	onSubmit?: (formData: TierFormSchema) => Promise<void>
	defaultValues?: TierFormSchema
}

export function TierForm({
	defaultValues,
	onSubmit
}: TierFormProps) {
	
	const form = useForm<TierFormSchema>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			code: toCode(defaultValues?.name ?? ""),
			...defaultValues
		}
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
								<Input placeholder="SR" {...field} />
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