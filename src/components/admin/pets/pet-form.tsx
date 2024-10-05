"use client";

import { FileInput } from "@/components/file-input";
import { HeroSelect } from "@/components/hero-select";
import { SubmitButton } from "@/components/submit-button";
import { TierSelect } from "@/components/tier-select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { enemyTypeEnum, pets } from "@/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInsertSchema } from "drizzle-zod";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

const formSchema = createInsertSchema(pets, {
	name: z.string().min(1),
	hero: z.string().min(1),
	code: z.string().min(1),
	tierType: z.string().min(1),
	image: z.string().optional(),
})

export type PetFormSchema = z.infer<typeof formSchema>

type PetFormProps = {
	onSubmit?: (formData: PetFormSchema) => Promise<void>
	defaultValues?: PetFormSchema
}

export function PetForm({
	defaultValues,
	onSubmit
}: PetFormProps) {
	const searchParams = useSearchParams();

	const form = useForm<PetFormSchema>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			...defaultValues,
			name: defaultValues?.name || '',
			hero: searchParams.get("hero") || defaultValues?.hero || "",
			tierType: searchParams.get("tierType") || defaultValues?.tierType || "",
		},
	})


	const hero = useWatch({ control: form.control, name: "hero" });

	const handleSubmit = async () => {
		const valid = await form.trigger();
		if (valid) {
			onSubmit?.(form.getValues())
		}
	}

	return (
		<Form {...form}>
			<form action={handleSubmit} className="space-y-4">
				<FormField
					control={form.control}
					name="hero"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Hero</FormLabel>
							<FormControl>
								<HeroSelect value={field.value} onValueChange={val => field.onChange(val)}/>
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
					name="code"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Code</FormLabel>
							<FormControl>
								<Input value={field.value || `pet.${hero}`} onChange={field.onChange}/>
							</FormControl>
							<FormMessage />
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