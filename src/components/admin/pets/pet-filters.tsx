"use client";

import { AttributeFilter } from "@/components/attribute-filter";
import { ClassFilter } from "@/components/class-filter";
import { HeroSelect } from "@/components/hero-select";
import { TierFilter } from "@/components/tier-filter";
import { parseAsString, useQueryState } from "nuqs";

export function PetFilters() {
	const [hero, setHero] = useQueryState('hero',
		parseAsString
		.withDefault('all')
		.withOptions({
			shallow: false,
			clearOnDefault: true,
		})
	)
	
	return (
		<div className="flex flex-row gap-2 flex-wrap">
			<HeroSelect 
				value={hero} 
				onValueChange={val => setHero(val)}
				className="w-40"
			/>
      <TierFilter />
      <ClassFilter />
      <AttributeFilter />
    </div>
	)
}