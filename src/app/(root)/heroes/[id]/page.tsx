import { HeroDialog } from "@/components/admin/heroes/hero-dialog";
import HeroPet from "@/components/admin/heroes/hero-pet";
import { HeroThumbnail } from "@/components/admin/heroes/hero-thumbnail";
import HeroWeapon from "@/components/admin/heroes/hero-weapon";
import { HeroDetails } from "@/components/hero/hero-details";
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

	return (
		<div className="flex flex-1 flex-col gap-4 p-4 lg:p-6 h-full mb-4 overflow-hidden max-w-6xl mx-auto">
      <HeroDetails 
        hero={hero} 
        heroSkills={heroSkills} 
        readonly={true}
      />
		</div>
	)
}