import { HeroDialog } from "@/components/admin/heroes/hero-dialog";
import HeroPet from "@/components/admin/heroes/hero-pet";
import { HeroThumbnail } from "@/components/admin/heroes/hero-thumbnail";
import HeroWeapon from "@/components/admin/heroes/hero-weapon";
import { Button } from "@/components/ui/button";
import { DEFAULT_IMAGE } from "@/constants/constants";
import { db } from "@/db";
import { attributeTypes, classTypes, equipTypes, heroes, listItems, pets, skills, tierTypes } from "@/db/schema";
import { cn } from "@/lib/utils";
import { aliasedTable, and, asc, eq, getTableColumns } from "drizzle-orm";
import { PencilIcon } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

type HeroPageProps = {
	params: {
		id: string
	},
	searchParams: Record<string, string | string[] | undefined>
}

export default async function HeroPage({
	params,
	searchParams
}: HeroPageProps) {
	const whereConditions = []

	if (params.id) {
		whereConditions.push(eq(heroes.code, params.id))
	}

	const hero = await db
		.select({
			...getTableColumns(heroes),
			exclusiveWeaponName: equipTypes.name,
			exclusiveWeaponImage: equipTypes.image,
			petName: pets.name,
			petCode: pets.code,
			petImage: pets.image,
			tierImage: tierTypes.image,
			classImage: classTypes.image,
			attributeImage: attributeTypes.image,
		}).from(heroes)
		.leftJoin(tierTypes, eq(heroes.tierType, tierTypes.code))
		.leftJoin(classTypes, eq(heroes.classType, classTypes.code))
		.leftJoin(attributeTypes, eq(heroes.attributeType, attributeTypes.code))
		.leftJoin(pets, eq(heroes.code, pets.hero))
		.leftJoin(equipTypes, eq(heroes.exclusiveWeapon, equipTypes.id))
		.where(and(...whereConditions))
		.then(results => results[0]);

	if (!hero) {
		return notFound();
	}

	const skillTypes = aliasedTable(listItems, 'skillTypes')
	const upgradeTypes = aliasedTable(listItems, 'upgradeTypes')

	const heroSkills = await db
		.select({
			...getTableColumns(skills),
			skillName: skillTypes.name
		}).from(skills)
		.leftJoin(upgradeTypes, eq(skills.upgradeType, upgradeTypes.code))
		.leftJoin(skillTypes, eq(skills.skillType, skillTypes.code))
		.where(eq(skills.hero, params.id))
		.orderBy(asc(skills.hero), asc(skillTypes.order), asc(upgradeTypes.order));

	const getCurrentSkill = (skillType: string, upgradeType: string) => {
		return heroSkills.find(i => i.skillType === skillType && i.upgradeType === upgradeType);
	}

	const skillMap = [
		{ skill: 's1', label: 'Skill 1', upgrades: ['base', 'lb', 'si'] },
		{ skill: 's2', label: 'Skill 2', upgrades: ['base', 'lb', 'si'] },
		{ skill: 'pass', label: 'Passive', upgrades: ['base', 'lb', 'si'] },
		{ skill: 'ss', label: 'Special', upgrades: ['base'] },
		{ skill: 'cs', label: 'Chaser', upgrades: ['base', 'csr', 'si'] },
	]

	return (
		<div className="flex flex-1 flex-col gap-4 p-4 lg:p-6 h-full mb-4 overflow-hidden">
			<div className="flex flex-row flex-wrap gap-4">
				<fieldset className="rounded-lg border p-4 col-span-2">
					<legend className="-ml-1 px-1 text-sm font-medium">
						Thumbnail
					</legend>
					<HeroThumbnail hero={hero} />
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
									<HeroDialog data={hero}>
										<Button variant="ghost" className="p-0 gap-2 items-center hover:bg-transperent hover:underline h-6">
											<h1 className="text-lg font-semibold">{hero.displayName}</h1>
											<PencilIcon className="size-3.5" />
										</Button>
									</HeroDialog>
								</div>
							</div>
							<div className="grid grid-cols-2 gap-2 mt-auto">
								<div className="flex flex-row gap-2 items-center">
									<HeroPet hero={hero} />
									<span className="text-xs text-muted-foreground flex-1">
										{hero.petName || 'Select Pet'}
									</span>
								</div>
								<div className="flex flex-row gap-2 items-center">
									<HeroWeapon hero={hero} />
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
						{skillMap.map((skill, skillIndex) => (
							<div key={skillIndex} className="grid grid-cols-4 gap-3 items-center justify-end">
								<span className="font-semibold text-sm">{skill.label}</span>
								{skill.upgrades.map((upgrade, index) => {
									const currentSkill = getCurrentSkill(skill.skill, upgrade);
									return (
										<Button
											key={index}
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
									)
								})}
							</div>
						))}
					</div>
				</fieldset>
			</div>
		</div>
	)
}