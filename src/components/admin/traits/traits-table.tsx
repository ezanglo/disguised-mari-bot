"use client";

import { deleteTraitType } from "@/actions/trait-type";
import { TraitDialog } from "@/components/admin/traits/trait-dialog";
import { CopyMarkdown } from "@/components/copy-markdown";
import { TableActions } from "@/components/table-actions";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { traitTypes } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import Image from "next/image";

export type TraitType = InferSelectModel<typeof traitTypes>;

type TraitsTableProps = {
	data: (TraitType & {
		upgradeName: string | null
	})[],
}

export function TraitsTable({
	data,
}: TraitsTableProps) {

	if (data.length === 0) {
		return (
			<div className="flex w-full items-center justify-center h-32 text-muted-foreground border border-muted rounded-md">
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
								{item.image && <Image src={item.image} alt={item.name} width={100} height={100} className="size-5" />}
								{item.name}
								<Badge variant="outline" className="hidden lg:block">
									{item.code}
								</Badge>
							</div>
						</TableCell>
						<TableCell>
							<Badge variant="outline">
								{item.upgradeName}
							</Badge>
						</TableCell>
						<TableCell>
							<CopyMarkdown prefix="trait" {...item} name={item.upgradeType + item.code} />
						</TableCell>
						<TableCell className="text-right">
							<TableActions
								data={item}
								EditComponent={TraitDialog}
								onDelete={(data) => deleteTraitType(data.id)}
								itemName={item.name}
							/>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}