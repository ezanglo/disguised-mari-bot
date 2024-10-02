"use client";

import { MonsterType } from "@/components/admin/monsters/monster-table";
import { Combobox } from "@/components/combobox";
import useLists from "@/hooks/use-lists";

type MonsterSelectProps = {
	value?: string,
	onValueChange?: (value?: string) => void,
	className?: string,
}

export function MonsterSelect({
	value,
	onValueChange,
	className
}: MonsterSelectProps) {
	
	const {data, isLoading} = useLists('monsters')
	
	const options = !isLoading ? data.map((item: MonsterType) => ({
		label: item.name,
		value: item.code,
		image: item.image,
	})) : []
	
	
	return (
		<Combobox
			placeholder="Select monster"
			className={className}
			options={options}
			value={value}
			onValueChange={onValueChange}
		/>
	)
}