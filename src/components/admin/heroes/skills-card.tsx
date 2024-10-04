"use client";

import { insertSkill } from "@/actions/skill";
import { WikiHero } from '@/app/admin/heroes/add/page';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DEFAULT_IMAGE } from "@/constants/constants";
import useLists from '@/hooks/use-lists';
import { toCode } from '@/lib/utils';
import { Loader2Icon } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from 'react'
import { toast } from "sonner";
import { SkillData, SkillUpgrade } from "wiki-helper";
import { TraitType } from "../traits/traits-table";
import { HeroType } from './heroes-table';

type SkillCardProps = {
	wikiHero: WikiHero
}

export function SkillCard({
	wikiHero
}: SkillCardProps) {


	const [skills, setSkills] = useState<SkillData[]>([]);

	const [isLoadingSkills, setIsLoadingSkills] = useState(false);

	const [current, setCurrent] = useState<{ skillType: string, upgradeType: string} | undefined>();

	let name = toCode(wikiHero.name);
	const pageParts = wikiHero.wikiPage?.split('/')
	if (pageParts && pageParts.length > 1 && pageParts.at(-1)?.toLowerCase() !== 'dimensional_chaser') {
		name += toCode(pageParts.at(-1))
	}
	
	const { data, isLoading } = useLists(`heroes/${name}`)

	const { data: traits } = useLists('traits')

	useEffect(() => {
		if (!isLoading && data) {
			const fetchData = async () => {
				setIsLoadingSkills(true)
				const heroData = await fetch(`/api/wiki/heroes/${wikiHero.wikiPage}`).then(res => res.json());
				setSkills(heroData.skills)
				setIsLoadingSkills(false)
			}
			fetchData();
		}
	}, [data, isLoading]);


	if (isLoading) {
		return <div>Loading...</div>
	}

	const hero = data as HeroType;

	const handleInsert = async (skill: SkillData, upgrade?: SkillUpgrade) => {

		try {

			const skillType = skill.skillType || 's1';
			const upgradeType = upgrade?.upgradeType || 'base';
			let name = skill.name;
			let description = skill.description;
			let image = skill.image;
			let sp = skill.sp ? parseInt(skill.sp.match(/\d+/)?.[0] || '0') : null;
			let cooldown = skill.cooldown ? parseInt(skill.cooldown.match(/\d+/)?.[0] || '0') : null;

			if (['s1', 's2', 'pass', 'ss', 'cs'].includes(skillType)) {
				switch (upgradeType) {
					case 'lb':
						const lbSkill = skill.upgrades?.find((upgrade) => upgrade.upgradeType === upgradeType);
						if (lbSkill) {
							image = lbSkill.image;
							name = `${skill.name} (Upgrade)`;
							description = lbSkill.description;
						}
						break;
					case 'csr':
						const csSkill = skill.upgrades?.find((upgrade) => upgrade.upgradeType === upgradeType);
						if (csSkill) {
							image = csSkill.image;
							name = `${skill.name} (MAX)`;
							description = csSkill.description;
						}
						break;
					case 'si':
						const siSkill = skill.upgrades?.find((upgrade) => upgrade.upgradeType === upgradeType);
						if (siSkill) {
							image = siSkill.image;
							name = `${skill.name} (Imprint)`;
							description = siSkill.description;
						}
						break;
				}
			}

			const code = [
				hero.code,
				skillType,
				upgradeType,
			].join('.')

			let discordEmote;
			if (skillType === 'pass' && upgradeType === 'si') {
				const memTrait = (traits as TraitType[])?.find(i => i.code === 'mem');
				image = memTrait?.image || ''
				discordEmote = memTrait?.discordEmote
			}

			setCurrent({ skillType, upgradeType })

			const response = await insertSkill({
				name,
				skillType,
				upgradeType,
				hero: hero.code,
				code,
				image,
				discordEmote,
				sp: skill.sp !== 'N/A' ? sp : undefined,
				cooldown: skill.cooldown !== 'N/A' ? cooldown : undefined,
				description,
			})
			if (response) {
				toast.success(`Skill ${code} added`)
			}

		} catch (error) {
			toast.error((error as Error).message)
		} finally {
			setCurrent(undefined)
		}
	}

	const handleBulkInsert = async () => {
		try {
			for (const skill of skills) {
				if (skill.skillType === 'cs') {
					await handleInsert(skill);
					if (skill.upgrades) {
						for (const upgrade of skill.upgrades) {
							await handleInsert(skill, upgrade);
						}
					}
				}
			}
			toast.success("All skills bulk inserted successfully");
		} catch (error) {
			toast.error(`Bulk insert failed: ${(error as Error).message}`);
		}
	};

	const isCurrent = (skillType?: string, upgradeType?: string) => {
		return skillType === current?.skillType && upgradeType === current?.upgradeType
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex flex-row gap-2 items-center justify-between">
					<span>Skills</span>
					<Button onClick={handleBulkInsert} disabled={isLoadingSkills}>Bulk Insert All</Button>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col gap-2">
					{isLoadingSkills ? (
						<div>Loading...</div>
					) : skills.map((item, index) => (
						<div key={index} className="grid grid-cols-1 gap-2 items-center justify-between">
							<div className="flex flex-row gap-2">
								<span>{item.name}</span>
								<Badge variant="outline">{item.skillType}</Badge>
							</div>
							<div className="flex flex-row gap-2 flex-wrap">
								<Button variant="outline" onClick={() => handleInsert(item)} className="gap-2">
									<Image src={item.image || DEFAULT_IMAGE} alt={item.name} width={24} height={24} />
									base
									{isCurrent(item.skillType, 'base') && <Loader2Icon className="animate-spin size-4" />}
								</Button>
								{item.upgrades?.map((upgrade, index) => (
									<Button variant="outline" key={index} onClick={() => handleInsert(item, upgrade)} className="gap-2">
										<Image src={upgrade.image || DEFAULT_IMAGE} alt={upgrade.description} width={24} height={24} />
										{upgrade.upgradeType}
										{isCurrent(item.skillType, upgrade.upgradeType) && <Loader2Icon className="animate-spin size-4" />}
									</Button>
								))}
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	)
}
