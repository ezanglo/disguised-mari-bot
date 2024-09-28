"use client";

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { listItems } from "@/db/schema";
import useLists from "@/hooks/use-lists";
import { SelectProps } from "@radix-ui/react-select";
import { InferSelectModel } from "drizzle-orm";

export type GearType = InferSelectModel<typeof listItems>;

type ClassSelectProps = SelectProps & {
	className?: string,
	showAll?: boolean,
}

export function GearSelect({
	className,
	showAll = false,
	...props
}: ClassSelectProps) {
	
	const { data, isLoading } = useLists('gears')

	return (
		<Select {...props}>
			<SelectTrigger className={className}>
				<SelectValue placeholder="Select gear type" />
			</SelectTrigger>
			<SelectContent>
				{isLoading ? (
					<SelectItem value={'all'}>Loading...</SelectItem>
				) : (
					<SelectGroup>
						{showAll && <SelectItem value={'all'}>Select gear type</SelectItem>}
						{data.map((item: GearType, index: number) => (
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