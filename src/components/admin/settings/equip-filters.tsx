"use client";

import { GearSelect } from "@/components/admin/gear-select";
import { ClassFilter } from "@/components/class-filter";
import { parseAsString, useQueryState } from "nuqs";

export function EquipFilters() {
	
	const [gearType, setGearType] = useQueryState('gearType',
		parseAsString
			.withDefault('all')
			.withOptions({
				shallow: false,
				clearOnDefault: true,
			})
	)

	return (
		<div className="flex flex-row gap-2">
			<GearSelect
				showAll
				defaultValue={gearType || 'all'}
				className="w-40"
				onValueChange={setGearType}
			/>
			<ClassFilter />
		</div>
	)
}