"use client";

import { Combobox } from "@/components/combobox";
import { attributeTypes } from "@/db/schema";
import useLists from "@/hooks/use-lists";
import { InferSelectModel } from "drizzle-orm";

export type AttributeType = InferSelectModel<typeof attributeTypes>;

type AttributeSelectProps = {
	value?: string,
	onValueChange?: (value?: string) => void,
	className?: string,
}

export function AttributeSelect({
	value,
	onValueChange,
	className
}: AttributeSelectProps) {
	const {data, isLoading} = useLists('attributes')
	
	const options = !isLoading ? data.map((item: AttributeType) => ({
		label: item.name,
		value: item.code,
		image: item.image,
	})) : []
	
	return (
		<Combobox
			placeholder="Select attribute"
			className={className}
			options={options}
			value={value}
			onValueChange={onValueChange}
		/>
	)
}