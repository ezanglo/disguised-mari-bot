"use client";

import { FileInput } from "@/components/file-input";
import { SubmitButton } from "@/components/submit-button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UpgradeSelect } from "@/components/upgrade-select";
import { traitTypes } from "@/db/schema/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInsertSchema } from "drizzle-zod";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = createInsertSchema(traitTypes, {
	name: z.string().min(1),
	upgradeType: z.string().min(1),
	code: z.string().min(1),
	image: z.string().optional(),
})

export type TraitFormSchema = z.infer<typeof formSchema>

type TraitFormProps = {
	onSubmit?: (formData: TraitFormSchema) => Promise<void>
	defaultValues?: TraitFormSchema
}

export function TraitForm({
	defaultValues,
	onSubmit
}: TraitFormProps) {
	
	const searchParams = useSearchParams();
	
	const form = useForm<TraitFormSchema>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: defaultValues?.id,
			name: defaultValues?.name || '',
			image: defaultValues?.image || '',
			code: defaultValues?.code || '',
			upgradeType: searchParams.get("upgradeType") || defaultValues?.upgradeType ||"",
		},
	})

	const handleSubmit = async () => {
    const valid = await form.trigger();
		if(valid){
			onSubmit?.(form.getValues())
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
								<Input {...field} />
							</FormControl>
							<FormMessage/>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="upgradeType"
					render={({field}) => (
						<FormItem>
							<FormLabel>Upgrade Type</FormLabel>
							<FormControl>
								<UpgradeSelect value={field.value} onValueChange={field.onChange} />
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
								<Input {...field}/>
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