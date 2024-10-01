"use client";

import { Combobox } from "@/components/combobox";
import useLists from "@/hooks/use-lists";
import { MonsterType } from "./admin/monsters/monster-table";

type MonsterSelectProps = {
	value?: string,
	onValueChange?: (value: string) => void,
}

export function MonsterSelect({
	value,
	onValueChange,
}: MonsterSelectProps) {
	
	const {data, isLoading} = useLists('monsters')
	
	return !isLoading && (
		<Combobox
			placeholder="Select monster"
			options={data.map((item: MonsterType) => ({ label: item.name, value: item.code}))}
			onSelect={onValueChange}
		/>
	)
}