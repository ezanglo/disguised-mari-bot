"use client";

import { Combobox } from "@/components/combobox";
import { tierTypes } from "@/db/schema";
import useLists from "@/hooks/use-lists";
import { InferSelectModel } from "drizzle-orm";

export type TierType = InferSelectModel<typeof tierTypes>;

type TierSelectProps = {
	value?: string,
	onValueChange?: (value?: string) => void,
	className?: string,
}

export function TierSelect({
	value,
	onValueChange,
	className,
}: TierSelectProps) {

  const { data, isLoading } = useLists('tiers')
	
	const options = !isLoading ? data.map((item: TierType) => ({
		label: item.name,
		value: item.code,
		image: item.image,
	})) : []
	
	return (
		<Combobox
			placeholder="Select tier"
			className={className}
			options={options}
			value={value}
			onValueChange={onValueChange}
		/>
	)
}