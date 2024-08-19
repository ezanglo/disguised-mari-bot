"use client";

import { ListGroupType } from "@/components/admin/settings/lists-selector";
import { FileInput } from "@/components/file-input";
import { SubmitButton } from "@/components/submit-button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";
import { listItems } from "@/db/schema/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInsertSchema } from "drizzle-zod";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = createInsertSchema(listItems, {
	name: z.string().min(1),
	listId: z.string().min(1),
	code: z.string().min(1),
	image: z.string().optional(),
})

export type ListItemFormSchema = z.infer<typeof formSchema>

type ListItemFormProps = {
	listGroup: ListGroupType[],
	onSubmit?: (formData: ListItemFormSchema) => Promise<void>
	defaultValues?: ListItemFormSchema
}

export function ListItemForm({
	listGroup,
	defaultValues,
	onSubmit
}: ListItemFormProps) {
	
	const searchParams = useSearchParams();
	
	const form = useForm<ListItemFormSchema>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			...defaultValues,
			listId: searchParams.get("listId") || "",
		},
	})
	
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(formData => onSubmit?.(formData))} className="space-y-4">
				<FormField
					control={form.control}
					name="listId"
					render={({field}) => (
						<FormItem>
							<FormLabel>List Group</FormLabel>
							<FormControl>
								<Select onValueChange={field.onChange} defaultValue={field.value}>
									<SelectTrigger>
										<SelectValue placeholder="Select a list group" />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectLabel>List Groups</SelectLabel>
											{listGroup.map((item, index) => (
												<SelectItem value={item.id}>{item.name}</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
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