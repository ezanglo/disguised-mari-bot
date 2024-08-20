"use client";

import { deleteTraitType } from "@/actions/trait-type";
import { ClassType } from "@/components/admin/class-select";
import { GearType } from "@/components/admin/gear-select";
import { EquipDialog } from "@/components/admin/settings/equip-dialog";
import { CopyMarkdown } from "@/components/copy-markdown";
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
import { equipTypes } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";

export type EquipType = InferSelectModel<typeof equipTypes>;

type EquipsTableProps = {
	data: EquipType[],
	classTypes: ClassType[],
	gearTypes: GearType[],
}

export function EquipsTable({
	data,
	classTypes,
	gearTypes
}: EquipsTableProps) {
	
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
					<TableHead>Class</TableHead>
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
									<Image src={item.image} alt={item.gearType} width={100} height={100} className="size-5"/>}
								{gearTypes.find(i => i.code === item.gearType)?.name}
							</div>
						</TableCell>
						<TableCell>
							{(() => {
								const classType = classTypes.find(i => i.code === item.classType);
								return (
									<div className="flex flex-row gap-1 items-center">
										<Image
											src={classType?.image || ''}
											alt={item.classType}
											width={100}
											height={100}
											className="size-4"
										/>
										<span>{classType?.name}</span>
									</div>
								)
									;
							})()}
						</TableCell>
						<TableCell>
							<CopyMarkdown prefix="equip" {...item} name={item.classType + item.gearType}/>
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
									<EquipDialog
										data={item}
										gearTypes={gearTypes}
										classTypes={classTypes}
									>
										<DropdownMenuItem preventSelect>Edit</DropdownMenuItem>
									</EquipDialog>
									<ConfirmDialog
										title={`Delete Equip?`}
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