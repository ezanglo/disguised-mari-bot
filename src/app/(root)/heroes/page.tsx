import { HeroList } from "@/components/admin/heroes/hero-list";
import { HeroListFilters } from "@/components/admin/heroes/hero-list-filters";
import { db } from "@/db";
import { attributeTypes, classTypes, heroes, tierTypes } from "@/db/schema";
import { asc, eq, getTableColumns } from "drizzle-orm";

export default async function HeroesPage() {

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
		.orderBy(asc(heroes.createdAt));

	return (
		<main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
			<h1 className="text-lg font-semibold md:text-2xl">Heroes</h1>
			<HeroListFilters />
			<HeroList/>
		</main>
	)
}