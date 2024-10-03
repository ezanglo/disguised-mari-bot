"use client";

import { deleteTierType } from "@/actions/tier-type";
import { TierDialog } from "@/components/admin/tiers/tier-dialog";
import { CopyMarkdown } from "@/components/copy-markdown";
import { TableActions } from "@/components/table-actions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { tierTypes } from "@/db/schema";
import useLists from "@/hooks/use-lists";
import { InferSelectModel } from "drizzle-orm";
import Image from "next/image";

export type TierType = InferSelectModel<typeof tierTypes>

export function TiersTable() {

	const { data, isLoading} = useLists('tiers')

	if(isLoading) {
		return (
			<div className="flex w-full items-center justify-center h-32 text-muted-foreground border border-muted rounded-md">
				Loading...
			</div>
		)
	}
	
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
					<TableHead>Emote</TableHead>
					<TableHead>
						<span className="sr-only">Actions</span>
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{data.map((item: TierType, index: number) => (
					<TableRow key={index}>
						<TableCell className="font-medium hidden sm:table-cell">
							{item.id.split('-')[0]}
						</TableCell>
						<TableCell>
							<div className="flex flex-row gap-2 items-center">
								{item.image && <Image src={item.image || ''} alt={item.name} width={100} height={100} className="size-5"/>}
								{item.name}
							</div>
						</TableCell>
						<TableCell>
							<CopyMarkdown prefix="tier" {...item}/>
						</TableCell>
						<TableCell className="text-right">
							<TableActions
								data={item}
								EditComponent={TierDialog}
								onDelete={(data) => deleteTierType(data.id)}
								itemName={item.name}
								revalidateQuery="tiers"
							/>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}