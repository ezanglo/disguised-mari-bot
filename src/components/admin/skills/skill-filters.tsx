"use client";

import { HeroSelect } from "@/components/hero-select";
import { UpgradeTypesSelector } from "@/components/upgrade-types-selector";
import { parseAsString, useQueryState } from "nuqs";

export function SkillFilters() {
	const [hero, setHero] = useQueryState('hero',
		parseAsString
		.withDefault('')
		.withOptions({
			shallow: false,
			clearOnDefault: true,
		})
	)
	
	return (
		<div className="flex flex-row gap-2 flex-wrap">
			<HeroSelect 
				value={hero} 
				onValueChange={val => setHero(val || '')}
				className="w-40"
			/>
      <UpgradeTypesSelector allowed={['base', 'csr', 'si']}/>
    </div>
	)
}