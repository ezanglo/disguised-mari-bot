"use client";

import { ClassFilter } from "@/components/class-filter";
import { GearSelect } from "@/components/gear-select";
import { parseAsString, useQueryState } from "nuqs";

export function EquipFilters() {
	
	const [gearType, setGearType] = useQueryState('gearType',
		parseAsString
			.withDefault('')
			.withOptions({
				shallow: false,
				clearOnDefault: true,
			})
	)

	return (
		<div className="flex flex-row gap-2">
			<GearSelect
				value={gearType}
				className="w-40"
				onValueChange={val => setGearType(val || '')}
			/>
			<ClassFilter />
		</div>
	)
}