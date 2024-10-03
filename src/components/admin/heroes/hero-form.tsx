"use client";

import { AttributeSelect } from "@/components/attribute-select";
import { ClassSelect } from "@/components/class-select";
import { ColorPicker } from "@/components/color-picker";
import { FileInput } from "@/components/file-input";
import { SubmitButton } from "@/components/submit-button";
import { TierSelect } from "@/components/tier-select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { heroes } from "@/db/schema";
import { toCode } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInsertSchema } from "drizzle-zod";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

const formSchema = createInsertSchema(heroes, {
	name: z.string().min(1),
	displayName: z.string().min(1),
	code: z.string().min(1),
	color: z.string().optional(),
	tierType: z.string().min(1),
	classType: z.string().min(1),
	attributeType: z.string().min(1),
	image: z.string().optional(),
})

export type HeroFormSchema = z.infer<typeof formSchema>

type HeroFormProps = {
	onSubmit?: (formData: HeroFormSchema) => Promise<void>
	defaultValues?: HeroFormSchema
}

export function HeroForm({
	defaultValues,
	onSubmit
}: HeroFormProps) {
	
	const searchParams = useSearchParams();
	
	const form = useForm<HeroFormSchema>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			...defaultValues,
			tierType: searchParams.get("tierType") || defaultValues?.tierType || "",
			classType: searchParams.get("classType") || defaultValues?.classType || "",
			attributeType: searchParams.get("attributeType") || defaultValues?.attributeType || "",
		},
	})

	const name = useWatch({ control: form.control, name: "name" });

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
					name="displayName"
					render={({field}) => (
						<FormItem>
							<FormLabel>Display Name</FormLabel>
							<FormControl>
								<Input {...field}	/>
							</FormControl>
							<FormMessage/>
						</FormItem> 
					)}
				/>
				<FormField
					control={form.control}
					name="code"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Code</FormLabel>
							<FormControl>
								<Input  {...field} value={field.value || toCode(name)}/>
							</FormControl>
							<FormMessage />
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
					name="tierType"
					render={({field}) => (
						<FormItem>
							<FormLabel>Tier</FormLabel>
							<FormControl>
								<TierSelect
									onValueChange={field.onChange}
									value={field.value}
								/>
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
									value={field.value}
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
									value={field.value}
									onValueChange={field.onChange}
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