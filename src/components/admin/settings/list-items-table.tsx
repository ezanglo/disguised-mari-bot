"use client";

import { deleteListItem } from "@/actions/list";
import { ListItemDialog } from "@/components/admin/settings/list-item-dialog";
import { TableActions } from "@/components/table-actions";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { listItems } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import Image from "next/image";

export type ListItemType = InferSelectModel<typeof listItems>;

type ListsTableProps = {
	data: (ListItemType & {
		listName: string | null
	})[],
}

export function ListItemsTable({
	data,
}: ListsTableProps) {
	
	if (data.length === 0) {
		return (
			<div className="flex w-full items-center justify-center h-32 text-muted-foreground">
				No data found.
			</div>
		)
	}
	
	return (
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[100px] hidden sm:table-cell">ID</TableHead>
						<TableHead>Name</TableHead>
						<TableHead>Type</TableHead>
						<TableHead>
							<span className="sr-only">Actions</span>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.map((item, index) => (
						<TableRow key={index}>
							<TableCell className="font-medium hidden sm:table-cell">
								{item.id.split('-')[0]}
							</TableCell>
							<TableCell>
								<div className="flex flex-row gap-2 items-center">
									{item.image && <Image src={item.image} alt={item.name} width={100} height={100} className="size-5"/>}
									{item.name}
									<Badge variant="outline">
										{item.code}
									</Badge>
								</div>
							</TableCell>
							<TableCell>
								<Badge variant="outline">
									{item.listName}
								</Badge>
							</TableCell>
							<TableCell className="text-right">
								<TableActions	
									data={item}
									EditComponent={ListItemDialog}
									onDelete={(data) => deleteListItem(data.id)}
									itemName={item.name}
								/>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
	)
}