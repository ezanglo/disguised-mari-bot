"use client";

import { listItems } from "@/db/schema";
import useLists from "@/hooks/use-lists";
import { SelectProps } from "@radix-ui/react-select";
import { InferSelectModel } from "drizzle-orm";
import { Combobox } from "./combobox";

export type ContentType = InferSelectModel<typeof listItems>;

type ClassSelectProps = SelectProps & {
	className?: string,
	showAll?: boolean,
}

export function ContentSelect({
	value,
	onValueChange,
}: ClassSelectProps) {
	
	const {data, isLoading} = useLists('content-types')
	
	
	return !isLoading && (
		<Combobox
			placeholder="Select content"
			options={data.map((item: ContentType) => ({label: item.name, value: item.code}))}
			value={value}
			onSelect={onValueChange}
		/>
	)
}