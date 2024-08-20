import { EquipDialog } from "@/components/admin/settings/equip-dialog";
import { EquipFilters } from "@/components/admin/settings/equip-filters";
import { EquipsTable } from "@/components/admin/settings/equips-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { classTypes, equipTypes, listItems, lists } from "@/db/schema";
import { and, asc, eq, getTableColumns } from "drizzle-orm";

type EquipsPageProps = {
	searchParams: {
		classType?: string,
	}
}

export default async function EquipsPage({
	searchParams
}: EquipsPageProps) {
	
	const gearTypes = await db
	.select({
		...getTableColumns(listItems),
	}).from(listItems)
	.innerJoin(lists, eq(listItems.listId, lists.id))
	.where(eq(lists.name, "Gear")).orderBy(asc(listItems.createdAt));
	
	const classes = await db
	.select().from(classTypes)
	.orderBy(asc(classTypes.createdAt));
	
	const items = await db
	.select().from(equipTypes)
	.where(
		and(
			searchParams.classType ? eq(equipTypes.classType, searchParams.classType) : undefined
		)
	)
	.orderBy(asc(equipTypes.createdAt));
	
	return (
		<Card>
			<CardHeader className="flex flex-row justify-between items-center gap-2">
				<div>
					<CardTitle>Equips</CardTitle>
					<CardDescription>
						List of class equip definitions.
					</CardDescription>
				</div>
				<EquipDialog classTypes={classes} gearTypes={gearTypes}/>
			</CardHeader>
			<CardContent>
				<EquipFilters classTypes={classes} gearTypes={gearTypes}/>
				<EquipsTable data={items} classTypes={classes} gearTypes={gearTypes}/>
			</CardContent>
		</Card>
	)
}