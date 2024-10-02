"use client";

import { Combobox } from "@/components/combobox";
import { classTypes } from "@/db/schema";
import useLists from "@/hooks/use-lists";
import { InferSelectModel } from "drizzle-orm";

export type ClassType = InferSelectModel<typeof classTypes>;

type ClassSelectProps = {
	value?: string,
	onValueChange?: (value?: string) => void,
	className?: string,
}

export function ClassSelect({
	value,
	onValueChange,
	className,
}: ClassSelectProps) {
	const {data, isLoading} = useLists('classes')
	
	const options = !isLoading ? data.map((item: ClassType) => ({
		label: item.name,
		value: item.code,
		image: item.image,
	})) : []
	
	return (
		<Combobox
			placeholder="Select class"
			className={className}
			options={options}
			value={value}
			onValueChange={onValueChange}
		/>
	)
}