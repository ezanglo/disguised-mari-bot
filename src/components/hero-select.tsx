"use client";

import { HeroType } from "@/components/admin/heroes/heroes-table";
import { Combobox } from "@/components/combobox";
import { listItems } from "@/db/schema";
import useLists from "@/hooks/use-lists";
import { InferSelectModel } from "drizzle-orm";

export type ContentType = InferSelectModel<typeof listItems>;

type HeroSelectProps = {
	value?: string,
	onValueChange?: (value: string) => void,
}

export function HeroSelect({
	value,
	onValueChange,
}: HeroSelectProps) {
	
	const {data, isLoading} = useLists('heroes')
	
	return !isLoading && (
		<Combobox
			placeholder="Select hero"
			options={data.map((item: HeroType) => ({ label: item.name, value: item.code}))}
			onSelect={onValueChange}
		/>
	)
}