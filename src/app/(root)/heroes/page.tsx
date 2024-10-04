import { HeroListFilters } from "@/components/admin/heroes/hero-list-filters";
import { FocusCards } from "@/components/ui/focus-cards";
import { db } from "@/db";
import { attributeTypes, classTypes, heroes, tierTypes } from "@/db/schema";
import { and, asc, eq, getTableColumns, inArray, sql } from "drizzle-orm";
import { parseAsArrayOf } from "nuqs";
import { createSearchParamsCache, parseAsString } from "nuqs/server";

const searchParamsCache = createSearchParamsCache({
	tiers: parseAsArrayOf(parseAsString),
	classes: parseAsArrayOf(parseAsString),
	attributes: parseAsArrayOf(parseAsString),
	search: parseAsString,
})


type HeroesPageProps = {
	searchParams: Record<string, string | string[] | undefined>
}


export default async function HeroesPage({
	searchParams
}: HeroesPageProps) {
	
	const {
		tiers,
		classes,
		attributes,
		search
	} = searchParamsCache.parse(searchParams)
	
	
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
	if (search) {
		whereConditions.push(sql`LOWER(${heroes.displayName}) LIKE ${`%${search.toLowerCase()}%`}`)
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
	
	const heroData = data?.map(item => ({
		title: item.name,
		color: item.color || '',
		src: item.thumbnail || '',
		icon: item.image || '',
		tierType: item.tierImage || '',
		classType: item.classImage || '',
		attributeType: item.attributeImage || '',
	}))
	
	return (
		<main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 w-full max-w-6xl mx-auto">
			<HeroListFilters/>
			<FocusCards cards={heroData}/>
		</main>
	)
}