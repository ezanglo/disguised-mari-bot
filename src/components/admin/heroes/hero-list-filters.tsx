import { SearchFilter } from "@/components/admin/heroes/search-filter";
import { AttributeFilter } from '@/components/attribute-filter';
import { ClassFilter } from '@/components/class-filter';
import { TierFilter } from '@/components/tier-filter'
import { cn } from "@/lib/utils";
import React from 'react'

type HeroListFiltersProps = {
  className?: string
}

export async function HeroListFilters({
  className
}: HeroListFiltersProps) {
  return (
    <div className={cn('flex flex-row gap-2 flex-wrap sm:mx-6 justify-start', className)}>
      <SearchFilter/>
      <div className="flex flex-row gap-2 flex-wrap sm:ml-auto">
        <TierFilter />
        <ClassFilter />
        <AttributeFilter />
      </div>
    </div>
  )
}
