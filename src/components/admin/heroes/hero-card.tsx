"use client";

import { insertHero } from '@/actions/hero';
import { WikiHero } from '@/app/admin/heroes/add/page';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DEFAULT_IMAGE } from '@/constants/constants';
import useLists from '@/hooks/use-lists';
import { toCode } from '@/lib/utils';
import { DetailData } from '@/lib/wiki-helper';
import Image from 'next/image';
import React from 'react'
import { toast } from 'sonner';
import { HeroDialog } from './hero-dialog';
import { HeroType } from './heroes-table';

type HeroCardProps = {
  wikiHero: WikiHero
}

export function HeroCard({
  wikiHero
}: HeroCardProps) {

  const { data, isLoading } = useLists(`heroes/${toCode(wikiHero.name)}`)


  if (isLoading) {
    return <div>Loading...</div>
  }

  const hero = data as HeroType;

  const handleInsert = async () => {

    try {

      const heroData = await fetch(`/api/wiki/heroes/${wikiHero.wikiPage}`).then(res => res.json())

      const details = heroData.details as DetailData[]


      const tierType = details.find(i => i.label === 'Tier');
      const classType = details.find(i => i.label === 'Type');
      const attributeType = details.find(i => i.label === 'Attribute');


      const response = await insertHero({
        name: heroData.name,
        displayName: heroData.displayName,
        code: toCode(heroData.name),
        image: heroData.image,
        classType: classType?.value as string,
        tierType: tierType?.value as string,
        attributeType: (attributeType?.value || 'life_green') as string,
      })
      if (response) {
        console.log(response);
        toast.success(data ? "Hero updated" : "Hero created")
      }

    } catch (error) {
      toast.error((error as Error).message)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row gap-2 items-center">
          <span>Hero</span>
          {data.message === 'Hero not found' && (
            <Button
              size="sm"
              onClick={handleInsert}
            >
              Add
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <HeroDialog data={hero}>
          <Card className="overflow-hidden hover:scale-105 transition-all duration-300">
            <CardHeader className="p-0 space-y-0 relative">
              <Image
                src={hero.image || DEFAULT_IMAGE}
                className="size-[4.5rem] md:size-24 object-cover"
                alt={hero.displayName} width={500} height={500}
              />
            </CardHeader>
          </Card>
        </HeroDialog>
      </CardContent>
    </Card>
  )
}
