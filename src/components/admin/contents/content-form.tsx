"use client";

import { AttributeSelect } from "@/components/attribute-select";
import { ClassSelect } from "@/components/class-select";
import { ContentSelect } from "@/components/content-select";
import { EnemySelector } from "@/components/enemy-selector";
import { SubmitButton } from "@/components/submit-button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { contentPhases, enemyTypeEnum } from "@/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInsertSchema } from "drizzle-zod";
import { useSearchParams } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

type EnemyType = typeof enemyTypeEnum.enumValues[number];

const formSchema = createInsertSchema(contentPhases, {
	name: z.string().min(1),
	content: z.string().min(1),
	code: z.string().min(1),
	classType: z.string().min(1),
	attributeType: z.string().min(1),
	enemyType: z.enum(enemyTypeEnum.enumValues as [EnemyType, ...EnemyType[]]).optional(),
	enemies: z.array(z.string()).optional()
})

export type ContentFormSchema = z.infer<typeof formSchema>

type ContentFormProps = {
	onSubmit?: (formData: ContentFormSchema) => Promise<void>
	defaultValues?: ContentFormSchema
}

export function ContentForm({
	defaultValues,
	onSubmit
}: ContentFormProps) {
	
	const searchParams = useSearchParams();
	
	const form = useForm<ContentFormSchema>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: defaultValues?.id,
			name: defaultValues?.name || '',
			code: defaultValues?.code || '',
			content: searchParams.get("contentType") || defaultValues?.content || "",
			classType: defaultValues?.classType || '',
			attributeType: defaultValues?.attributeType || '',
			enemyType: defaultValues?.enemyType,
			enemies: defaultValues?.enemies || [],
		},
	})
	
	const handleSubmit = async () => {
		const valid = await form.trigger();
		if (valid) {
			onSubmit?.(form.getValues())
		} else {
			form.reset();
		}
	}
	
	
	const enemyType = useWatch({control: form.control, name: "enemyType"});
	
	return (
		<Form {...form}>
			<form action={handleSubmit} className="space-y-4">
				<FormField
					control={form.control}
					name="content"
					render={({field}) => (
						<FormItem>
							<FormLabel>Content</FormLabel>
							<FormControl>
								<ContentSelect value={field.value} onValueChange={field.onChange}/>
							</FormControl>
							<FormMessage/>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="name"
					render={({field}) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input {...field} />
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
								<Input {...field} />
							</FormControl>
							<FormMessage/>
						</FormItem>
					)}
				/>
				<div className="grid grid-cols-2 gap-4">
					<FormField
						control={form.control}
						name="classType"
						render={({field}) => (
							<FormItem>
								<FormLabel>Class</FormLabel>
								<FormControl>
									<ClassSelect value={field.value} onValueChange={field.onChange}/>
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
									<AttributeSelect value={field.value} onValueChange={field.onChange}/>
								</FormControl>
								<FormMessage/>
							</FormItem>
						)}
					/>
				</div>
				<FormField
					control={form.control}
					name="enemyType"
					render={({field}) => (
						<FormItem>
							<FormLabel>Enemy Type</FormLabel>
							<FormControl>
								<Select value={field.value || ''} onValueChange={field.onChange}>
									<SelectTrigger>
										<SelectValue placeholder="Select enemy type"/>
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectItem value="monsters">Monster</SelectItem>
											<SelectItem value="heroes">Heroes</SelectItem>
										</SelectGroup>
									</SelectContent>
								</Select>
							</FormControl>
							<FormMessage/>
						</FormItem>
					)}
				/>
				{enemyType && (<FormField
					control={form.control}
					name="enemies"
					render={({field}) => (
						<FormItem>
							<FormLabel>Enemies</FormLabel>
							<FormControl>
								<EnemySelector
									enemyType={enemyType}
									value={field.value || []}
									onValueChange={field.onChange}
								/>
							</FormControl>
							<FormMessage/>
						</FormItem>
					)}
				/>)}
				<SubmitButton type="submit" className="w-full">Submit</SubmitButton>
			</form>
		</Form>
	)
}