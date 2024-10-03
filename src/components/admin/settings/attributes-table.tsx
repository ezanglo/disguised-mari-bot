"use client";

import { deleteAttributeType } from "@/actions/attribute-type";
import { AttributeDialog } from "@/components/admin/settings/attribute-dialog";
import { CopyMarkdown } from "@/components/copy-markdown";
import { TableActions } from "@/components/table-actions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { attributeTypes } from "@/db/schema";
import useLists from "@/hooks/use-lists";
import { InferSelectModel } from "drizzle-orm";
import Image from "next/image";

type AttributeType = InferSelectModel<typeof attributeTypes>;

export function AttributesTable() {
	const { data, isLoading } = useLists('attributes');

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
				{data.map((item: AttributeType, index: number) => (
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
							<CopyMarkdown prefix="attr" {...item}/>
						</TableCell>
						<TableCell className="text-right">
							<TableActions
								data={item}
								EditComponent={AttributeDialog}
								onDelete={(data) => deleteAttributeType(data.id)}
								itemName={item.name}
								revalidateQuery="attributes"
							/>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}