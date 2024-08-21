"use client";

import { deleteListItem } from "@/actions/list";
import { ListItemDialog } from "@/components/admin/settings/list-item-dialog";
import { ListGroupType } from "@/components/admin/settings/lists-selector";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { listItems } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";

export type ListItemType = InferSelectModel<typeof listItems>;

type ListsTableProps = {
	data: ListItemType[],
	listGroup: ListGroupType[]
}

export function ListItemsTable({
	data,
	listGroup
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
									{item.image &&
										<Image src={item.image} alt={item.name} width={100} height={100} className="size-5"/>}
									{item.name}
									<Badge variant="outline">
										{item.code}
									</Badge>
								</div>
							</TableCell>
							<TableCell>
								<Badge variant="outline">
									{listGroup.find(i => i.id === item.listId)?.name}
								</Badge>
							</TableCell>
							<TableCell className="text-right">
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											aria-haspopup="true"
											size="icon"
											variant="ghost"
										>
											<MoreHorizontal className="h-4 w-4"/>
											<span className="sr-only">Toggle menu</span>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuLabel>Actions</DropdownMenuLabel>
										<ListItemDialog data={item} listGroup={listGroup}>
											<DropdownMenuItem preventSelect>Edit</DropdownMenuItem>
										</ListItemDialog>
										<ConfirmDialog
											title={`Delete ${item.name}?`}
											description="This action is permanent and cannot be undone."
											onConfirm={() => deleteListItem(item.id)}
										>
											<DropdownMenuItem preventSelect className="text-destructive">
												Delete
											</DropdownMenuItem>
										</ConfirmDialog>
									</DropdownMenuContent>
								</DropdownMenu>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
	)
}