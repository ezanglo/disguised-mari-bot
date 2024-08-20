"use client";

import { deleteTraitType } from "@/actions/trait-type";
import { TraitDialog } from "@/components/admin/settings/trait-dialog";
import { UpgradeType } from "@/components/admin/settings/upgrade-types-selector";
import { CopyMarkdown } from "@/components/copy-markdown";
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
import { traitTypes } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";

export type TraitType = InferSelectModel<typeof traitTypes>;

type ListsTableProps = {
	data: TraitType[],
	upgradeTypes: UpgradeType[],
}

export function TraitsTable({
	data,
	upgradeTypes
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
					<TableHead>Emote</TableHead>
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
								<Badge variant="outline" className="hidden lg:block">
									{item.code}
								</Badge>
							</div>
						</TableCell>
						<TableCell>
							<Badge variant="outline">
								{upgradeTypes.find(i => i.code === item.upgradeType)?.name}
							</Badge>
						</TableCell>
						<TableCell>
							<CopyMarkdown prefix="trait" {...item} name={item.upgradeType + item.code}/>
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
									<TraitDialog data={item} upgradeTypes={upgradeTypes}>
										<DropdownMenuItem preventSelect>Edit</DropdownMenuItem>
									</TraitDialog>
									<ConfirmDialog
										title={`Delete ${item.name}?`}
										description="This action is permanent and cannot be undone."
										onConfirm={() => deleteTraitType(item.id)}
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