"use client";

import { ClassSelect, ClassType } from "@/components/admin/class-select";
import { GearSelect, GearType } from "@/components/admin/gear-select";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

type EquipFiltersProps = {
	classTypes: ClassType[]
	gearTypes: GearType[]
}

export function EquipFilters({
	classTypes,
	gearTypes
}: EquipFiltersProps) {
	
	const router = useRouter();
	const searchParams = useSearchParams();
	const gearType = searchParams.get("gearType") || undefined;
	const classType = searchParams.get("classType") || undefined;
	
	const handleClick = (query: { gearType?: string, classType?: string }) => {
		
		const url = qs.stringifyUrl({
			url: window.location.href,
			query
		}, {skipNull: true})
		
		router.push(url);
	}
	
	return (
		<div className="flex flex-row gap-2 py-2">
			<GearSelect
				showAll
				data={gearTypes}
				defaultValue={gearType || 'all'}
				className="w-40"
				onValueChange={val => handleClick({
					gearType: val === "all" ? undefined : val,
					classType
				})}
			/>
			<ClassSelect
				showAll
				data={classTypes}
				defaultValue={gearType || 'all'}
				className="w-40"
				onValueChange={val => handleClick({
					classType: val === "all" ? undefined : val,
					gearType
				})}
			/>
		</div>
	)
}