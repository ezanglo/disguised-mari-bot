"use client";

import { Combobox } from "@/components/combobox";
import { listItems } from "@/db/schema";
import useLists from "@/hooks/use-lists";
import { InferSelectModel } from "drizzle-orm";

export type UpgradeType = InferSelectModel<typeof listItems>;

type UpgradeSelectProps = {
	value?: string,
	onValueChange?: (value?: string) => void,
	className?: string,
}

export function UpgradeSelect({
	value,
	onValueChange,
	className,
}: UpgradeSelectProps) {
	
	const { data, isLoading } = useLists('upgrade-types')
	
	const options = !isLoading ? data.map((item: UpgradeType) => ({
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