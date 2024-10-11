"use client";

import { insertHero, updateHero } from '@/actions/hero';
import { WikiHero } from '@/app/admin/heroes/add/page';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DEFAULT_IMAGE } from '@/constants/constants';
import useLists from '@/hooks/use-lists';
import { toCode } from '@/lib/utils';
import { DetailData, GalleryData } from '@/lib/wiki-helper';
import { useQuery } from '@tanstack/react-query';
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

  let name = toCode(wikiHero.name);
  const pageParts = wikiHero.wikiPage?.split('/')
  if (pageParts && pageParts.length > 1 && pageParts.at(-1)?.toLowerCase() !== 'dimensional_chaser') {
    name += `_${toCode(pageParts.at(-1))}`
  }
  
  const { data, isLoading } = useLists(`heroes/${name}`)

  const { data: heroData, isLoading: isHeroDataLoading } = useQuery({
    queryKey: [wikiHero.wikiPage],
    queryFn: () => fetch(`/api/wiki/heroes/${wikiHero.wikiPage}`).then(res => res.json()),
  });


  if (isLoading || isHeroDataLoading) {
    return <div>Loading...</div>
  }

  const hero = data as HeroType;

  const handleInsert = async () => {

    try {

      const details = heroData.details as DetailData[]

      const tierType = details.find(i => i.label === 'Tier');
      const classType = details.find(i => i.label === 'Type');
      const attributeType = details.find(i => i.label === 'Attribute');

      const response = await insertHero({
        name: heroData.name,
        displayName: heroData.displayName,
        code: name,
        image: heroData.image,
        classType: classType?.value as string,
        tierType: tierType?.value as string,
        attributeType: (attributeType?.value || 'life_green') as string,
      })
      if (response) {
        toast.success(data ? "Hero updated" : "Hero created")
      }

    } catch (error) {
      toast.error((error as Error).message)
    }
  }

  const handleUpdateImage = async (image: string) => {
    if (!hero) return;

    try {
      const response = await updateHero({
        id: hero.id,
        code: hero.code,
        name: hero.name,
        displayName: hero.displayName,
        tierType: hero.tierType,
        classType: hero.classType,
        attributeType: hero.attributeType,
        image,
      })
      if (response) {
        toast.success("Hero image updated")
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
        {hero && (
          <div className="flex flex-row flex-wrap gap-2 p-2 border rounded-sm mt-2">
            {(heroData.icons as GalleryData[]).map((item, index) => (
              <Button key={index} className="size-8 p-0" variant="outline" onClick={() => handleUpdateImage(item.image)}>
                <Image
                  src={item.image || DEFAULT_IMAGE}
                  className="object-cover size-6"
                  title={item.label}
                  alt={''} width={500} height={500}
                />
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
