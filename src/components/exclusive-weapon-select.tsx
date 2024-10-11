"use client";

import { Combobox } from "@/components/combobox";
import { listItems } from "@/db/schema";
import useLists from "@/hooks/use-lists";
import { InferSelectModel } from "drizzle-orm";
import { EquipType } from "./admin/equips/equips-table";

export type UpgradeType = InferSelectModel<typeof listItems>;

type ExclusiveWeaponSelectProps = {
	value?: string,
	onValueChange?: (value?: string) => void,
	classType?: string,
	className?: string,
	children?: React.ReactNode,
}

export function ExclusiveWeaponSelect({
	value,
	onValueChange,
	className,
	children,
	classType
}: ExclusiveWeaponSelectProps) {
	
	const { data, isLoading } = useLists('exclusive-weapons', {
		...(classType && { classType } )
	})
	
	const options = !isLoading ? data.map((item: EquipType) => ({
		label: item.name,
		value: item.id,
		image: item.image,
	})) : []
	
	return (
		<Combobox
			placeholder="Select weapon"
			className={className}
			options={options}
			value={value}
			onValueChange={onValueChange}
			trigger={children}
		/>
	)
}