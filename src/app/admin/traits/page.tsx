import { TraitDialog } from "@/components/admin/settings/trait-dialog";
import { TraitsTable } from "@/components/admin/settings/traits-table";
import { UpgradeTypesSelector } from "@/components/admin/settings/upgrade-types-selector";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { listItems, traitTypes } from "@/db/schema";
import { and, asc, eq, getTableColumns } from "drizzle-orm";
import { PlusIcon } from "lucide-react";
import { createSearchParamsCache, parseAsString } from 'nuqs/server';

const searchParamsCache = createSearchParamsCache({
	upgradeType: parseAsString
})

type TraitsPageProps = {
	searchParams: Record<string, string | string[] | undefined>
}

export default async function TraitsPage({
	searchParams
}: TraitsPageProps) {

	const { upgradeType } = searchParamsCache.parse(searchParams)

	const whereConditions = []
	if(upgradeType) {
		whereConditions.push(eq(traitTypes.upgradeType, upgradeType))
	}

	const items = await db
		.select({
			...getTableColumns(traitTypes),
			upgradeName: listItems.name,
		}).from(traitTypes)
		.leftJoin(listItems, eq(traitTypes.upgradeType, listItems.code))
		.where(and(...whereConditions))
		.orderBy(asc(traitTypes.createdAt));

	return (
		<div className="flex flex-1 flex-col gap-4 p-4 lg:p-6 h-full mb-4">
			<div className="flex items-center gap-2">
				<h1 className="text-lg font-semibold md:text-2xl">Traits</h1>
				<TraitDialog>
					<Button variant={'secondary'} size={'icon'} className="size-5 rounded-full">
						<PlusIcon className="size-3" />
					</Button>
				</TraitDialog>
			</div>
			<UpgradeTypesSelector/>
			<div className="flex-1 rounded-lg border border-dashed shadow-sm p-2 md:p-3 overflow-y-auto">
				<TraitsTable data={items} />
			</div>
		</div>
	)
}