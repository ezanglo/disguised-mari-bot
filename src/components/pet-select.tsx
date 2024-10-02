"use client";

import { pets } from "@/db/schema";
import useLists from "@/hooks/use-lists";
import { SelectProps } from "@radix-ui/react-select";
import { InferSelectModel } from "drizzle-orm";
import { Combobox } from "./combobox";

export type PetType = InferSelectModel<typeof pets>;

type ClassSelectProps = SelectProps & {
	className?: string,
	showAll?: boolean,
}

export function PetSelect({
	value,
	onValueChange,
}: ClassSelectProps) {
	
	const {data, isLoading} = useLists('pets')
	
	
	return !isLoading && (
		<Combobox
			placeholder="Select pet"
			options={data.map((item: PetType) => ({label: item.name, value: item.code}))}
			value={value}
			onSelect={onValueChange}
		/>
	)
}