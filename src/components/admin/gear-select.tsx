"use client";

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { listItems } from "@/db/schema";
import { SelectProps } from "@radix-ui/react-select";
import { InferSelectModel } from "drizzle-orm";

export type GearType = InferSelectModel<typeof listItems>;

type ClassSelectProps = SelectProps & {
	data: GearType[],
	className?: string,
	showAll?: boolean,
}

export function GearSelect({
	data,
	className,
	showAll = false,
	...props
}: ClassSelectProps) {
	return (
		<Select {...props}>
			<SelectTrigger className={className}>
				<SelectValue placeholder="Select gear type"/>
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					{showAll && <SelectItem value={'all'}>Select gear type</SelectItem>}
					{data.map((item, index) => (
						<SelectItem key={index} value={item.code}>
							{item.name}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	)
}