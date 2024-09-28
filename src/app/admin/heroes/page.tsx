import { HeroList } from "@/components/admin/heroes/hero-list";
import { HeroListFilters } from "@/components/admin/heroes/hero-list-filters";
import { HeroDialog } from "@/components/admin/settings/hero-dialog";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { attributeTypes, classTypes, heroes, tierTypes } from "@/db/schema";
import { and, asc, eq, getTableColumns, inArray } from "drizzle-orm";
import { PlusIcon } from "lucide-react";
import { createSearchParamsCache, parseAsArrayOf, parseAsString } from 'nuqs/server'

const searchParamsCache = createSearchParamsCache({
	tiers: parseAsArrayOf(parseAsString),
	classes: parseAsArrayOf(parseAsString),
	attributes: parseAsArrayOf(parseAsString),
})


type HeroesPageProps = {
	searchParams: Record<string, string | string[] | undefined>
}

export default async function HeroesPage({
	searchParams
}: HeroesPageProps) {


	const { tiers, classes, attributes } = searchParamsCache.parse(searchParams)

	const whereConditions = []

	if (tiers && tiers.length > 0) {
		whereConditions.push(inArray(heroes.tierType, tiers))
	}
	if (classes && classes.length > 0) {
		whereConditions.push(inArray(heroes.classType, classes))
	}
	if (attributes && attributes.length > 0) {
		whereConditions.push(inArray(heroes.attributeType, attributes))
	}

	const data = await db
		.select({
			...getTableColumns(heroes),
			tierImage: tierTypes.image,
			classImage: classTypes.image,
			attributeImage: attributeTypes.image,
		}).from(heroes)
		.leftJoin(tierTypes, eq(heroes.tierType, tierTypes.code))
		.leftJoin(classTypes, eq(heroes.classType, classTypes.code))
		.leftJoin(attributeTypes, eq(heroes.attributeType, attributeTypes.code))
		.where(and(...whereConditions))
		.orderBy(asc(heroes.createdAt));

	return (
		<div className="flex flex-1 flex-col gap-4 p-4 lg:p-6 h-full mb-4 overflow-hidden">
			<div className="flex items-center gap-2">
				<h1 className="text-lg font-semibold md:text-2xl">Heroes</h1>
				<HeroDialog>
					<Button variant={'secondary'} size={'icon'} className="size-5 rounded-full">
						<PlusIcon className="size-3" />
					</Button>
				</HeroDialog>
			</div>
			<HeroListFilters />
			<div className="flex-1 rounded-lg border border-dashed shadow-sm p-2 md:p-3 overflow-y-auto">
				<HeroList data={data} />
			</div>
		</div>
	)
}