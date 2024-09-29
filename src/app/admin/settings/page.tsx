import GeneralSettingTabs from "@/components/admin/settings/general-setting-tabs";
import { ListItemsTable } from "@/components/admin/settings/list-items-table";
import { ListsSelector } from "@/components/lists-selector";
import { db } from "@/db";
import { listItems, lists } from "@/db/schema";
import { and, asc, eq, getTableColumns } from "drizzle-orm";

import { createSearchParamsCache, parseAsString } from 'nuqs/server';

const searchParamsCache = createSearchParamsCache({
	list: parseAsString
})

type SettingsPageProps = {
	searchParams: Record<string, string | string[] | undefined>
}

export default async function SettingsPage({
	searchParams
}: SettingsPageProps) {
	
	const { list } = searchParamsCache.parse(searchParams)

	const whereConditions = []
	if(list) {
		whereConditions.push(eq(lists.name, list))
	}

	const items = await db
		.select({
			...getTableColumns(listItems),
			listName: lists.name,
		}).from(listItems)
		.leftJoin(lists, eq(lists.id, listItems.listId))
		.where(and(...whereConditions))
		.orderBy(asc(listItems.createdAt));

	return (
		<div className="flex flex-1 flex-col gap-4 p-4 lg:p-6 h-full overflow-hidden">
			<div className="flex items-center gap-2">
				<h1 className="text-lg font-semibold md:text-2xl">General Settings</h1>
			</div>
			<div className="grid grid-cols-1 gap-4 overflow-hidden">
				<div className="flex-1 rounded-lg border border-dashed shadow-sm p-2 md:p-3">
					<GeneralSettingTabs/>
				</div>
				<div className="rounded-lg border border-dashed shadow-sm p-2 md:p-3 overflow-y-auto gap-2 flex flex-col">
					<ListsSelector/>
					<ListItemsTable data={items}/>
				</div>
			</div>
		</div>
	)
}