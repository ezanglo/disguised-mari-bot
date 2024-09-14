import { HeroDialog } from "@/components/admin/settings/hero-dialog";
import { HeroesTable } from "@/components/admin/settings/heroes-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { attributeTypes, classTypes, heroes, tierTypes } from "@/db/schema";
import { asc, eq, getTableColumns } from "drizzle-orm";

type HeroesPageProps = {
	searchParams: {
		listId?: string,
	}
}

export default async function HeroesPage({
	searchParams
}: HeroesPageProps) {
	
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

	const tiers = await db
		.select().from(tierTypes)
		.orderBy(asc(tierTypes.createdAt));

	const classes = await db
		.select().from(classTypes)
		.orderBy(asc(classTypes.createdAt));

	const attributes = await db
		.select().from(attributeTypes)
		.orderBy(asc(attributeTypes.createdAt));
	
	return (
		<Card>
			<CardHeader className="flex flex-row justify-between items-center gap-2">
				<div>
					<CardTitle>Heroes</CardTitle>
					<CardDescription>
						List of heroes.
					</CardDescription>
				</div>
				<HeroDialog 
					tierTypes={tiers}
					classTypes={classes}
					attributeTypes={attributes}
				/>
			</CardHeader>
			<CardContent>
				<HeroesTable 
					data={data}
					tierTypes={tiers}
					classTypes={classes}
					attributeTypes={attributes}
				/>
				{/* <HeroesSelector data={listGroup}/> */}
			</CardContent>
		</Card>
	)
}