"use client";

import { Combobox } from "@/components/combobox";
import { listItems } from "@/db/schema";
import useLists from "@/hooks/use-lists";
import { InferSelectModel } from "drizzle-orm";

export type GearType = InferSelectModel<typeof listItems>;

type GearSelectProps = {
	value?: string,
	onValueChange?: (value?: string) => void,
	className?: string,
}

export function GearSelect({
	value,
	onValueChange,
	className,
}: GearSelectProps) {
	
	const {data, isLoading} = useLists('gears')
	
	const options = !isLoading ? data.map((item: GearType) => ({
		label: item.name,
		value: item.code,
		image: item.image,
	})) : []
	
	return (
		<Combobox
			placeholder="Select gear"
			className={className}
			options={options}
			value={value}
			onValueChange={onValueChange}
		/>
	)
}