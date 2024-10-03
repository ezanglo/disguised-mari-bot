"use client";

import { deleteEquip } from "@/actions/equip-type";
import { EquipDialog } from "@/components/admin/equips/equip-dialog";
import { CopyMarkdown } from "@/components/copy-markdown";
import { TableActions } from "@/components/table-actions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DEFAULT_IMAGE } from "@/constants/constants";
import { equipTypes } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import Image from "next/image";

export type EquipType = InferSelectModel<typeof equipTypes>;

type EquipsTableProps = {
	data: (EquipType & {
		classImage?: string | null;
		className?: string | null;
		gearName?: string | null;
	})[],
}

export function EquipsTable({
	data
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
								{item.image && (
									<Image
										src={item.image || DEFAULT_IMAGE}
										alt={item.gearType}
										width={100}
										height={100}
										className="size-4"
									/>
								)}
								<span>{item.name}</span>
							</div>
						</TableCell>
						<TableCell>
							<div className="flex flex-row gap-1 items-center">
								<Image
									src={item.classImage || DEFAULT_IMAGE}
									alt={item.classType}
									width={100}
									height={100}
									className="size-4"
								/>
								<span>{item.className}</span>
							</div>
						</TableCell>
						<TableCell>
							<CopyMarkdown prefix="equip" {...item} name={item.classType + item.gearType} />
						</TableCell>
						<TableCell className="text-right">
							<TableActions
								data={item}
								EditComponent={EquipDialog}
								onDelete={(data) => deleteEquip(data.id)}
								itemName={item.name || ''}
							/>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}