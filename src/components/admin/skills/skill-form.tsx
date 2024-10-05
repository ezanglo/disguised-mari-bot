"use client";

import { FileInput } from "@/components/file-input";
import { HeroSelect } from "@/components/hero-select";
import { SkillTypeSelect } from "@/components/skill-type-select";
import { SubmitButton } from "@/components/submit-button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UpgradeSelect } from "@/components/upgrade-select";
import { skills } from "@/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInsertSchema } from "drizzle-zod";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = createInsertSchema(skills, {
	name: z.string().min(1),
	hero: z.string().min(1),
	upgradeType: z.string().min(1),
	skillType: z.string().min(1),
	code: z.string().min(1),
	image: z.string().optional(),
})

export type SkillFormSchema = z.infer<typeof formSchema>

type SkillFormProps = {
	onSubmit?: (formData: SkillFormSchema) => Promise<void>
	defaultValues?: SkillFormSchema
}

export function SkillForm({
	defaultValues,
	onSubmit
}: SkillFormProps) {
	
	const searchParams = useSearchParams();
	
	const form = useForm<SkillFormSchema>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: defaultValues?.id,
			name: defaultValues?.name || '',
			image: defaultValues?.image || '',
			code: defaultValues?.code || '',
			hero: searchParams.get("hero") || defaultValues?.hero || "",
			skillType: searchParams.get("skillType") || defaultValues?.skillType ||"",
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
					name="skillType"
					render={({field}) => (
						<FormItem>
							<FormLabel>Skill Type</FormLabel>
							<FormControl>
								<SkillTypeSelect value={field.value} onValueChange={field.onChange} />
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