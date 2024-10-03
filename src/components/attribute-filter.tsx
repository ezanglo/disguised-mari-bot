"use client"

import { AttributeType } from '@/components/attribute-select'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import useLists from '@/hooks/use-lists'
import { Loader2Icon } from 'lucide-react'
import Image from 'next/image'
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs'
import React from 'react'

export function AttributeFilter() {

  const { data, isLoading } = useLists('attributes')

  const [selectedAttributes, setSelectedAttributes] = useQueryState('attributes',
    parseAsArrayOf(parseAsString)
      .withDefault([])
      .withOptions({
        shallow: false,
        clearOnDefault: true,
      })
  )

  if (isLoading) {
    return (
      <div className='border border-input rounded-md p-1 w-[166px] h-[38px] flex items-center justify-center gap-1'>
        <Loader2Icon className="animate-spin size-4" />
        <span className='text-xs text-muted-foreground'>Attributes</span>
      </div>
    )
  }

  return (
    <ToggleGroup
      type="multiple"
      className="border border-input rounded-md p-1"
      defaultValue={selectedAttributes || []}
      onValueChange={setSelectedAttributes}
    >
      {(data as AttributeType[]).map((item) => (
        <ToggleGroupItem
          key={item.code}
          value={item.code}
          aria-label={item.name}
          className="p-1 size-7"
        >
          {item.image && <Image src={item.image || ''} alt={item.name} width={100} height={100} className="size-5"/>}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
