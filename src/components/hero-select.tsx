"use client";

import { HeroType } from "@/components/admin/heroes/heroes-table";
import { Combobox } from "@/components/combobox";
import useLists from "@/hooks/use-lists";

type HeroSelectProps = {
	value?: string,
	onValueChange?: (value?: string) => void,
	className?: string,
}

export function HeroSelect({
	value,
	onValueChange,
	className,
}: HeroSelectProps) {
	
	const {data, isLoading} = useLists('heroes')
	
	const options = !isLoading ? data.map((item: HeroType) => ({
		label: item.name,
		value: item.code,
		image: item.image,
	})) : []
	
	return (
		<Combobox
			placeholder="Select hero"
			className={className}
			options={options}
			value={value}
			onValueChange={onValueChange}
		/>
	)
}