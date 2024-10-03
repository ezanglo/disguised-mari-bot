import { SkillDialog } from "@/components/admin/skills/skill-dialog";
import { SkillFilters } from "@/components/admin/skills/skill-filters";
import { SkillsTable } from "@/components/admin/skills/skills-table";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { heroes, listItems, skills } from "@/db/schema";
import { aliasedTable, and, asc, eq, getTableColumns } from "drizzle-orm";
import { PlusIcon } from "lucide-react";
import { createSearchParamsCache, parseAsString } from 'nuqs/server';

const searchParamsCache = createSearchParamsCache({
	hero: parseAsString,
	upgradeType: parseAsString
})

type SkillPageProps = {
	searchParams: Record<string, string | string[] | undefined>
}

export default async function SkillPage({
	searchParams
}: SkillPageProps) {

	const { hero, upgradeType } = searchParamsCache.parse(searchParams)

	const whereConditions = []
	if (hero) {
		whereConditions.push(eq(skills.hero, hero))
	}
	if(upgradeType) {
		whereConditions.push(eq(skills.upgradeType, upgradeType))
	}

	const upgradeTypes = aliasedTable(listItems, 'upgradeTypes')
	const skillTypes = aliasedTable(listItems, 'skillTypes')

	const items = await db
		.select({
			...getTableColumns(skills),
			heroImage: heroes.image,
			skillName: skillTypes.name,
			upgradeName: upgradeTypes.name,
		}).from(skills)
		.leftJoin(heroes, eq(skills.hero, heroes.code))
		.leftJoin(upgradeTypes, eq(skills.upgradeType, upgradeTypes.code))
		.leftJoin(skillTypes, eq(skills.skillType, skillTypes.code))
		.where(and(...whereConditions))
		.orderBy(asc(skills.hero), asc(skillTypes.order), asc(upgradeTypes.order));

	return (
		<div className="flex flex-1 flex-col gap-4 p-4 lg:p-6 h-full mb-4">
			<div className="flex items-center gap-2">
				<h1 className="text-lg font-semibold md:text-2xl">Skill</h1>
				<SkillDialog>
					<Button variant={'secondary'} size={'icon'} className="size-5 rounded-full">
						<PlusIcon className="size-3" />
					</Button>
				</SkillDialog>
			</div>
			<SkillFilters/>
			<div className="flex-1 rounded-lg border border-dashed shadow-sm p-2 md:p-3 overflow-y-auto">
				<SkillsTable data={items} />
			</div>
		</div>
	)
}