import { PetFilters } from "@/components/admin/pets/pet-filters";
import { PetsTable } from "@/components/admin/pets/pets-table";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { attributeTypes, classTypes, heroes, pets, tierTypes } from "@/db/schema";
import { and, asc, eq, getTableColumns, inArray } from "drizzle-orm";
import { PlusIcon } from "lucide-react";
import { createSearchParamsCache, parseAsArrayOf, parseAsString } from 'nuqs/server';
import { PetDialog } from "src/components/admin/pets/pet-dialog";

const searchParamsCache = createSearchParamsCache({
	hero: parseAsString,
	tiers: parseAsArrayOf(parseAsString),
	classes: parseAsArrayOf(parseAsString),
	attributes: parseAsArrayOf(parseAsString),
})

type PetsPageProps = {
	searchParams: Record<string, string | string[] | undefined>
}

export default async function PetsPage({
	searchParams
}: PetsPageProps) {
	
	const { hero, tiers, classes, attributes } = searchParamsCache.parse(searchParams)
	const whereConditions = []

	if (hero) {
		whereConditions.push(eq(pets.hero, hero))
	}

	if (tiers && tiers.length > 0) {
		whereConditions.push(inArray(pets.tierType, tiers))
	}
	if (classes && classes.length > 0) {
		whereConditions.push(inArray(heroes.classType, classes))
	}
	if (attributes && attributes.length > 0) {
		whereConditions.push(inArray(heroes.attributeType, attributes))
	}
	
	const items = await db
	.select({
		...getTableColumns(pets),
		heroImage: heroes.image,
		tierImage: tierTypes.image,
		classImage: classTypes.image,
		attributeImage: attributeTypes.image,
	}).from(pets)
	.leftJoin(heroes, eq(pets.hero, heroes.code))
	.leftJoin(tierTypes, eq(pets.tierType, tierTypes.code))
	.leftJoin(classTypes, eq(heroes.classType, classTypes.code))
	.leftJoin(attributeTypes, eq(heroes.attributeType, attributeTypes.code))
	.where(and(...whereConditions))
	.orderBy(asc(pets.name), asc(pets.hero));
	
	return (
		<div className="flex flex-1 flex-col gap-4 p-4 lg:p-6 h-full mb-4">
			<div className="flex items-center gap-2">
				<h1 className="text-lg font-semibold md:text-2xl">Pets</h1>
				<PetDialog>
					<Button variant={'secondary'} size={'icon'} className="size-5 rounded-full">
						<PlusIcon className="size-3"/>
					</Button>
				</PetDialog>
			</div>
			<PetFilters/>
			<div className="flex-1 rounded-lg border border-dashed shadow-sm p-2 md:p-3 overflow-y-auto">
				<PetsTable data={items}/>
			</div>
		</div>
	)
}