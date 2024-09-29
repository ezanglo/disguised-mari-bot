"use client";

import { SubmitButton } from "@/components/submit-button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { listItems } from "@/db/schema/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInsertSchema } from "drizzle-zod";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ListGroupSelect } from "../list-group-select";

const formSchema = createInsertSchema(listItems, {
	name: z.string().min(1),
	listId: z.string().min(1),
	code: z.string().min(1),
})

export type ListItemFormSchema = z.infer<typeof formSchema>

type ListItemFormProps = {
	onSubmit?: (formData: ListItemFormSchema) => Promise<void>
	defaultValues?: ListItemFormSchema
}

export function ListItemForm({
	defaultValues,
	onSubmit
}: ListItemFormProps) {
	
	const searchParams = useSearchParams();
	
	const form = useForm<ListItemFormSchema>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: defaultValues?.id,
			name: defaultValues?.name || '',
			code: defaultValues?.code || '',
			listId: defaultValues?.listId || "",
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
					name="listId"
					render={({field}) => (
						<FormItem>
							<FormLabel>List Group</FormLabel>
							<FormControl>
								<ListGroupSelect value={field.value} onValueChange={field.onChange}/>
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
				<SubmitButton type="submit" className="w-full">Submit</SubmitButton>
			</form>
		</Form>
	)
}