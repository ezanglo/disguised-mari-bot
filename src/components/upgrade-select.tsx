"use client";

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { listItems } from "@/db/schema";
import useLists from "@/hooks/use-lists";
import { SelectProps } from "@radix-ui/react-select";
import { InferSelectModel } from "drizzle-orm";

export type UpgradeType = InferSelectModel<typeof listItems>;

type UpgradeSelectProps = SelectProps & {
	className?: string,
	showAll?: boolean,
}

export function UpgradeSelect({
	className,
	showAll = false,
	...props
}: UpgradeSelectProps) {
	
	const { data, isLoading } = useLists('upgrade-types')

	return (
		<Select {...props}>
			<SelectTrigger className={className}>
				<SelectValue placeholder="Select upgrade type" />
			</SelectTrigger>
			<SelectContent>
				{isLoading ? (
					<SelectItem value={'all'}>Loading...</SelectItem>
				) : (
					<SelectGroup>
						{showAll && <SelectItem value={'all'}>Select gear type</SelectItem>}
						{data.map((item: UpgradeType, index: number) => (
							<SelectItem key={index} value={item.code}>
								{item.name}
							</SelectItem>
						))}
					</SelectGroup>
				)}
			</SelectContent>
		</Select>
	)
}