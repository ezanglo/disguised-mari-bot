import { AttributeFilter } from '@/components/attribute-filter';
import { ClassFilter } from '@/components/class-filter';
import { TierFilter } from '@/components/tier-filter'
import React from 'react'

export async function MonsterListFilters() {
  return (
    <div className="flex flex-row gap-2 flex-wrap">
      <TierFilter />
      <ClassFilter />
      <AttributeFilter />
    </div>
  )
}
