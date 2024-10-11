import React from 'react'
import { HeroThumbnail } from '../admin/heroes/hero-thumbnail';
import { HeroType } from '../admin/heroes/heroes-table';
import Image from 'next/image';
import { DEFAULT_IMAGE } from '@/constants/constants';
import { HeroDialog } from '../admin/heroes/hero-dialog';
import { Button } from '../ui/button';
import { PencilIcon } from 'lucide-react';
import HeroPet from '../admin/heroes/hero-pet';
import HeroWeapon from '../admin/heroes/hero-weapon';
import { SkillType } from '../admin/skills/skills-table';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card';
import Link from 'next/link';

type HeroDetailsProps = {
  hero: HeroType & {
    tierImage: string | null;
    classImage: string | null;
    attributeImage: string | null;
    petName: string | null;
    exclusiveWeaponName: string | null;
    petImage: string | null;
    petCode: string | null;
    exclusiveWeaponImage: string | null;
  }
  heroSkills: (SkillType & {
    skillName: string | null;
  })[];
  readonly?: boolean;
}

export function HeroDetails({
  hero,
  heroSkills,
  readonly = false,
}: HeroDetailsProps) {

  const skillMap = [
    { skill: 's1', label: 'Skill 1', upgrades: ['base', 'si'] },
    { skill: 's2', label: 'Skill 2', upgrades: ['base', 'si'] },
    { skill: 'pass', label: 'Passive', upgrades: ['base','si'] },
    { skill: 'ss', label: 'Special', upgrades: ['base'] },
    { skill: 'cs', label: 'Chaser', upgrades: ['base', 'si'] },
  ]


  const getCurrentSkill = (skillType: string, upgradeType: string) => {
    return heroSkills.find(i => i.skillType === skillType && i.upgradeType === upgradeType);
  }

  return (
    <div className="flex flex-row flex-wrap gap-4">
      <fieldset className="rounded-lg border p-4 col-span-2">
        <legend className="-ml-1 px-1 text-sm font-medium">
          Thumbnail
        </legend>
        {readonly ? (
          <div
            className="h-72 w-52 text-muted-foreground p-0 overflow-hidden border border-dashed hover:border-0 relative"
          >
            <Image
              src={hero.thumbnail || DEFAULT_IMAGE}
              alt={''}
              fill
              className={cn(
                "object-cover absolute inset-0 scale-[2] hover:scale-[1] origin-top transition-all duration-300",
              )}
            />
          </div>
        ) : (
          <HeroThumbnail hero={hero} />
        )}
      </fieldset>
      <div className="flex flex-col flex-1 col-span-4">
        <fieldset className="rounded-lg border p-4 flex-1">
          <legend className="-ml-1 px-1 text-sm font-medium">
            Details
          </legend>
          <div className="flex flex-col gap-2 p-2 h-full">
            <div className="flex gap-2 flex-1">
              <Image
                src={hero.image || DEFAULT_IMAGE}
                className="size-12 rounded-lg"
                alt={hero.displayName} width={500} height={500}
              />
              <div className="flex flex-col">
                <div className="flex flex-row gap-1">
                  {hero.tierImage && (
                    <Image
                      src={hero.tierImage || DEFAULT_IMAGE}
                      className="size-4"
                      alt={hero.displayName} width={32} height={32}
                    />
                  )}
                  {hero.classImage && (
                    <Image
                      src={hero.classImage || DEFAULT_IMAGE}
                      className="size-4"
                      alt={hero.displayName} width={32} height={32}
                    />
                  )}
                  {hero.attributeImage && (
                    <Image
                      src={hero.attributeImage || DEFAULT_IMAGE}
                      className="size-4"
                      alt={hero.displayName} width={32} height={32}
                    />
                  )}
                </div>
                {readonly ? (
                  <h1 className="text-lg font-semibold">{hero.displayName}</h1>
                ) : (
                  <HeroDialog data={hero}>
                    <Button variant="ghost" className="p-0 gap-2 items-center hover:bg-transperent hover:underline h-6">
                      <h1 className="text-lg font-semibold">{hero.displayName}</h1>
                      <PencilIcon className="size-3.5" />
                    </Button>
                  </HeroDialog>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-auto">
              <div className="flex flex-row gap-2 items-center">
                {readonly ? (
                  <Image
                    src={hero.petImage || DEFAULT_IMAGE}
                    className="size-12 rounded-lg"
                    alt={hero.displayName} width={500} height={500}
                  />
                ) : (
                  <HeroPet hero={hero} />
                )}
                <span className="text-xs text-muted-foreground flex-1">
                  {hero.petName || 'Select Pet'}
                </span>
              </div>
              <div className="flex flex-row gap-2 items-center">
                {readonly ? (
                  <Image
                    src={hero.exclusiveWeaponImage || DEFAULT_IMAGE}
                    className="size-12 rounded-lg"
                    alt={hero.displayName} width={500} height={500}
                  />
                ) : (
                  <HeroWeapon hero={hero} />
                )}
                <span className="text-xs text-muted-foreground flex-1">
                  {hero.exclusiveWeaponName || 'Select Weapon'}
                </span>
              </div>
            </div>
          </div>
        </fieldset>
      </div>
      <fieldset className="rounded-lg border p-4 col-span-3">
        <legend className="-ml-1 px-1 text-sm font-medium">
          Skills
        </legend>
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-4 gap-3 items-center justify-end text-xs text-center">
            <span></span>
            <span>Base</span>
            <span>Imprint</span>
          </div>
          {skillMap.map((skill, skillIndex) => (
            <div key={skillIndex} className="grid grid-cols-4 gap-3 items-center justify-end">
              <span className="font-semibold text-sm">{skill.label}</span>
              {skill.upgrades.map((upgrade, index) => {
                const currentSkill = getCurrentSkill(skill.skill, upgrade);
                return (
                  <HoverCard key={index}>
                    <HoverCardTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "size-12 p-0 rounded-lg overflow-hidden border-none",
                          !currentSkill && 'border-dashed border-muted-foreground/20'
                        )}
                      >
                        {currentSkill?.image && (
                          <Image
                            src={currentSkill.image || DEFAULT_IMAGE}
                            className="size-12"
                            alt={hero.displayName} width={100} height={100}
                          />
                        )}
                      </Button>
                    </HoverCardTrigger>
                    {currentSkill && (
                      <HoverCardContent className='w-[350px]'>
                        <div className="flex justify-between gap-4">
                          <Image
                            src={currentSkill?.image || DEFAULT_IMAGE}
                            className="size-12 rounded-lg"
                            alt={hero.displayName} width={100} height={100}
                          />
                          <div className="flex flex-col gap-1">
                            <h4 className="text-sm font-semibold">{currentSkill?.name}</h4>
                            <div className="flex flex-row gap-2 text-xs">
                              <span>SP: {currentSkill?.sp}</span>
                              <span>CD: {currentSkill?.cooldown}</span>
                            </div>
                            <p className="text-xs">{currentSkill?.description}</p>
                          </div>
                        </div>
                      </HoverCardContent>
                    )}
                  </HoverCard>
                )
              })}
            </div>
          ))}
        </div>
      </fieldset>
    </div>
  )
}
