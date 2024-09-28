"use client"

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import useLists from '@/hooks/use-lists'

import { Loader2Icon } from 'lucide-react'
import Image from 'next/image'
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs'
import React from 'react'
import { TierType } from './admin/tier-select'

export function TierFilter() {

  const { data, isLoading } = useLists('tiers')

  const [selectedTiers, setSelectedTiers] = useQueryState('tiers',
    parseAsArrayOf(parseAsString)
      .withDefault([])
      .withOptions({
        shallow: false,
        clearOnDefault: true,
      })
  )

  if (isLoading) {
    return (
      <div className='border border-input rounded-md p-1 w-[102px] h-[38px] flex items-center justify-center gap-1'>
        <Loader2Icon className="animate-spin size-4" />
        <span className='text-xs text-muted-foreground'>Tiers</span>
      </div>
    )
  }

  return (
    <ToggleGroup
      type="multiple"
      className='border border-input rounded-md p-1'
      defaultValue={selectedTiers || []}
      onValueChange={setSelectedTiers}
    >
      {(data as TierType[]).map((item) => (
        <ToggleGroupItem
          key={item.code}
          value={item.code}
          aria-label={item.name}
          className="p-1 size-7"
        >
          <Image src={item.image || ''} alt={item.name} width={100} height={100} />
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
