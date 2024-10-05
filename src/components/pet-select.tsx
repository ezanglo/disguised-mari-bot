"use client";

import { pets } from "@/db/schema";
import useLists from "@/hooks/use-lists";
import { InferSelectModel } from "drizzle-orm";
import { Combobox } from "./combobox";

export type PetType = InferSelectModel<typeof pets>;

type ClassSelectProps = {
	value?: string,
	onValueChange?: (value?: string) => void,
	className?: string,
	children?: React.ReactNode,
}

export function PetSelect({
	value,
	onValueChange,
	className,
	children
}: ClassSelectProps) {
	
	const {data, isLoading} = useLists('pets')
	
	const options = !isLoading ? data.map((item: PetType) => ({
		label: item.name,
		value: item.code,
		image: item.image,
	})) : []
	
	
	return (
		<Combobox
			placeholder="Select pet"
			className={className}
			options={options}
			value={value}
			onValueChange={onValueChange}
			trigger={children}
		/>
	)
}