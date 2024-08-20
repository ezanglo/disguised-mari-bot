import { TraitDialog } from "@/components/admin/settings/trait-dialog";
import { TraitsTable } from "@/components/admin/settings/traits-table";
import { UpgradeTypesSelector } from "@/components/admin/settings/upgrade-types-selector";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { listItems, lists, traitTypes } from "@/db/schema";
import { and, asc, eq, getTableColumns, inArray } from "drizzle-orm";

type TraitsPageProps = {
	searchParams: {
		upgradeType?: string,
	}
}

export default async function TraitsPage({
	searchParams
}: TraitsPageProps) {
	
	const upgradeTypes = await db
	.select({
		...getTableColumns(listItems),
	}).from(listItems)
	.innerJoin(lists, eq(listItems.listId, lists.id))
	.where(and(
		eq(lists.name, "Upgrade"),
		inArray(listItems.code, ['lvl', 'csr', 'si', 'trans'])
	)).orderBy(asc(listItems.createdAt));
	
	const items = await db
	.select().from(traitTypes)
	.where(searchParams.upgradeType ? eq(traitTypes.upgradeType, searchParams.upgradeType) : undefined)
	.orderBy(asc(traitTypes.createdAt));
	
	return (
		<Card>
			<CardHeader className="flex flex-row justify-between items-center gap-2">
				<div>
					<CardTitle>Traits</CardTitle>
					<CardDescription>
						List of hero trait definitions.
					</CardDescription>
				</div>
				<TraitDialog upgradeTypes={upgradeTypes}/>
			</CardHeader>
			<CardContent>
				<UpgradeTypesSelector data={upgradeTypes}/>
				<TraitsTable data={items} upgradeTypes={upgradeTypes}/>
			</CardContent>
		</Card>
	)
}