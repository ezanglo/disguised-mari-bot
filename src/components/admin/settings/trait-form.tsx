"use client";

import { UpgradeType } from "@/components/admin/settings/upgrade-types-selector";
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
	upgradeTypes: UpgradeType[],
	onSubmit?: (formData: TraitFormSchema) => Promise<void>
	defaultValues?: TraitFormSchema
}

export function TraitForm({
	upgradeTypes,
	defaultValues,
	onSubmit
}: TraitFormProps) {
	
	const searchParams = useSearchParams();
	
	const form = useForm<TraitFormSchema>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			...defaultValues,
			upgradeType: searchParams.get("upgradeType") || defaultValues?.upgradeType ||"",
		},
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
								<Select onValueChange={field.onChange} defaultValue={field.value}>
									<SelectTrigger>
										<SelectValue placeholder="Select upgrade type" />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectLabel>Upgrade Types</SelectLabel>
											{upgradeTypes.map((item, index) => (
												<SelectItem key={index} value={item.code}>{item.name}</SelectItem>
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