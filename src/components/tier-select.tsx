"use client";

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { tierTypes } from "@/db/schema";
import useLists from "@/hooks/use-lists";
import { SelectProps } from "@radix-ui/react-select";
import { InferSelectModel } from "drizzle-orm";
import Image from "next/image";

export type TierType = InferSelectModel<typeof tierTypes>;

type TierSelectProps = SelectProps & {
	className?: string,
	showAll?: boolean,
}

export function TierSelect({
	className,
	showAll = false,
	...props
}: TierSelectProps) {

  const { data, isLoading } = useLists('tiers')

	return (
		<Select {...props}>
			<SelectTrigger className={className}>
				<SelectValue placeholder="Select tier"/>
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					{showAll && <SelectItem value={'all'}>Select class</SelectItem>}
					{isLoading ? <SelectItem value={'all'}>Loading...</SelectItem> : data.map((item: TierType, index: number) => (
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