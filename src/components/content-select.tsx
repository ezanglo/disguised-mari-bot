"use client";

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { listItems } from "@/db/schema";
import useLists from "@/hooks/use-lists";
import { SelectProps } from "@radix-ui/react-select";
import { InferSelectModel } from "drizzle-orm";

export type ContentType = InferSelectModel<typeof listItems>;

type ClassSelectProps = SelectProps & {
	className?: string,
	showAll?: boolean,
}

export function ContentSelect({
	className,
	showAll = false,
	...props
}: ClassSelectProps) {
	
	const { data, isLoading } = useLists('content-types')

	return (
		<Select {...props}>
			<SelectTrigger className={className}>
				<SelectValue placeholder="Select content type" />
			</SelectTrigger>
			<SelectContent>
				{isLoading ? (
					<SelectItem value={'all'}>Loading...</SelectItem>
				) : (
					<SelectGroup>
						{showAll && <SelectItem value={'all'}>Select content type</SelectItem>}
						{data.map((item: ContentType, index: number) => (
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