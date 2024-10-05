"use client";

import { AttributeSelect } from "@/components/attribute-select";
import { ClassSelect } from "@/components/class-select";
import { ContentSelect } from "@/components/content-select";
import { EnemySelector } from "@/components/enemy-selector";
import { SubmitButton } from "@/components/submit-button";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { contentPhases, enemyTypeEnum } from "@/db/schema";
import { capitalizeFirstLetter } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CaretDownIcon } from "@radix-ui/react-icons";
import { createInsertSchema } from "drizzle-zod";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
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

	const [enemyType, setEnemyType] = useState<EnemyType>('monsters')

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
		}
	}

	const contentType = useWatch({ control: form.control, name: "content" });

	return (
		<Form {...form}>
			<form action={handleSubmit} className="space-y-4">
				<FormField
					control={form.control}
					name="content"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Content</FormLabel>
							<FormControl>
								<ContentSelect value={field.value} onValueChange={field.onChange} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
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
								<Input  {...field} value={field.value || `${contentType}.`} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="grid grid-cols-2 gap-4">
					<FormField
						control={form.control}
						name="classType"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Class</FormLabel>
								<FormControl>
									<ClassSelect value={field.value} onValueChange={field.onChange} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="attributeType"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Attribute</FormLabel>
								<FormControl>
									<AttributeSelect value={field.value} onValueChange={field.onChange} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<FormField
					control={form.control}
					name="enemies"
					render={({ field }) => (
						<FormItem>
							<div className="flex flex-row gap-2 items-center">
								<FormLabel>
									Enemies
								</FormLabel>
								<DropdownMenu>
									<DropdownMenuTrigger>
										<Badge variant="outline">
											{capitalizeFirstLetter(enemyType)} <CaretDownIcon className="size-3"/>
										</Badge>
									</DropdownMenuTrigger>
									<DropdownMenuContent>
										<DropdownMenuItem onSelect={val => setEnemyType('heroes')}>Heroes</DropdownMenuItem>
										<DropdownMenuItem onSelect={val => setEnemyType('monsters')}>Monsters</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
							<FormControl>
								<EnemySelector
									enemyType={enemyType}
									value={field.value || []}
									onValueChange={field.onChange}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<SubmitButton type="submit" className="w-full">Submit</SubmitButton>
			</form>
		</Form>
	)
}