"use client";

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { tierTypes } from "@/db/schema";
import { SelectProps } from "@radix-ui/react-select";
import { InferSelectModel } from "drizzle-orm";
import Image from "next/image";

export type TierType = InferSelectModel<typeof tierTypes>;

type TierSelectProps = SelectProps & {
	data: TierType[],
	className?: string,
	showAll?: boolean,
}

export function TierSelect({
	data,
	className,
	showAll = false,
	...props
}: TierSelectProps) {
	return (
		<Select {...props}>
			<SelectTrigger className={className}>
				<SelectValue placeholder="Select tier"/>
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					{showAll && <SelectItem value={'all'}>Select class</SelectItem>}
					{data.map((item, index) => (
						<SelectItem key={index} value={item.code}>
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