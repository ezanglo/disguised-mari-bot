"use client";

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { listItems } from "@/db/schema";
import useLists from "@/hooks/use-lists";
import { SelectProps } from "@radix-ui/react-select";
import { InferSelectModel } from "drizzle-orm";

export type ListGroupType = InferSelectModel<typeof listItems>;

type ListGroupSelectProps = SelectProps & {
	className?: string,
	showAll?: boolean,
}

export function ListGroupSelect({
	className,
	showAll = false,
	...props
}: ListGroupSelectProps) {
	
	const { data, isLoading } = useLists('list-group')

	return (
		<Select {...props}>
			<SelectTrigger className={className}>
				<SelectValue placeholder="Select a list group" />
			</SelectTrigger>
			<SelectContent>
				{isLoading ? (
					<SelectItem value={'all'}>Loading...</SelectItem>
				) : (
					<SelectGroup>
						{showAll && <SelectItem value={'all'}>Select list group</SelectItem>}
						{data.map((item: ListGroupType, index: number) => (
							<SelectItem key={index} value={item.id}>
								{item.name}
							</SelectItem>
						))}
					</SelectGroup>
				)}
			</SelectContent>
		</Select>
	)
}