"use client";

import { Combobox } from "@/components/combobox";
import { listItems } from "@/db/schema";
import useLists from "@/hooks/use-lists";
import { InferSelectModel } from "drizzle-orm";

export type ListGroupType = InferSelectModel<typeof listItems>;

type ListGroupSelectProps = {
	value?: string,
	onValueChange?: (value?: string) => void,
	className?: string,
}

export function ListGroupSelect({
	value,
	onValueChange,
	className,
}: ListGroupSelectProps) {
	
	const { data, isLoading } = useLists('list-group')
	
	const options = !isLoading ? data.map((item: ListGroupType) => ({
		label: item.name,
		value: item.id,
		image: item.image,
	})) : []
	
	return (
		<Combobox
			placeholder="Select list group"
			className={className}
			options={options}
			value={value}
			onValueChange={onValueChange}
		/>
	)
}