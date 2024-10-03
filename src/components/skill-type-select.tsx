"use client";

import { Combobox } from "@/components/combobox";
import { listItems } from "@/db/schema";
import useLists from "@/hooks/use-lists";
import { InferSelectModel } from "drizzle-orm";

export type SkillType = InferSelectModel<typeof listItems>;

type SkillTypeSelectProps = {
	value?: string,
	onValueChange?: (value?: string) => void,
	className?: string,
}

export function SkillTypeSelect({
	value,
	onValueChange,
	className,
}: SkillTypeSelectProps) {
	
	const { data, isLoading } = useLists('skill-types')
	
	const options = !isLoading ? data.map((item: SkillType) => ({
		label: item.name,
		value: item.code,
		image: item.image,
	})) : []
	
	return (
		<Combobox
			placeholder="Select skill"
			className={className}
			options={options}
			value={value}
			onValueChange={onValueChange}
		/>
	)
}