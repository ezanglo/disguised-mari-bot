"use client";

import { AttributeSelect } from "@/components/attribute-select";
import { ClassSelect } from "@/components/class-select";
import { FileInput } from "@/components/file-input";
import { SubmitButton } from "@/components/submit-button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { monsters } from "@/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInsertSchema } from "drizzle-zod";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = createInsertSchema(monsters, {
	name: z.string().min(1),
	code: z.string().min(1),
	image: z.string().optional(),
	classType: z.string().optional(),
	attributeType: z.string().optional(),
})

export type MonsterFormSchema = z.infer<typeof formSchema>

type MonsterFormProps = {
	onSubmit?: (formData: MonsterFormSchema) => Promise<void>
	defaultValues?: MonsterFormSchema
}

export function MonsterForm({
	defaultValues,
	onSubmit
}: MonsterFormProps) {
	
	const searchParams = useSearchParams();
	
	const form = useForm<MonsterFormSchema>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			...defaultValues,
			classType: searchParams.get("classType") || defaultValues?.classType || "",
			attributeType: searchParams.get("attributeType") || defaultValues?.attributeType || "",
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
								<Input value={field.value} onChange={field.onChange}/>
							</FormControl>
							<FormMessage/>
						</FormItem> 
					)}
				/>
				<FormField
					control={form.control}
					name="code"
					render={({field}) => (
						<FormItem>
							<FormLabel>Code</FormLabel>
							<FormControl>
								<Input  {...field}/>
							</FormControl>
							<FormMessage/>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="classType"
					render={({field}) => (
						<FormItem>
							<FormLabel>Class</FormLabel>
							<FormControl>
								<ClassSelect
									onValueChange={field.onChange}
									value={field.value || ''}
								/>
							</FormControl>
							<FormMessage/>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="attributeType"
					render={({field}) => (
						<FormItem>
							<FormLabel>Attribute</FormLabel>
							<FormControl>
								<AttributeSelect
									onValueChange={field.onChange}
									value={field.value || ''}
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