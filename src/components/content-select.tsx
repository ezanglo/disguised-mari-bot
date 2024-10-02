"use client";

import { listItems } from "@/db/schema";
import useLists from "@/hooks/use-lists";
import { InferSelectModel } from "drizzle-orm";
import { Combobox } from "./combobox";

export type ContentType = InferSelectModel<typeof listItems>;

type ClassSelectProps = {
	value?: string,
	onValueChange?: (value?: string) => void,
	className?: string,
}

export function ContentSelect({
	value,
	onValueChange,
	className
}: ClassSelectProps) {
	
	const {data, isLoading} = useLists('content-types')
	
	const options = !isLoading ? data.map((item: ContentType) => ({
		label: item.name,
		value: item.code,
		image: item.image,
	})) : []
	
	return (
		<Combobox
			placeholder="Select content"
			className={className}
			options={options}
			value={value}
			onValueChange={onValueChange}
		/>
	)
}