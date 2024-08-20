import { ListItemDialog } from "@/components/admin/settings/list-item-dialog";
import { ListItemsTable } from "@/components/admin/settings/list-items-table";
import { ListsSelector } from "@/components/admin/settings/lists-selector";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { listItems, lists } from "@/db/schema";
import { asc, count, eq, getTableColumns } from "drizzle-orm";

type ListsPageProps = {
	searchParams: {
		listId?: string,
	}
}

export default async function ListsPage({
	searchParams
}: ListsPageProps) {
	
	const listGroup = await db
		.select({
			...getTableColumns(lists),
			itemCount: count(listItems.id),
		}).from(lists)
		.leftJoin(listItems, eq(lists.id, listItems.listId))
		.groupBy(lists.id)
		.orderBy(asc(lists.createdAt));
	
	const items = await db
		.select().from(listItems)
		.where(searchParams.listId ? eq(listItems.listId, searchParams.listId) : undefined)
		.orderBy(asc(listItems.createdAt));
	
	return (
		<Card>
			<CardHeader className="flex flex-row justify-between items-center gap-2">
				<div>
					<CardTitle>Lists</CardTitle>
					<CardDescription>
						List to identify different types of data.
					</CardDescription>
				</div>
				<ListItemDialog listGroup={listGroup}/>
			</CardHeader>
			<CardContent>
				<ListsSelector data={listGroup}/>
				<ListItemsTable data={items} listGroup={listGroup}/>
			</CardContent>
		</Card>
	)
}