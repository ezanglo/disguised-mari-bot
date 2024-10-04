"use client";

import { HeroCard } from '@/components/admin/heroes/hero-card';
import { SkillCard } from "@/components/admin/heroes/skills-card";
import { AttributeType } from '@/components/attribute-select';
import { ClassType } from '@/components/class-select';
import { TierSelect, TierType } from '@/components/tier-select';
import { DEFAULT_IMAGE } from '@/constants/constants';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import React, { useState } from 'react'

export type WikiHero = {
  name: string,
  wikiPage?: string,
  imageUrl?: string,
  attribute?: AttributeType['code'],
  tier?: ClassType['code']
}

type HeroResponse = {
  [key in AttributeType['code']]: WikiHero[]
}

type AddHeroPageProps = {
}

export default function AddHeroPage({ }: AddHeroPageProps) {

  const [tier, setTier] = useState<TierType['code']>('SR')
  const [hero, setHero] = useState<WikiHero | undefined>()

  let url = '/api/wiki/heroes';

  const { data, isLoading } = useQuery({
    queryKey: ['wiki-heroes'],
    queryFn: () => fetch(url).then(res => res.json() as Promise<HeroResponse>),
  });


  if (isLoading) {
    return <div>Loading...</div>
  }

  const heroes = data?.[tier] || [];

  return (
    <div className="grid grid-cols-2 flex-1 gap-4 p-4 lg:p-6 h-full mb-4 overflow-hidden">
      <div className="flex flex-col gap-2">
        <TierSelect value={tier} onValueChange={val => setTier(val?.toUpperCase() || '')} />
        <span>Count: {heroes.length}</span>
        <div className="flex-1 grid grid-cols-2 rounded-lg border border-dashed shadow-sm p-2 gap-2 max-h-96 overflow-y-auto">
          {heroes.map((item, index) => (
            <div
              key={index}
              className={cn(
                "flex flex-row gap-2 p-2 border rounded-md cursor-pointer",
                item.name === hero?.name && "bg-muted"
              )}
              onClick={() => setHero(item)}
            >
              <Image
                key={index}
                src={item.imageUrl || DEFAULT_IMAGE}
                alt={item.name} width={100} height={100}
                className="size-5"
              />
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2 overflow-auto">
        {hero && <HeroCard wikiHero={hero}/>}
        {hero && <SkillCard wikiHero={hero}/>}
      </div>
    </div>
  )
}
