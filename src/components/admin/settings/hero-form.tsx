"use client";

import { ClassSelect, ClassType } from "@/components/admin/class-select";
import { GearSelect, GearType } from "@/components/admin/gear-select";
import { FileInput } from "@/components/file-input";
import { SubmitButton } from "@/components/submit-button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { heroes } from "@/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInsertSchema } from "drizzle-zod";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { TierSelect, TierType } from "../tier-select";
import { AttributeSelect, AttributeType } from "../attribute-select";
import { Input } from "@/components/ui/input";
import { ColorPicker } from "@/components/color-picker";
import { useEffect } from "react";
import { log } from "console";
import { toCode } from "@/lib/utils";
import { UploadButton } from "@/components/upload-button";

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
	tierTypes: TierType[],
	classTypes: ClassType[],
	attributeTypes: AttributeType[],
	onSubmit?: (formData: HeroFormSchema) => Promise<void>
	defaultValues?: HeroFormSchema
}

export function HeroForm({
	tierTypes,
	classTypes,
	attributeTypes,
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

	useEffect(() => {
		form.setValue("code", toCode(form.getValues("name")))
	}, [form.formState]);
	
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
									defaultValue={field.value}
									data={tierTypes}
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
					name="attributeType"
					render={({field}) => (
						<FormItem>
							<FormLabel>Attribute</FormLabel>
							<FormControl>
								<AttributeSelect
									onValueChange={field.onChange}
									defaultValue={field.value}
									data={attributeTypes}
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
								<UploadButton onUpload={field.onChange}/>
								{/* <FileInput onValueChange={field.onChange}/> */}
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