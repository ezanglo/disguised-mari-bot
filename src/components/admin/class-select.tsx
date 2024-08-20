"use client";

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { classTypes } from "@/db/schema";
import { SelectProps } from "@radix-ui/react-select";
import { InferSelectModel } from "drizzle-orm";
import Image from "next/image";

export type ClassType = InferSelectModel<typeof classTypes>;

type ClassSelectProps = SelectProps & {
	data: ClassType[],
	className?: string,
	showAll?: boolean,
}

export function ClassSelect({
	data,
	className,
	showAll = false,
	...props
}: ClassSelectProps) {
	return (
		<Select {...props}>
			<SelectTrigger className={className}>
				<SelectValue placeholder="Select class"/>
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					{showAll && <SelectItem value={'all'}>Select class</SelectItem>}
					{data.map((item, index) => (
						<SelectItem value={item.code}>
							<div className="flex flex-row gap-2 items-center">
								<Image src={item.image || ''} alt={item.name} width={100} height={100} className="size-5"/>
								{item.name}
							</div>
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	)
}